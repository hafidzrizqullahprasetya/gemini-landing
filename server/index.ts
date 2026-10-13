import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
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
