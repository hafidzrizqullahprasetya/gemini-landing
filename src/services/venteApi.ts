import rawProducts from "../data/initialProducts.json";

export interface VenteProduct {
  id: number;
  name: string;
  description: string;
  emoji: string;
  image_url: string;
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

export type ProductCategory =
  | "Semua"
  | "AI & LLM"
  | "Dev & Cloud"
  | "Desain & Kreatif"
  | "Office & Edu"
  | "Streaming & Hiburan"
  | "VPN & Sistem";

export interface EnrichedProduct extends VenteProduct {
  category: Exclude<ProductCategory, "Semua">;
  price_idr: number;
  formatted_price: string;
  display_image: string;
  warranty_label: string;
  duration_label: string;
  is_in_stock: boolean;
}

const CATEGORY_MAP: Record<Exclude<ProductCategory, "Semua">, string[]> = {
  "AI & LLM": [
    "gemini",
    "chatgpt",
    "claude",
    "grok",
    "gamma",
    "elevenlabs",
    "eleven",
    "quillbot",
    "ai",
    "codex",
    "lovable",
    "bolt",
    "replit",
    "cursor",
    "speechify",
    "descript",
    "muse",
    "fin ia",
    "granola",
    "higgsfield",
    "manus",
  ],
  "Dev & Cloud": [
    "supabase",
    "railway",
    "posthog",
    "linear",
    "postman",
    "warp",
    "github",
    "n8n",
    "customer.io",
    "resend",
    "gumloop",
    "jam",
    "mobbin",
    "magic patterns",
    "arize",
    "airtable",
    "jetbrains",
  ],
  "Desain & Kreatif": [
    "capcut",
    "figma",
    "framer",
    "canva",
    "adobe",
    "autodesk",
    "wink",
    "supercut",
  ],
  "Office & Edu": [
    "microsoft",
    "office",
    "wordwall",
    "quizlet",
    "notion",
    "miro",
    "ilovepdf",
    "coursera",
    "duolingo",
    "edx",
    "readwise",
    "scribd",
  ],
  "Streaming & Hiburan": [
    "netflix",
    "apple tv",
    "prime video",
    "amazon",
    "youtube",
    "peacock",
    "spotify",
    "hbo",
  ],
  "VPN & Sistem": [
    "vpn",
    "proton",
    "nordvpn",
    "hma",
    "windows",
    "zoom",
    "gmail",
    "outlook",
  ],
};

const BRAND_IMAGES: Record<string, string> = {
  gemini:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  chatgpt:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
  claude:
    "https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=800&q=80",
  grok:
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
  capcut:
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
  canva:
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
  figma:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  framer:
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
  notion:
    "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
  microsoft:
    "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
  youtube:
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
  netflix:
    "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80",
  apple:
    "https://images.unsplash.com/photo-1510519138161-58444c424330?auto=format&fit=crop&w=800&q=80",
  prime:
    "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80",
  nordvpn:
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
  coursera:
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
  duolingo:
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80",
  supabase:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  railway:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
};

export function detectCategory(name: string): Exclude<ProductCategory, "Semua"> {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some((k) => lower.includes(k))) {
      return cat as Exclude<ProductCategory, "Semua">;
    }
  }
  return "Dev & Cloud";
}

export function detectFallbackImage(name: string, category: string): string {
  const lower = name.toLowerCase();
  for (const [key, img] of Object.entries(BRAND_IMAGES)) {
    if (lower.includes(key)) {
      return img;
    }
  }
  if (category === "AI & LLM") {
    return "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80";
  }
  if (category === "Desain & Kreatif") {
    return "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80";
  }
  if (category === "Streaming & Hiburan") {
    return "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80";
  }
  return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80";
}

export function extractDuration(name: string, desc: string): string {
  const combined = `${name} ${desc}`;
  const match = combined.match(/(\d+\s*(?:bulan|month|months|m|tahun|year|years|hari|days|d|yr|w))\b/i);
  if (match && match[1]) {
    return match[1].toUpperCase();
  }
  if (/lifetime/i.test(combined)) return "LIFETIME";
  return "SEBULAN";
}

export function extractWarranty(name: string, desc: string, days: number): string {
  if (days > 0) {
    return `Garansi ${days} Hari`;
  }
  const combined = `${name} ${desc}`;
  if (/FW|Full Warranty|Full Garansi/i.test(combined)) {
    return "Full Garansi";
  }
  if (/W(\d+)D/i.test(combined)) {
    const m = combined.match(/W(\d+)D/i);
    return `Garansi ${m ? m[1] : 7} Hari`;
  }
  if (/W(\d+)H/i.test(combined)) {
    const m = combined.match(/W(\d+)H/i);
    return `Garansi ${m ? m[1] : 24} Jam`;
  }
  if (/NW|No Warranty/i.test(combined)) {
    return "Non-Garansi (Cek Langsung)";
  }
  return "Garansi 24 Jam";
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function enrichProduct(raw: VenteProduct): EnrichedProduct {
  const category = detectCategory(raw.name);
  const rate = 16800;
  const rawIdr = raw.price_usd * rate;
  const price_idr = Math.max(7500, Math.ceil(rawIdr / 500) * 500);

  const display_image =
    raw.image_url && !raw.image_url.includes("placeholder")
      ? raw.image_url
      : detectFallbackImage(raw.name, category);

  return {
    ...raw,
    category,
    price_idr,
    formatted_price: formatIDR(price_idr),
    display_image,
    duration_label: extractDuration(raw.name, raw.description || ""),
    warranty_label: extractWarranty(raw.name, raw.description || "", raw.warranty_days || 0),
    is_in_stock: raw.stock > 0,
  };
}

export const initialEnrichedProducts: EnrichedProduct[] = (
  rawProducts as VenteProduct[]
)
  .filter((p) => p.id !== 2147483000) // Filter out the internal test product
  .map(enrichProduct);

export async function fetchLiveProducts(): Promise<EnrichedProduct[]> {
  try {
    const response = await fetch("/api/reseller/products", {
      headers: {
        "X-Reseller-Key": "vbr_live_ff7171abf6_rRjj5OPO_uX5knZkdK93q_McT-Whr38J__2UYCtgpp4",
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.products && Array.isArray(data.products)) {
        return (data.products as VenteProduct[])
          .filter((p) => p.id !== 2147483000)
          .map(enrichProduct);
      }
    }
  } catch {
    // Silent fallback to local cache
  }
  return initialEnrichedProducts;
}
