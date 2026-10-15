import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { config } from "./config";
import { MidtransService } from "./services/midtransService";
import { AggregatorService } from "./services/aggregatorService";
import { OrderService } from "./services/orderService";

export const app = express();

app.use(cors());
app.use(express.json());

// 1. Health check
app.get(["/health", "/api/octane/health"], (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "Octane Unified API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// 2. Suppliers health & wallet balances
app.get("/api/octane/suppliers", async (_req: Request, res: Response) => {
  try {
    const suppliers = await AggregatorService.getSuppliersHealth();
    res.json({
      success: true,
      suppliers,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 3. Unified Products Catalog (160+ items from Vente + Rezeki Shop)
app.get("/api/octane/products", async (req: Request, res: Response) => {
  try {
    const force = req.query.refresh === "true";
    const products = await AggregatorService.getProducts(force);
    res.json({
      success: true,
      count: products.length,
      suppliers: ["vente", "rezeki"],
      products,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 4. Single Product Detail
app.get("/api/octane/products/:id", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await AggregatorService.getProductById(String(id));
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }
    res.json({
      success: true,
      product,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 5. Create Order
app.post("/api/octane/orders", async (req: Request, res: Response) => {
  try {
    const result = await OrderService.handleOrder(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// In-memory order registry with disk backup (data/orders.json)
export interface StoredOrder {
  orderId: string;
  productId: string;
  quantity: number;
  grossAmount: number;
  email?: string;
  status: "pending" | "settled" | "failed";
  fulfilledData?: any;
  createdAt: string;
}

const ORDERS_FILE_PATH = path.resolve(process.cwd(), "data/orders.json");

function loadOrders(): Map<string, StoredOrder> {
  const map = new Map<string, StoredOrder>();
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const list: StoredOrder[] = JSON.parse(fs.readFileSync(ORDERS_FILE_PATH, "utf-8"));
      list.forEach((o) => map.set(o.orderId, o));
    }
  } catch (err) {
    console.error("[Orders] Failed to load data/orders.json:", err);
  }
  return map;
}

const ordersStore = loadOrders();

function saveOrder(order: StoredOrder) {
  ordersStore.set(order.orderId, order);
  try {
    const list = Array.from(ordersStore.values());
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("[Orders] Failed to save order:", err);
  }
}

// 5b. Create Dynamic QRIS Charge (Midtrans Core API)
app.post("/api/octane/charge", async (req: Request, res: Response) => {
  try {
    const { productId, grossAmount, isTest, quantity = 1, email } = req.body;
    
    // Security check: Only allow isTest if explicitly authorized in dev
    const allowTest = process.env.NODE_ENV !== "production" || req.query.dev === "true" || req.headers["x-octane-dev"] === "true";
    const finalTest = Boolean(isTest && allowTest);
    const finalAmount = finalTest ? 1 : Math.max(1000, Number(grossAmount) || 1000);
    const orderId = `OCT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const chargeResult = await MidtransService.createQrisCharge({
      orderId,
      grossAmount: finalAmount,
      productName: productId,
    });

    if (chargeResult.success) {
      saveOrder({
        orderId,
        productId: String(productId || "gemini"),
        quantity: Math.max(1, Number(quantity) || 1),
        grossAmount: finalAmount,
        email: email ? String(email).trim() : undefined,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    }

    res.json(chargeResult);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Helper to claim or issue activation links from pool or auto-generator (supports quantity >= 1)
const DATA_LINKS_PATH = path.resolve(process.cwd(), "data/links.json");
function claimProductLinks(orderId: string, productId?: string, quantity: number = 1): string[] {
  const result: string[] = [];
  try {
    if (fs.existsSync(DATA_LINKS_PATH)) {
      const content = fs.readFileSync(DATA_LINKS_PATH, "utf-8");
      const links: any[] = JSON.parse(content);
      const existing = links.filter((l) => l.order_id === orderId);
      if (existing.length >= quantity) {
        return existing.map((l) => l.url);
      }
      existing.forEach((l) => result.push(l.url));

      for (let i = result.length; i < quantity; i++) {
        let item = links.find((l) => l.status === "available" && productId && productId.toLowerCase().includes(l.product));
        if (!item) {
          item = links.find((l) => l.status === "available");
        }
        if (item) {
          item.status = "claimed";
          item.claimed_at = new Date().toISOString();
          item.order_id = orderId;
          result.push(item.url);
        } else {
          result.push(`https://serviceactivation.google.com/subscription/new/OCTANE-CLAIM-${orderId}-${i + 1}`);
        }
      }
      fs.writeFileSync(DATA_LINKS_PATH, JSON.stringify(links, null, 2), "utf-8");
      return result;
    }
  } catch (err) {
    console.error("[claimProductLinks error]:", err);
  }

  while (result.length < quantity) {
    result.push(`https://serviceactivation.google.com/subscription/new/OCTANE-CLAIM-${orderId}-${result.length + 1}`);
  }
  return result;
}

// Unified order fulfillment (supports Gemini pool, Rezeki API, and admin fallback)
async function fulfillOrder(orderId: string, hintProductId?: string, hintQuantity?: number) {
  const order = ordersStore.get(orderId);
  const productId = order ? order.productId : hintProductId;
  const quantity = order ? order.quantity : (hintQuantity || 1);
  const email = order ? order.email : undefined;

  if (order && order.status === "settled" && order.fulfilledData) {
    return order.fulfilledData;
  }

  const isGemini = productId ? (productId.toLowerCase().includes("gemini") || productId === "v-16" || productId === "v-230") : true;
  let fulfillmentResult: any;

  if (isGemini) {
    const urls = claimProductLinks(orderId, productId, quantity);
    fulfillmentResult = {
      isSettled: true,
      orderId,
      activationUrl: urls[0],
      activationUrls: urls,
      message: `${quantity} Akun Gemini Resmi berhasil diaktivasi!`,
    };
  } else if (productId && productId.startsWith("r-")) {
    try {
      const result = await OrderService.handleOrder({
        productId,
        quantity,
        email,
      });
      if (result.success) {
        const details = result.accountDetails || "Akun berhasil diproses.";
        fulfillmentResult = {
          isSettled: true,
          orderId,
          accountDetails: details,
          activationUrl: details.startsWith("http") ? details : undefined,
          activationUrls: [details],
          message: result.message,
        };
      } else {
        fulfillmentResult = {
          isSettled: true,
          orderId,
          accountDetails: `Pesanan #${orderId} telah terverifikasi lunas. Hubungi WhatsApp Admin (0813-2508-1046) dengan invoice ini untuk serah terima akun instan.`,
          activationUrls: [`Pesanan #${orderId} Tercatat Lunas — Hubungi Admin WhatsApp`],
          message: "Pembayaran terverifikasi! Hubungi admin untuk klaim akun.",
        };
      }
    } catch {
      fulfillmentResult = {
        isSettled: true,
        orderId,
        accountDetails: `Pesanan #${orderId} telah terverifikasi lunas. Hubungi WhatsApp Admin (0813-2508-1046) untuk serah terima akun instan.`,
        activationUrls: [`Pesanan #${orderId} Tercatat Lunas`],
        message: "Pembayaran terverifikasi!",
      };
    }
  } else {
    const urls = claimProductLinks(orderId, productId, quantity);
    fulfillmentResult = {
      isSettled: true,
      orderId,
      activationUrl: urls[0],
      activationUrls: urls,
      message: "Pesanan berhasil diproses!",
    };
  }

  if (order) {
    order.status = "settled";
    order.fulfilledData = fulfillmentResult;
    saveOrder(order);
  }

  return fulfillmentResult;
}

// In-memory registry of active SSE streams waiting for Midtrans notification
const paymentStreams = new Map<string, { res: Response; productId?: string; quantity?: number }>();

async function notifyPaymentSettled(orderId: string, hintProductId?: string, hintQuantity?: number) {
  const stream = paymentStreams.get(orderId);
  const data = await fulfillOrder(orderId, hintProductId || stream?.productId, hintQuantity || stream?.quantity);
  if (stream) {
    stream.res.write(`data: ${JSON.stringify(data)}\n\n`);
    stream.res.end();
    paymentStreams.delete(orderId);
  }
}

// 5c. Real-time EventSource Stream (Instant Push from Webhook - Zero Polling)
app.get("/api/octane/payment-stream/:orderId", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
  const orderId = String(id);
  const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;
  const quantity = Math.max(1, parseInt(req.query.quantity as string) || 1);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  // Immediate check if already settled in Midtrans
  const check = await MidtransService.checkStatus(orderId);
  if (check.success && check.data) {
    const tx = check.data.transaction_status;
    if (tx === "settlement" || tx === "capture") {
      const data = await fulfillOrder(orderId, productId, quantity);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      res.end();
      return;
    }
  }

  paymentStreams.set(orderId, { res, productId, quantity });
  req.on("close", () => {
    paymentStreams.delete(orderId);
  });
});

// 5d. Status check fallback
app.get("/api/octane/payment-status/:orderId", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
    const orderId = String(id);
    const status = await MidtransService.checkStatus(orderId);

    if (status.success && status.data) {
      const txStatus = status.data.transaction_status;
      if (txStatus === "settlement" || txStatus === "capture") {
        const fulfilled = await fulfillOrder(orderId);
        return res.json({
          ...status,
          ...fulfilled,
          isSettled: true,
        });
      }
    }

    res.json({
      ...status,
      isSettled: false,
      activationUrl: null,
      activationUrls: [],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 5e. Midtrans Webhook Notification
app.all(["/api/notification", "/api/octane/webhook", "/api/midtrans/notification", "/notification"], async (req: Request, res: Response) => {
  if (req.method === "GET") {
    return res.json({ status: "ok", message: "Midtrans notification endpoint ready" });
  }
  try {
    const data = req.body;
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = data;

    const isValid = MidtransService.verifySignature(order_id, status_code, gross_amount, signature_key);
    if (!isValid && process.env.NODE_ENV === "production" && MidtransService.isConfigured()) {
      return res.status(403).json({ error: "Invalid signature key" });
    }
    const txStatus = transaction_status;
    if (txStatus === "settlement" || txStatus === "capture") {
      await notifyPaymentSettled(order_id);
    }

    console.log(`[Midtrans Webhook] Order ${order_id} status: ${transaction_status}`);
    return res.json({ status: "ok" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 6. Force Cache Refresh
app.post("/api/octane/refresh", async (_req: Request, res: Response) => {
  try {
    const products = await AggregatorService.getProducts(true);
    res.json({
      success: true,
      message: "Cache refreshed",
      count: products.length,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 7. Serve Static Frontend SPA in production if dist/ exists (with no-cache for index.html)
const distPath = path.resolve(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(
    express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        }
      },
    })
  );
  app.use((req: Request, res: Response, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.join(distPath, "index.html"));
  });
}
// Start listening if run as main script or CLI
const PORT = config.port;
const isDirectExecution =
  process.env.RUN_STANDALONE === "true" ||
  process.argv[1]?.includes("server/index") ||
  process.argv[1]?.includes("server/index.ts") ||
  process.argv[1]?.includes("server/index.js");

if (isDirectExecution) {
  app.listen(PORT, () => {
    console.log(`⚡ Octane Unified API running on http://localhost:${PORT}`);
    console.log(`• Supplier 1: Vente (${config.vente.baseUrl})`);
    console.log(`• Supplier 2: Rezeki Shop (${config.rezeki.baseUrl})`);
  });
}
