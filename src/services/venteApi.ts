import rawProducts from "../data/initialProducts.json";

export interface VenteProduct {
  id: number;
  name: string;
  description: string;
  emoji: string;
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

export function detectCategory(name: string): Exclude<ProductCategory, "Semua"> {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some((k) => lower.includes(k))) {
      return cat as Exclude<ProductCategory, "Semua">;
    }
  }
  return "Dev & Cloud";
}

export function createBrandVectorBadge(name: string, category: string): string {
  const lower = name.toLowerCase();
  let accent = "#ea580c"; // Octane Flame
  let tag = "OCTANE";
  let monogram = "AI";

  if (lower.includes("gemini") || lower.includes("google")) {
    accent = "#3b82f6";
    tag = "GOOGLE AI";
    monogram = "GE";
  } else if (lower.includes("chatgpt") || lower.includes("gpt")) {
    accent = "#10b981";
    tag = "OPENAI";
    monogram = "GPT";
  } else if (lower.includes("claude") || lower.includes("anthropic")) {
    accent = "#d97706";
    tag = "ANTHROPIC";
    monogram = "CL";
  } else if (lower.includes("grok")) {
    accent = "#e2e8f0";
    tag = "X GROK";
    monogram = "X";
  } else if (lower.includes("capcut")) {
    accent = "#0284c7";
    tag = "BYTEDANCE";
    monogram = "CC";
  } else if (lower.includes("canva")) {
    accent = "#06b6d4";
    tag = "CANVA PRO";
    monogram = "CV";
  } else if (lower.includes("figma")) {
    accent = "#8b5cf6";
    tag = "FIGMA EDU";
    monogram = "FG";
  } else if (lower.includes("framer")) {
    accent = "#ec4899";
    tag = "FRAMER PRO";
    monogram = "FR";
  } else if (lower.includes("microsoft") || lower.includes("office")) {
    accent = "#2563eb";
    tag = "MICROSOFT";
    monogram = "MS";
  } else if (lower.includes("notion")) {
    accent = "#64748b";
    tag = "NOTION";
    monogram = "NO";
  } else if (lower.includes("supabase")) {
    accent = "#10b981";
    tag = "SUPABASE";
    monogram = "SB";
  } else if (lower.includes("railway")) {
    accent = "#7c3aed";
    tag = "RAILWAY";
    monogram = "RW";
  } else if (lower.includes("linear")) {
    accent = "#6366f1";
    tag = "LINEAR";
    monogram = "LN";
  } else if (lower.includes("coursera")) {
    accent = "#2563eb";
    tag = "COURSERA";
    monogram = "CS";
  } else if (lower.includes("duolingo")) {
    accent = "#22c55e";
    tag = "DUOLINGO";
    monogram = "DL";
  } else if (lower.includes("zoom")) {
    accent = "#0284c7";
    tag = "ZOOM PRO";
    monogram = "ZM";
  } else if (lower.includes("vpn") || lower.includes("nord") || lower.includes("proton")) {
    accent = "#06b6d4";
    tag = "SECURE VPN";
    monogram = "VPN";
  } else if (lower.includes("netflix") || lower.includes("stream") || lower.includes("tv")) {
    accent = "#e11d48";
    tag = "STREAMING";
    monogram = "TV";
  } else if (lower.includes("youtube")) {
    accent = "#ef4444";
    tag = "YOUTUBE";
    monogram = "YT";
  } else {
    const words = name.replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/).filter(Boolean);
    monogram = (words[0]?.[0] || "O") + (words[1]?.[0] || "P");
    tag = category.toUpperCase();
  }

  const cleanTitle = name
    .slice(0, 24)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="280" viewBox="0 0 480 280">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181818" />
      <stop offset="100%" stop-color="#0a0a0a" />
    </linearGradient>
  </defs>
  <rect width="480" height="280" rx="14" fill="url(#g)" />
  <rect x="1" y="1" width="478" height="278" rx="13" fill="none" stroke="${accent}" stroke-opacity="0.35" stroke-width="1.5" />
  <circle cx="240" cy="110" r="46" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.4" stroke-width="1.5" />
  <text x="240" y="121" text-anchor="middle" font-family="monospace" font-size="26" font-weight="bold" fill="${accent}">${monogram}</text>
  <text x="240" y="195" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="16" font-weight="600" fill="#f8fafc">${cleanTitle}</text>
  <text x="240" y="224" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="${accent}" letter-spacing="2">${tag}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
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
const CUSTOM_PRODUCT_IMAGES: Record<string, string> = {
  gemini: "/products/gemini.webp",
};

export function getProductDisplayImage(name: string, category: string): string {
  const lower = name.toLowerCase();
  for (const [key, path] of Object.entries(CUSTOM_PRODUCT_IMAGES)) {
    if (lower.includes(key)) {
      return path;
    }
  }
  return createBrandVectorBadge(name, category);
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

  const display_image = getProductDisplayImage(raw.name, category);
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
  .filter((p) => p.id !== 2147483000)
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
    // Silent fallback to initial cache
  }
  return initialEnrichedProducts;
}
