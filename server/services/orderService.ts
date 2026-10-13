import { AggregatorService } from "./aggregatorService";
import { VenteService } from "./venteService";
import { RezekiService } from "./rezekiService";
import type { CreateOrderPayload, OrderResult } from "../types";

export class OrderService {
  static async handleOrder(payload: CreateOrderPayload): Promise<OrderResult> {
    const { productId, email, quantity = 1 } = payload;

    const product = await AggregatorService.getProductById(productId);
    if (!product) {
      return {
        success: false,
        supplier: productId.startsWith("r-") ? "rezeki" : "vente",
        productName: "Unknown Product",
        totalPriceIdr: 0,
        status: "failed",
        message: `Produk dengan ID ${productId} tidak ditemukan di katalog Octane.`,
      };
    }

    if (!product.is_in_stock) {
      return {
        success: false,
        supplier: product.supplier,
        productName: product.name,
        totalPriceIdr: product.price_idr * quantity,
        status: "failed",
        message: `Maaf, produk "${product.name}" saat ini sedang habis stok di supplier.`,
      };
    }

    if (product.requires_email && !email) {
      return {
        success: false,
        supplier: product.supplier,
        productName: product.name,
        totalPriceIdr: product.price_idr * quantity,
        status: "pending_email",
        message: `Produk ini membutuhkan email pembeli untuk aktivasi akun/undangan.`,
      };
    }

    try {
      if (product.supplier === "vente") {
        const venteOrder = await VenteService.createOrder(
          Number(product.supplier_product_id),
          quantity,
          email
        );
        return {
          success: true,
          supplier: "vente",
          orderId: `OCT-${Date.now()}-V`,
          supplierOrderId: venteOrder.order_id || venteOrder.id,
          productName: product.name,
          totalPriceIdr: product.price_idr * quantity,
          accountDetails: venteOrder.credentials || venteOrder.result || "Pesanan berhasil diproses oleh bot Vente.",
          status: "completed",
          message: "Pesanan berhasil diproses!",
        };
      } else {
        const rezekiOrder = await RezekiService.createOrder(
          String(product.supplier_product_id),
          quantity,
          email
        );
        return {
          success: true,
          supplier: "rezeki",
          orderId: `OCT-${Date.now()}-R`,
          supplierOrderId: rezekiOrder.order_id || rezekiOrder.id,
          productName: product.name,
          totalPriceIdr: product.price_idr * quantity,
          accountDetails: rezekiOrder.data || rezekiOrder.credentials || rezekiOrder.message || "Pesanan berhasil diproses oleh bot Rezeki Shop.",
          status: "completed",
          message: "Pesanan berhasil diproses!",
        };
      }
    } catch (err: any) {
      return {
        success: false,
        supplier: product.supplier,
        productName: product.name,
        totalPriceIdr: product.price_idr * quantity,
        status: "failed",
        message: err.message || "Gagal memproses pesanan ke supplier. Pastikan saldo deposit mencukupi.",
      };
    }
  }
}
