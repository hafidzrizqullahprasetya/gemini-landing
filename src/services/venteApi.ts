import rawProducts from "../data/initialProducts.json";

export interface VenteProduct {
  id: number | string;
  supplier?: "vente" | "rezeki";
  name: string;
  description: string;
  emoji?: string;
  image_url?: string | null;
  price_usd?: number;
  warranty_days?: number;
  delivery_type?: string;
  api_test?: boolean;
  stock: number;
  price_tiers?: Array<{
    min_qty: number;
    max_qty: number;
    price_usd: number;
  }>;
  pricing_type?: string;
  requires_email?: boolean;
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
    "wispr",
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
    "alight motion",
    "meitu",
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
    "gmail",
    "outlook",
    "hotmail",
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
    "expressvpn",
    "avira",
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
  } else if (lower.includes("netflix")) {
    accent = "#e50914";
    tag = "NETFLIX";
    monogram = "NF";
  } else if (lower.includes("spotify")) {
    accent = "#1db954";
    tag = "SPOTIFY";
    monogram = "SP";
  } else if (lower.includes("gmail") || lower.includes("outlook") || lower.includes("hotmail")) {
    accent = "#ea4335";
    tag = "MAIL SUITE";
    monogram = "EM";
  } else if (lower.includes("wispr")) {
    accent = "#8b5cf6";
    tag = "WISPR AI";
    monogram = "WF";
  } else if (lower.includes("edx")) {
    accent = "#0284c7";
    tag = "EDX EDU";
    monogram = "EX";
  } else if (lower.includes("alight")) {
    accent = "#ec4899";
    tag = "ALIGHT";
    monogram = "AM";
  } else if (lower.includes("stream") || lower.includes("tv") || lower.includes("hbo")) {
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

export function extractDuration(name: string, desc = ""): string {
  const combined = `${name} ${desc}`;
  if (/\blifetime\b/i.test(combined)) return "LIFETIME";

  const dayMatch = combined.match(/(\d+)\s*(?:hari|days?|day)\b/i);
  if (dayMatch && dayMatch[1]) {
    return `${dayMatch[1]} HARI`;
  }
  const shortDay = combined.match(/\b(\d{1,3})\s*D\b/i);
  if (shortDay && shortDay[1] && Number(shortDay[1]) <= 365) {
    return `${shortDay[1]} HARI`;
  }

  const yrMatch = combined.match(/(\d+)\s*(?:tahun|years?|year|yr|yrs)\b/i);
  if (yrMatch && yrMatch[1]) {
    return `${yrMatch[1]} TAHUN`;
  }

  const monthMatch = combined.match(/(\d+)\s*(?:bulan|months?|month|bln)\b/i);
  if (monthMatch && monthMatch[1]) {
    return `${monthMatch[1]} BULAN`;
  }
  const shortM = combined.match(/\b(\d{1,2})\s*M\b(?!\s*token)/i);
  if (shortM && shortM[1] && Number(shortM[1]) <= 36) {
    return `${shortM[1]} BULAN`;
  }
  const shortB = combined.match(/\b(\d{1,2})\s*B\b/i);
  if (shortB && shortB[1] && Number(shortB[1]) <= 36) {
    return `${shortB[1]} BULAN`;
  }

  return "1 BULAN";
}

export function extractWarranty(name: string, desc = "", days = 0): string {
  if (days > 0) {
    return `Garansi ${days} Hari`;
  }
  const combined = `${name} ${desc}`;
  if (/FW|Full Warranty|Full Garansi/i.test(combined)) {
    return "Full Garansi";
  }
  const mw = combined.match(/W(\d+)D/i);
  if (mw && mw[1]) {
    return `Garansi ${mw[1]} Hari`;
  }
  const mh = combined.match(/W(\d+)H/i);
  if (mh && mh[1]) {
    return `Garansi ${mh[1]} Jam`;
  }
  if (/NW|No Warranty/i.test(combined)) {
    return "Non-Garansi (Cek Langsung)";
  }
  return "Garansi Resmi";
}
const CUSTOM_PRODUCT_IMAGES: Array<[string, string]> = [
  ["gemini", "/products/gemini.webp"],
  ["google ai", "/products/gemini.webp"],
  ["chatgpt", "/products/chatgpt.webp"],
  ["claude", "/products/claude.webp"],
  ["codex", "/products/codex.webp"],
  ["capcut", "/products/capcut.webp"],
  ["wordwall", "/products/wordwall.webp"],
  ["gamma", "/products/gamma.webp"],
  ["microsoft", "/products/office365.webp"],
  ["office", "/products/office365.webp"],
  ["zoom", "/products/zoom.webp"],
  ["quizlet", "/products/quizlet.webp"],
  ["figma", "/products/figma.webp"],
  ["ilovepdf", "/products/ilovepdf.webp"],
  ["prime video", "/products/prime-video.webp"],
  ["prime", "/products/prime-video.webp"],
  ["adobe", "/products/adobe-express.webp"],
  ["wink", "/products/wink.webp"],
  ["jetbrains", "/products/jetbrains.webp"],
  ["autodesk", "/products/autodesk.webp"],
  ["customer.io", "/products/customerio.webp"],
  ["fin ia", "/products/fin.webp"],
  ["framer", "/products/framer.webp"],
  ["granola", "/products/granola.webp"],
  ["jam", "/products/jam.webp"],
  ["linear", "/products/linear.webp"],
  ["mobbin", "/products/mobbin.webp"],
  ["posthog", "/products/posthog.webp"],
  ["railway", "/products/railway.webp"],
  ["readwise", "/products/readwise.webp"],
  ["resend", "/products/resend.webp"],
  ["supercut", "/products/supercut.webp"],
  ["hma", "/products/hma.webp"],
  ["magic patterns", "/products/magic-patterns.webp"],
  ["warp", "/products/warp-build.webp"],
  ["eleven reader", "/products/elevenreader.webp"],
  ["elevenlabs", "/products/elevenlabs.webp"],
  ["eleven", "/products/elevenlabs.webp"],
  ["notion", "/products/notion.webp"],
  ["replit", "/products/replit.webp"],
  ["n8n", "/products/n8n.webp"],
  ["miro", "/products/miro.webp"],
  ["mercury", "/products/mercury.webp"],
  ["nordvpn", "/products/nord-vpn.webp"],
  ["nord", "/products/nord-vpn.webp"],
  ["youtube", "/products/yt-premium.webp"],
  ["apple tv", "/products/apple-tv.webp"],
  ["lovable", "/products/lovable.webp"],
  ["duolingo", "/products/duolingo.webp"],
  ["scribd", "/products/scribd.webp"],
  ["bolt", "/products/bolt.webp"],
  ["airtable", "/products/airtable.webp"],
  ["speechify", "/products/speechify.webp"],
  ["descript", "/products/descript.webp"],
  ["supabase", "/products/supabase.webp"],
  ["arize", "/products/arize.webp"],
  ["azure", "/products/arize.webp"],
  ["grok", "/products/grok.webp"],
  ["coursera", "/products/coursera.webp"],
  ["netflix", "/products/netflix.webp"],
  ["canva", "/products/canva.webp"],
  ["spotify", "/products/spotify.webp"],
  ["gmail", "/products/gmail.webp"],
  ["outlook", "/products/gmail.webp"],
  ["cursor", "/products/cursor.webp"],
  ["expressvpn", "/products/expressvpn.webp"],
  ["proton", "/products/proton.webp"],
  ["alight", "/products/alight-motion.webp"],
  ["hbo", "/products/hbo-max.webp"],
  ["quillbot", "/products/quillbot.webp"],
  ["runway", "/products/runway.webp"],
  ["trading", "/products/tradingview.webp"],
  ["edx", "/products/edx.webp"],
  ["wispr", "/products/wispr-flow.webp"],
  ["meitu", "/products/meitu.webp"],
  ["muse", "/products/muse.webp"],
  ["windows", "/products/windows11.webp"],
];

export function cleanHtmlAndTelegramTags(text = ""): string {
  if (!text) return "";
  let clean = text.replace(/<tg-emoji[^>]*>(.*?)<\/tg-emoji>/gi, "$1");
  clean = clean.replace(/<[^>]+>/g, "");
  clean = clean.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
  clean = clean.replace(/[━─=\-]{4,}/g, "");
  clean = clean.replace(/🛍️\s*PRODUCT INFORMATION/gi, "");
  return clean.trim();
}

export function cleanProductName(name: string): string {
  let clean = cleanHtmlAndTelegramTags(name);
  clean = clean.replace(/\bCLaude\b/g, "Claude");
  clean = clean.replace(/\bChatgpt\b/gi, "ChatGPT");
  clean = clean.replace(/\bCapcut\b/gi, "CapCut");
  clean = clean.replace(/^[🔑⚡🛍️🔹✨👑🚀]\s*/, "");
  clean = clean.replace(/^Slot\s*-\s*/i, "");
  clean = clean.replace(/^Key\s*🔑?\s*/i, "");

  const mBal = clean.match(/(\d+)\$\s*API\s*Claude\s*[-–—]?\s*(\d+)\s*(?:days?|day)/i);
  if (mBal) {
    return `Claude API $${mBal[1]} Balance (${mBal[2]} Hari)`;
  }
  const mTok = clean.match(/API\s*(CLAUDE|CODEX)\s*[-–—]?\s*(\d+M)\s*Token\s*[-–—]?\s*(\d+)\s*(?:days?|day)/i);
  if (mTok) {
    const brand = mTok[1].toUpperCase() === "CLAUDE" ? "Claude" : "Codex";
    return `${brand} API ${mTok[2]} Token (${mTok[3]} Hari)`;
  }

  clean = clean.replace(/\s*\((?:BHF|FW|NW|W\d+D|W\d+H)\)/g, "");
  return clean.trim();
}

export function getProductDisplayImage(name: string, category: string): string {
  const lower = name.toLowerCase();
  for (const [key, path] of CUSTOM_PRODUCT_IMAGES) {
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

export function enrichProduct(raw: VenteProduct & { price_idr?: number }): EnrichedProduct {
  const name = cleanProductName(raw.name);
  const description = cleanHtmlAndTelegramTags(raw.description);
  const category = detectCategory(name);
  let price_idr = raw.price_idr;
  if (!price_idr || price_idr <= 0) {
    const rate = 16800;
    const rawIdr = (raw.price_usd || 0) * rate;
    price_idr = Math.max(7500, Math.ceil(rawIdr / 500) * 500);
  }

  const display_image = getProductDisplayImage(name, category);
  return {
    ...raw,
    name,
    description,
    category,
    price_idr,
    formatted_price: formatIDR(price_idr),
    display_image,
    duration_label: extractDuration(name, description),
    warranty_label: extractWarranty(name, description, raw.warranty_days || 0),
    is_in_stock: raw.stock > 0,
  };
}

export const initialEnrichedProducts: EnrichedProduct[] = (
  rawProducts as VenteProduct[]
)
  .filter((p) => p.id !== 2147483000)
  .map(enrichProduct);

export async function fetchLiveProducts(): Promise<EnrichedProduct[]> {
  // 1. Try Octane Unified Multi-Supplier API
  try {
    const octaneRes = await fetch("/api/octane/products");
    if (octaneRes.ok) {
      const data = await octaneRes.json();
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        return data.products.map(enrichProduct);
      }
    }
  } catch {
    // Fall through to Vente or cache
  }

  // 2. Direct Vente fallback
  try {
    const response = await fetch("/api/reseller/products");
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
