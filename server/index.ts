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

// 5c. Check Midtrans Payment Status
app.get("/api/octane/payment-status/:orderId", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
    const status = await MidtransService.checkStatus(String(id));
    res.json(status);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 5d. Midtrans Webhook Notification
app.post(["/api/octane/webhook", "/api/midtrans/notification"], async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = data;

    const isValid = MidtransService.verifySignature(order_id, status_code, gross_amount, signature_key);
    if (!isValid && process.env.NODE_ENV === "production" && MidtransService.isConfigured()) {
      return res.status(403).json({ error: "Invalid signature key" });
    }

    console.log(`[Midtrans Webhook] Order ${order_id} status: ${transaction_status}`);
    res.json({ status: "ok" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
