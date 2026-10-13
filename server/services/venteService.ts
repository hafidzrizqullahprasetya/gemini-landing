import { config } from "../config";

export interface VenteRawProduct {
  id: number;
  name: string;
  description: string;
  emoji?: string;
  image_url: string | null;
  price_usd: number;
  warranty_days: number;
  delivery_type: string;
  api_test: boolean;
  stock: number;
  price_tiers?: Array<{
    min_qty: number;
    max_qty: number;
    price_usd: number;
  }>;
  pricing_type: string;
}

export class VenteService {
  private static headers() {
    return {
      "X-Reseller-Key": config.vente.apiKey,
      "Content-Type": "application/json",
      "User-Agent": "Octane-API/1.0",
    };
  }

  static async getProfileAndBalance() {
    try {
      const res = await fetch(`${config.vente.baseUrl}/api/reseller/me`, {
        headers: this.headers(),
      });
      if (!res.ok) {
        throw new Error(`Vente /me responded with HTTP ${res.status}`);
      }
      const data = await res.json();
      return {
        available: true,
        currency: "USD",
        wallet_balance: Number(data.wallet_balance) || 0,
        username: data.username || "harieztya",
      };
    } catch (err: any) {
      return {
        available: false,
        currency: "USD",
        wallet_balance: 0,
        error: err.message,
      };
    }
  }

  static async fetchProducts(): Promise<VenteRawProduct[]> {
    const res = await fetch(`${config.vente.baseUrl}/api/reseller/products`, {
      headers: this.headers(),
    });
    if (!res.ok) {
      throw new Error(`Vente /products responded with HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error("Invalid Vente products response");
    }
    // Filter test item (ID 2147483000)
    return data.products.filter((p: VenteRawProduct) => p.id !== 2147483000);
  }

  static async createOrder(productId: number, quantity = 1, activationIdentifier?: string) {
    const body: Record<string, any> = {
      product_id: productId,
      quantity,
    };
    if (activationIdentifier) {
      body.activation_identifier = activationIdentifier;
    }

    const res = await fetch(`${config.vente.baseUrl}/api/reseller/orders`, {
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

  static async getOrder(orderId: string | number) {
    const res = await fetch(`${config.vente.baseUrl}/api/reseller/orders/${orderId}`, {
      headers: this.headers(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.message || `HTTP ${res.status}`);
    }
    return data;
  }
}
