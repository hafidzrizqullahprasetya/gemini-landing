import { config } from "../config";

export interface RezekiRawProduct {
  id: string;
  name: string;
  availability: "in_stock" | "out_of_stock";
  price_idr: number;
  description: string;
  requires_email: boolean;
}

export class RezekiService {
  private static headers() {
    return {
      "X-API-KEY": config.rezeki.apiKey,
      "Content-Type": "application/json",
      "User-Agent": "Octane-API/1.0",
    };
  }

  static async getProfileAndBalance() {
    try {
      const res = await fetch(`${config.rezeki.baseUrl}/v1/profile`, {
        headers: this.headers(),
      });
      if (!res.ok) {
        throw new Error(`Rezeki /v1/profile responded with HTTP ${res.status}`);
      }
      const data = await res.json();
      return {
        available: true,
        currency: "IDR",
        wallet_balance: Number(data.balance) || 0,
        username: data.username || "harieztya",
      };
    } catch (err: any) {
      return {
        available: false,
        currency: "IDR",
        wallet_balance: 0,
        error: err.message,
      };
    }
  }

  static async fetchProducts(): Promise<RezekiRawProduct[]> {
    const res = await fetch(`${config.rezeki.baseUrl}/v1/products`, {
      headers: this.headers(),
    });
    if (!res.ok) {
      throw new Error(`Rezeki /v1/products responded with HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error("Invalid Rezeki products response");
    }
    // Filter test item
    return data.products.filter((p: RezekiRawProduct) => !p.id.includes("test"));
  }

  static async getProductDetail(productId: string) {
    const res = await fetch(`${config.rezeki.baseUrl}/v1/products/${productId}`, {
      headers: this.headers(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.message || `HTTP ${res.status}`);
    }
    return data;
  }

  static async createOrder(productId: string, quantity = 1, email?: string) {
    const body: Record<string, any> = {
      product_id: productId,
      quantity,
      currency: "IDR",
    };
    if (email) {
      body.email = email;
    }

    const res = await fetch(`${config.rezeki.baseUrl}/v1/order`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.message || `HTTP ${res.status}`);
    }
    return data;
  }

  static async getOrder(orderId: string) {
    const res = await fetch(`${config.rezeki.baseUrl}/v1/order/${orderId}`, {
      headers: this.headers(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.message || `HTTP ${res.status}`);
    }
    return data;
  }
}
