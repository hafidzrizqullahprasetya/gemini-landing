import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { config } from "./config";
import { MidtransService } from "./services/midtransService";
import { AggregatorService } from "./services/aggregatorService";
import { OrderService } from "./services/orderService";

export const app = express();

app.use(cors());
app.use(express.json());

// Helper: Verify Admin authorization (via secret key or loopback CLI)
function isAuthorizedAdmin(req: Request): boolean {
  const adminSecret = config.adminSecret;
  const key = (
    req.headers["x-octane-admin-key"] ||
    req.headers["x-admin-key"] ||
    (typeof req.query.admin_key === "string" ? req.query.admin_key : undefined) ||
    (typeof req.query.key === "string" ? req.query.key : undefined) ||
    req.headers["authorization"]?.replace(/^Bearer\s+/i, "")
  );

  if (adminSecret && key === adminSecret) {
    return true;
  }

  // Local loopback CLI access without proxy/tunnel forwarding headers
  const remoteIp = req.socket.remoteAddress || req.ip;
  const isDirectLoopback = (
    (remoteIp === "127.0.0.1" || remoteIp === "::1" || remoteIp === "::ffff:127.0.0.1") &&
    !req.headers["cf-connecting-ip"] &&
    !req.headers["x-forwarded-for"]
  );

  return isDirectLoopback;
}

// Helper: Calculate official retail price server-side (immune to client tampering)
function calculateProductPrice(product: any, quantity: number): number {
  const basePrice = product.price_idr;
  const lowerName = (product.name || "").toLowerCase();

  // Wholesale rules for Gemini 18M
  if (lowerName.includes("gemini") && lowerName.includes("18")) {
    if (quantity >= 10) return 15000;
    if (quantity >= 5) return 16000;
    if (quantity >= 2) return 17000;
  }

  // Wholesale tiers if defined
  if (product.price_tiers && Array.isArray(product.price_tiers) && product.price_tiers.length > 0) {
    for (const tier of product.price_tiers) {
      if (quantity >= tier.min_qty && quantity <= tier.max_qty) {
        const tierIdr = Math.max(8500, Math.ceil((tier.price_usd * config.vente.usdRate) / 500) * 500);
        if (tierIdr < basePrice) {
          return tierIdr;
        }
      }
    }
  }

  return basePrice;
}

