export type SupplierSource = "vente" | "rezeki";

export type ProductCategory =
  | "Semua"
  | "AI & LLM"
  | "Dev & Cloud"
  | "Desain & Kreatif"
  | "Office & Edu"
  | "Streaming & Hiburan"
  | "VPN & Sistem";

export interface OctaneProduct {
  id: string; // e.g. "v-102" or "r-6a612473af18a2a83bc049a0"
  supplier: SupplierSource;
  supplier_product_id: string | number;
  name: string;
  description: string;
  category: Exclude<ProductCategory, "Semua">;

  // Pricing in IDR
  price_idr: number;
  formatted_price: string;
  original_cost_raw?: number;
  original_currency?: string;

  // Stock & Availability
  stock: number;
  is_in_stock: boolean;

  // Metadata
  duration_label: string;
  warranty_label: string;
  display_image: string;
  requires_email: boolean;
  delivery_type: "instant" | "custom_email" | "manual";
}

export interface SupplierHealth {
  source: SupplierSource;
  name: string;
  available: boolean;
  currency: string;
  wallet_balance: number;
  username?: string;
  error?: string;
}

export interface CreateOrderPayload {
  productId: string;
  email?: string;
  quantity?: number;
}

export interface OrderResult {
  success: boolean;
  orderId?: string;
  supplier: SupplierSource;
  supplierOrderId?: string | number;
  productName: string;
  totalPriceIdr: number;
  accountDetails?: string;
  status: "completed" | "processing" | "pending_email" | "failed";
  message: string;
}
