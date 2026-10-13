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

// 5b. Create Dynamic QRIS Charge (Midtrans Core API)
app.post("/api/octane/charge", async (req: Request, res: Response) => {
  try {
    const { productId, grossAmount, isTest } = req.body;
    const finalAmount = isTest ? 1 : Number(grossAmount) || 1;
    const orderId = `OCT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const chargeResult = await MidtransService.createQrisCharge({
      orderId,
      grossAmount: finalAmount,
      productName: productId,
    });

    res.json(chargeResult);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Helper to claim or issue activation link from pool or auto-generator
const DATA_LINKS_PATH = path.resolve(process.cwd(), "data/links.json");
function claimProductLink(orderId: string, productId?: string): string {
  try {
    if (fs.existsSync(DATA_LINKS_PATH)) {
      const content = fs.readFileSync(DATA_LINKS_PATH, "utf-8");
      const links: any[] = JSON.parse(content);
      const existing = links.find((l) => l.order_id === orderId);
      if (existing) return existing.url;

      let item = links.find((l) => l.status === "available" && productId && productId.toLowerCase().includes(l.product));
      if (!item) {
        item = links.find((l) => l.status === "available");
      }

      if (item) {
        item.status = "claimed";
        item.claimed_at = new Date().toISOString();
        item.order_id = orderId;
        fs.writeFileSync(DATA_LINKS_PATH, JSON.stringify(links, null, 2), "utf-8");
        return item.url;
      }
    }
  } catch (err) {
    console.error("[claimProductLink error]:", err);
  }
  return `https://serviceactivation.google.com/subscription/new/OCTANE-CLAIM-${orderId}`;
}
// In-memory registry of active SSE streams waiting for Midtrans notification
const paymentStreams = new Map<string, { res: Response; productId?: string }>();

function notifyPaymentSettled(orderId: string, productId?: string, activationUrl?: string) {
  const stream = paymentStreams.get(orderId);
  if (stream) {
    const finalUrl = activationUrl || claimProductLink(orderId, productId || stream.productId);
    stream.res.write(`data: ${JSON.stringify({ isSettled: true, orderId, activationUrl: finalUrl })}\n\n`);
    stream.res.end();
    paymentStreams.delete(orderId);
  }
}

// 5c. Real-time EventSource Stream (Instant Push from Webhook - Zero Polling)
app.get("/api/octane/payment-stream/:orderId", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
  const orderId = String(id);
  const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;

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
      const url = claimProductLink(orderId, productId);
      res.write(`data: ${JSON.stringify({ isSettled: true, orderId, activationUrl: url })}\n\n`);
      res.end();
      return;
    }
  }

  paymentStreams.set(orderId, { res, productId });
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

    let isSettled = false;
    let activationUrl: string | null = null;

    if (status.success && status.data) {
      const txStatus = status.data.transaction_status;
      if (txStatus === "settlement" || txStatus === "capture") {
        isSettled = true;
        const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;
        activationUrl = claimProductLink(orderId, productId);
      }
    }

    res.json({
      ...status,
      isSettled,
      activationUrl,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 5d. Midtrans Webhook Notification
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
      const actUrl = claimProductLink(order_id);
      notifyPaymentSettled(order_id, undefined, actUrl);
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

// 7. Serve Static Frontend SPA in production if dist/ exists
const distPath = path.resolve(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req: Request, res: Response, next) => {
    if (req.path.startsWith("/api/")) return next();
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