// 1. Health check
app.get(["/health", "/api/octane/health"], (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "Octane Unified API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// 2. Suppliers health & wallet balances (Protected: Admin Only)
app.get("/api/octane/suppliers", async (req: Request, res: Response) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(403).json({
      success: false,
      error: "Access denied. Admin authorization required.",
    });
  }
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

// 5. Create Order (Internal Admin / Legacy Only — Public must checkout via /api/octane/charge)
app.post("/api/octane/orders", async (req: Request, res: Response) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(403).json({
      success: false,
      error: "Direct order endpoint is disabled for security. Please checkout via QRIS (/api/octane/charge).",
    });
  }
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
  productName: string;
  supplier: string;
  quantity: number;
  grossAmount: number;
  costAmount: number;
  paymentFee: number;
  netProfit: number;
  email?: string;
  status: "pending" | "settled" | "failed";
  deliveredItems?: string[];
  allDelivered?: boolean;
  pendingCount?: number;
  fulfilledData?: any;
  createdAt: string;
  settledAt?: string;
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
    const { productId, isTest, quantity = 1, email } = req.body;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ success: false, message: "ID produk tidak valid." });
    }

    const cleanProductId = String(productId).trim();
    const product = await AggregatorService.getProductById(cleanProductId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan di katalog Octane." });
    }

    if (!product.is_in_stock) {
      return res.status(400).json({ success: false, message: `Produk "${product.name}" sedang habis stok.` });
    }

    // Sanitize quantity (min 1, max stock)
    const rawQty = parseInt(String(quantity), 10);
    const maxQty = Math.max(1, product.stock || 50);
    const qty = Math.min(Math.max(1, isNaN(rawQty) ? 1 : rawQty), maxQty);

    // Validate email if required
    let sanitizedEmail: string | undefined = undefined;
    if (product.requires_email || product.delivery_type === "custom_email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(String(email).trim())) {
        return res.status(400).json({
          success: false,
          message: "Email valid wajib diisi untuk aktivasi/undangan produk ini.",
        });
      }
      sanitizedEmail = String(email).trim().toLowerCase();
    } else if (email && typeof email === "string" && email.includes("@")) {
      sanitizedEmail = String(email).trim().toLowerCase();
    }

    // SERVER-SIDE ABSOLUTE PRICING — Immune to client tampering
    const unitPrice = calculateProductPrice(product, qty);
    const calculatedTotal = unitPrice * qty;

    // Strict Test Mode: ONLY allowed if caller is authorized admin
    const allowTest = isAuthorizedAdmin(req);
    const finalTest = Boolean(isTest && allowTest);
    const finalAmount = finalTest ? 1 : calculatedTotal;

    // Cryptographically secure, unguessable Order ID (16 random hex chars)
    const secureToken = crypto.randomBytes(8).toString("hex");
    const orderId = `OCT-${Date.now()}-${secureToken}`;

    const chargeResult = await MidtransService.createQrisCharge({
      orderId,
      grossAmount: finalAmount,
      productName: product.name,
    });

    if (chargeResult.success) {
      const productName = product.name;
      const supplier = product.supplier || (cleanProductId.startsWith("r-") ? "rezeki" : "local");
      const unitCost = product.original_cost_raw || 0;
      const costAmount = unitCost * qty;
      const paymentFee = Math.round(finalAmount * 0.007); // 0.7% QRIS fee
      const netProfit = finalAmount - costAmount - paymentFee;

      saveOrder({
        orderId,
        productId: cleanProductId,
        productName,
        supplier,
        quantity: qty,
        grossAmount: finalAmount,
        costAmount,
        paymentFee,
        netProfit,
        email: sanitizedEmail,
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

// Helper to claim links from real pool (returns only genuine available links)
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
          // No more real links in pool
          break;
        }
      }
      fs.writeFileSync(DATA_LINKS_PATH, JSON.stringify(links, null, 2), "utf-8");
      return result;
    }
  } catch (err) {
    console.error("[claimProductLinks error]:", err);
  }

  return result;
}

