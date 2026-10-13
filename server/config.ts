import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",

  // Supplier 1: Vente Telegram Bot Reseller API
  vente: {
    baseUrl:
      process.env.VENTE_BASE_URL ||
      "https://ventetelegrambotrailway-production.up.railway.app",
    apiKey: process.env.VENTE_API_KEY || "",
    usdRate: Number(process.env.VENTE_USD_RATE) || 16800,
  },

  // Supplier 2: Rezeki Shop API (Prastya Neki)
  rezeki: {
    baseUrl: process.env.REZEKI_BASE_URL || "https://api.prastyaaneki.biz.id",
    apiKey: process.env.REZEKI_API_KEY || "",
    marginPercent: Number(process.env.REZEKI_MARGIN_PERCENT) || 15, // 15% margin on IDR products
    minPriceIdr: Number(process.env.REZEKI_MIN_PRICE_IDR) || 8500,
  },

  // Payment Gateway: Midtrans Core API (Dynamic QRIS)
  midtrans: {
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
    isProduction: process.env.MIDTRANS_IS_PRODUCTION !== "false",
  },

  // Cache settings
  cacheTtlSeconds: 60,
};
