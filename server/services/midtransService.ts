import crypto from "node:crypto";
import { config } from "../config";

export interface MidtransChargeParams {
  orderId: string;
  grossAmount: number;
  productName?: string;
}

export interface MidtransChargeResult {
  success: boolean;
  orderId: string;
  transactionId?: string;
  grossAmount: number;
  qrUrl?: string;
  qrString?: string;
  expiryTime?: string;
  transactionStatus?: string;
  message?: string;
  fallback?: boolean;
}

export class MidtransService {
  private static getHost(): string {
    const isProd = config.midtrans.isProduction && !config.midtrans.serverKey.startsWith("SB-");
    return isProd ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";
  }

  private static getAuthHeader(): string {
    const key = config.midtrans.serverKey;
    return "Basic " + Buffer.from(key + ":").toString("base64");
  }

  static isConfigured(): boolean {
    return Boolean(config.midtrans.serverKey && config.midtrans.serverKey.trim().length > 5);
  }

  static async createQrisCharge(params: MidtransChargeParams): Promise<MidtransChargeResult> {
    const { orderId, grossAmount } = params;

    if (!this.isConfigured()) {
      return {
        success: false,
        orderId,
        grossAmount,
        fallback: true,
        message: "MIDTRANS_SERVER_KEY belum diisi di .env. Menggunakan QRIS Merchant Cadangan.",
      };
    }

    const host = this.getHost();
    const url = `${host}/v2/charge`;

    try {
      const payload = {
        payment_type: "qris",
        transaction_details: {
          order_id: orderId,
          gross_amount: Math.round(grossAmount),
        },
        qris: {
          acquirer: "gopay",
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: this.getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && (data.status_code === "200" || data.status_code === "201")) {
        const qrAction = data.actions?.find((a: any) => a.name === "generate-qr-code");
        return {
          success: true,
          orderId,
          transactionId: data.transaction_id,
          grossAmount: Number(data.gross_amount) || grossAmount,
          qrUrl: qrAction?.url || "",
          qrString: data.qr_string || "",
          expiryTime: data.expiry_time,
          transactionStatus: data.transaction_status || "pending",
        };
      }

      return {
        success: false,
        orderId,
        grossAmount,
        fallback: true,
        message: data.status_message || `Midtrans API Error (HTTP ${res.status})`,
      };
    } catch (err: any) {
      return {
        success: false,
        orderId,
        grossAmount,
        fallback: true,
        message: err.message || "Gagal menghubungi Midtrans API",
      };
    }
  }

  static async checkStatus(orderId: string) {
    if (!this.isConfigured()) {
      return { success: false, message: "Midtrans belum dikonfigurasi" };
    }

    const host = this.getHost();
    const url = `${host}/v2/${orderId}/status`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: this.getAuthHeader(),
      },
    });

    const data = await res.json();
    return {
      success: res.ok,
      data,
    };
  }

  static verifySignature(orderId: string, statusCode: string, grossAmount: string, signatureKey: string): boolean {
    const serverKey = config.midtrans.serverKey;
    const input = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    const hash = crypto.createHash("sha512").update(input).digest("hex");
    return hash === signatureKey;
  }
}