// Unified order fulfillment (supports sequential pool allocation, Rezeki API, and partial/VIP fallback)
async function fulfillOrder(orderId: string) {
  const order = ordersStore.get(orderId);
  if (!order) {
    console.error(`[Security Alert] fulfillOrder attempted for unknown orderId: ${orderId}`);
    return {
      isSettled: false,
      orderId,
      allDelivered: false,
      message: "Pesanan tidak terdaftar di sistem.",
    };
  }

  if (order.status === "settled" && order.fulfilledData) {
    return order.fulfilledData;
  }

  const productId = order.productId;
  const quantity = Math.max(1, order.quantity || 1);
  const email = order.email;

  const isGemini = productId.toLowerCase().includes("gemini") || productId === "v-16" || productId === "v-230" || productId === "r-az_geminilive";
  const deliveredItems: string[] = [];
  let pendingCount = 0;

  if (isGemini) {
    // 1. First claim any available real links from local links pool
    const localPoolUrls = claimProductLinks(orderId, productId, quantity);
    const realLocalUrls = localPoolUrls.filter((u) => !u.includes("OCT-CLAIM-"));
    deliveredItems.push(...realLocalUrls);

    // 2. If we still need more accounts, sequentially request from Rezeki Shop
    const neededFromSupplier = quantity - deliveredItems.length;
    for (let i = 0; i < neededFromSupplier; i++) {
      try {
        const rezekiResult = await OrderService.handleOrder({
          productId: "r-az_geminilive",
          quantity: 1,
          email,
        });
        if (rezekiResult.success && rezekiResult.accountDetails) {
          let detail = String(rezekiResult.accountDetails).trim();
          if (!detail.startsWith("http") && detail.startsWith("AQC")) {
            detail = `https://serviceactivation.google.com/subscription/new/${detail}`;
          }
          deliveredItems.push(detail);
        } else {
          pendingCount += (neededFromSupplier - i);
          break;
        }
      } catch {
        pendingCount += (neededFromSupplier - i);
        break;
      }
    }
  } else if (productId.startsWith("r-") || productId.startsWith("v-")) {
    // Rezeki (IDR) or Vente (USD) products
    for (let i = 0; i < quantity; i++) {
      try {
        const orderResult = await OrderService.handleOrder({
          productId,
          quantity: 1,
          email,
        });
        if (orderResult.success && orderResult.accountDetails) {
          deliveredItems.push(String(orderResult.accountDetails).trim());
        } else {
          pendingCount += (quantity - i);
          break;
        }
      } catch {
        pendingCount += (quantity - i);
        break;
      }
    }
  } else {
    const urls = claimProductLinks(orderId, productId, quantity);
    deliveredItems.push(...urls);
  }

  // Construct structured response
  let fulfillmentResult: any;
  if (deliveredItems.length === quantity) {
    fulfillmentResult = {
      isSettled: true,
      orderId,
      activationUrl: deliveredItems[0],
      activationUrls: deliveredItems,
      allDelivered: true,
      deliveredCount: quantity,
      pendingCount: 0,
      message: `${quantity} Akun Resmi berhasil diaktivasi secara instan!`,
    };
  } else if (deliveredItems.length > 0) {
    const finalUrls = [...deliveredItems];
    for (let i = 0; i < pendingCount; i++) {
      finalUrls.push(`[Sisa ${pendingCount} Akun Sedang Disiapkan Admin — Klaim via WhatsApp]`);
    }
    fulfillmentResult = {
      isSettled: true,
      orderId,
      activationUrl: deliveredItems[0],
      activationUrls: finalUrls,
      allDelivered: false,
      deliveredCount: deliveredItems.length,
      pendingCount,
      message: `${deliveredItems.length} akun berhasil diserahkan! Sisa ${pendingCount} akun sedang disiapkan Admin via WhatsApp.`,
    };
  } else {
    const pendingNote = `Pesanan #${orderId} Tercatat Lunas — Hubungi Admin WhatsApp untuk Penyerahan Akun`;
    fulfillmentResult = {
      isSettled: true,
      orderId,
      activationUrl: null,
      activationUrls: [pendingNote],
      allDelivered: false,
      deliveredCount: 0,
      pendingCount: quantity,
      message: `Pembayaran terverifikasi! Hubungi admin WhatsApp untuk serah terima ${quantity} akun Anda.`,
    };
  }

  if (order) {
    order.status = "settled";
    order.settledAt = new Date().toISOString();
    order.deliveredItems = deliveredItems;
    order.allDelivered = deliveredItems.length === quantity;
    order.pendingCount = pendingCount;
    order.fulfilledData = fulfillmentResult;
    saveOrder(order);
  }

  return fulfillmentResult;
}

// In-memory registry of active SSE streams waiting for Midtrans notification
const paymentStreams = new Map<string, { res: Response }>();

async function notifyPaymentSettled(orderId: string) {
  const stream = paymentStreams.get(orderId);
  const data = await fulfillOrder(orderId);
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
  const order = ordersStore.get(orderId);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

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
    const paidAmount = Math.round(Number(check.data.gross_amount));
    if ((tx === "settlement" || tx === "capture") && paidAmount >= order.grossAmount) {
      const data = await fulfillOrder(orderId);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      res.end();
      return;
    }
  }

  paymentStreams.set(orderId, { res });
  req.on("close", () => {
    paymentStreams.delete(orderId);
  });
});

// 5d. Status check fallback
app.get("/api/octane/payment-status/:orderId", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
    const orderId = String(id);
    const order = ordersStore.get(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    const status = await MidtransService.checkStatus(orderId);

    if (status.success && status.data) {
      const txStatus = status.data.transaction_status;
      const paidAmount = Math.round(Number(status.data.gross_amount));
      if ((txStatus === "settlement" || txStatus === "capture") && paidAmount >= order.grossAmount) {
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

// 5e. Financial & Transaction Ledger (Protected: Admin Only)
app.get("/api/octane/ledger", async (req: Request, res: Response) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(403).json({
      success: false,
      error: "Access denied. Admin authorization required.",
    });
  }
  try {
    const orders = Array.from(ordersStore.values());
    const settled = orders.filter((o) => o.status === "settled");
    const pending = orders.filter((o) => o.status === "pending");
    const totalRevenue = settled.reduce((sum, o) => sum + (o.grossAmount || 0), 0);
    const totalCogs = settled.reduce((sum, o) => sum + (o.costAmount || 0), 0);
    const totalFees = settled.reduce((sum, o) => sum + (o.paymentFee || 0), 0);
    const totalNetProfit = totalRevenue - totalCogs - totalFees;
    const marginPercent = totalRevenue > 0 ? ((totalNetProfit / totalRevenue) * 100).toFixed(1) : "0.0";

    // Read links pool state
    let linksPool: any[] = [];
    try {
      if (fs.existsSync(DATA_LINKS_PATH)) {
        linksPool = JSON.parse(fs.readFileSync(DATA_LINKS_PATH, "utf-8"));
      }
    } catch {}

    const totalLinks = linksPool.length;
    const availableLinks = linksPool.filter((l) => l.status === "available").length;
    const claimedLinks = linksPool.filter((l) => l.status === "claimed");

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalOrdersCount: orders.length,
        settledCount: settled.length,
        pendingCount: pending.length,
        totalRevenueIdr: totalRevenue,
        totalCogsIdr: totalCogs,
        totalPaymentFeesIdr: totalFees,
        totalNetProfitIdr: totalNetProfit,
        marginPercentage: `${marginPercent}%`,
      },
      linksPool: {
        total: totalLinks,
        available: availableLinks,
        claimed: claimedLinks.length,
        claimedLinks: claimedLinks.map((l) => ({
          id: l.id,
          product: l.product,
          orderId: l.order_id,
          claimedAt: l.claimed_at,
          url: l.url,
        })),
      },
      orders: orders.slice(-50).reverse(),
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 5f. Midtrans Webhook Notification
app.all(["/api/notification", "/api/octane/webhook", "/api/midtrans/notification", "/notification"], async (req: Request, res: Response) => {
  if (req.method === "GET") {
    return res.json({ status: "ok", message: "Midtrans notification endpoint ready" });
  }
  try {
    const data = req.body;
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = data;

    if (!order_id) {
      return res.status(400).json({ error: "Missing order_id" });
    }

    const order = ordersStore.get(order_id);
    if (!order) {
      console.warn(`[Midtrans Webhook] Received webhook for unregistered order: ${order_id}`);
      return res.status(404).json({ error: "Order not found" });
    }

    const isValid = MidtransService.verifySignature(order_id, status_code, gross_amount, signature_key);
    if (!isValid && process.env.NODE_ENV === "production" && MidtransService.isConfigured()) {
      console.error(`[Security Alert] Invalid webhook signature for order: ${order_id}`);
      return res.status(403).json({ error: "Invalid signature key" });
    }

    const paidAmount = Math.round(Number(gross_amount));
    if (paidAmount < order.grossAmount) {
      console.error(`[Security Alert] Underpaid order ${order_id}: expected ${order.grossAmount}, got ${paidAmount}`);
      return res.status(400).json({ error: "Paid amount less than order gross amount" });
    }

    const txStatus = transaction_status;
    if (txStatus === "settlement" || txStatus === "capture") {
      await notifyPaymentSettled(order_id);
    }

    console.log(`[Midtrans Webhook] Order ${order_id} settled successfully (Amount: Rp ${paidAmount})`);
    return res.json({ status: "ok" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 6. Force Cache Refresh (Protected: Admin Only)
app.post("/api/octane/refresh", async (req: Request, res: Response) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(403).json({
      success: false,
      error: "Access denied. Admin authorization required.",
    });
  }
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
