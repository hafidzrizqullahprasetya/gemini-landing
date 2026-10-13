import { config } from "../config";
import type { OctaneProduct, ProductCategory, SupplierHealth } from "../types";
import { VenteService } from "./venteService";
import type { VenteRawProduct } from "./venteService";
import { RezekiService } from "./rezekiService";
import type { RezekiRawProduct } from "./rezekiService";
import initialVenteData from "../../src/data/initialProducts.json";

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
    "canva",
    "figma",
    "framer",
    "capcut",
    "adobe",
    "photoshop",
    "autodesk",
    "wink",
    "supercut",
    "freepik",
    "meitu",
    "alight motion",
  ],
  "Office & Edu": [
    "office",
    "microsoft",
    "wordwall",
    "quizlet",
    "notion",
    "zoom",
    "ilovepdf",
    "coursera",
    "duolingo",
    "readwise",
    "scribd",
    "gmail",
    "outlook",
    "hotmail",
    "edx",
    "miro",
  ],
  "Streaming & Hiburan": [
    "netflix",
    "spotify",
    "hbo",
    "prime",
    "apple tv",
    "youtube",
    "disney",
    "vidio",
  ],
  "VPN & Sistem": [
    "vpn",
    "nord",
    "hma",
    "expressvpn",
    "avira",
    "mercury",
    "antivirus",
  ],
};

function detectCategory(name: string): Exclude<ProductCategory, "Semua"> {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return cat as Exclude<ProductCategory, "Semua">;
      }
    }
  }
  return "AI & LLM";
}

function extractDuration(name: string, desc = ""): string {
  const combined = `${name} ${desc}`;
  if (/\blifetime\b/i.test(combined)) return "LIFETIME";

  // Days: e.g. "3Day", "7 Days", "30 Hari", "14D"
  const dayMatch = combined.match(/(\d+)\s*(?:hari|days?|day)\b/i);
  if (dayMatch && dayMatch[1]) {
    return `${dayMatch[1]} HARI`;
  }
  const shortDay = combined.match(/\b(\d{1,3})\s*D\b/i);
  if (shortDay && shortDay[1] && Number(shortDay[1]) <= 365) {
    return `${shortDay[1]} HARI`;
  }

  // Years: e.g. "1 Tahun", "2 Years", "2 yrs", "1 Yr"
  const yrMatch = combined.match(/(\d+)\s*(?:tahun|years?|year|yr|yrs)\b/i);
  if (yrMatch && yrMatch[1]) {
    return `${yrMatch[1]} TAHUN`;
  }

  // Months: e.g. "1 Bulan", "6 Months", "12M", "2B"
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

function extractWarranty(name: string, desc = "", days = 0): string {
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
  ["grok", "/products/grok.webp"],
  ["coursera", "/products/coursera.webp"],
];

function getDisplayImage(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, path] of CUSTOM_PRODUCT_IMAGES) {
    if (lower.includes(key)) {
      return path;
    }
  }
  return "";
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export class AggregatorService {
  private static cachedProducts: OctaneProduct[] = [];
  private static lastFetchTime = 0;
  private static isFetching = false;

  private static transformVente(raw: VenteRawProduct): OctaneProduct {
    const category = detectCategory(raw.name);
    const rawIdr = raw.price_usd * config.vente.usdRate;
    const price_idr = Math.max(7500, Math.ceil(rawIdr / 500) * 500);

    return {
      id: `v-${raw.id}`,
      supplier: "vente",
      supplier_product_id: raw.id,
      name: raw.name,
      description: raw.description || "",
      category,
      price_idr,
      formatted_price: formatIDR(price_idr),
      original_cost_raw: raw.price_usd,
      original_currency: "USD",
      stock: raw.stock,
      is_in_stock: raw.stock > 0,
      duration_label: extractDuration(raw.name, raw.description),
      warranty_label: extractWarranty(raw.name, raw.description, raw.warranty_days),
      display_image: getDisplayImage(raw.name),
      requires_email: raw.delivery_type === "custom_email",
      delivery_type: raw.delivery_type === "custom_email" ? "custom_email" : "instant",
    };
  }

  private static transformRezeki(raw: RezekiRawProduct): OctaneProduct {
    const category = detectCategory(raw.name);
    // 15% markup rounded to nearest 500, minimum minPriceIdr (Rp 8.500)
    const cost = raw.price_idr;
    const price_idr = Math.max(
      config.rezeki.minPriceIdr,
      Math.ceil((cost * (1 + config.rezeki.marginPercent / 100)) / 500) * 500
    );
    const inStock = raw.availability === "in_stock";

    return {
      id: `r-${raw.id}`,
      supplier: "rezeki",
      supplier_product_id: raw.id,
      name: raw.name.trim(),
      description: raw.description || "",
      category,
      price_idr,
      formatted_price: formatIDR(price_idr),
      original_cost_raw: cost,
      original_currency: "IDR",
      stock: inStock ? 10 : 0,
      is_in_stock: inStock,
      duration_label: extractDuration(raw.name, raw.description),
      warranty_label: extractWarranty(raw.name, raw.description, 0),
      display_image: getDisplayImage(raw.name),
      requires_email: Boolean(raw.requires_email),
      delivery_type: raw.requires_email ? "custom_email" : "instant",
    };
  }

  static async getProducts(forceRefresh = false): Promise<OctaneProduct[]> {
    const now = Date.now();
    const cacheValid = now - this.lastFetchTime < config.cacheTtlSeconds * 1000;

    if (this.cachedProducts.length > 0 && cacheValid && !forceRefresh) {
      return this.cachedProducts;
    }

    if (this.isFetching && this.cachedProducts.length > 0) {
      return this.cachedProducts;
    }

    this.isFetching = true;

    try {
      const [venteRes, rezekiRes] = await Promise.allSettled([
        VenteService.fetchProducts(),
        RezekiService.fetchProducts(),
      ]);

      const items: OctaneProduct[] = [];

      if (venteRes.status === "fulfilled" && Array.isArray(venteRes.value)) {
        venteRes.value.forEach((p) => items.push(this.transformVente(p)));
      } else {
        // Fallback to static cache for Vente if API has hiccup
        (initialVenteData as any[])
          .filter((p) => p.id !== 2147483000)
          .forEach((p) => items.push(this.transformVente(p)));
      }

      if (rezekiRes.status === "fulfilled" && Array.isArray(rezekiRes.value)) {
        rezekiRes.value.forEach((p) => items.push(this.transformRezeki(p)));
      }

      // Sort: in stock first, then by category and name
      items.sort((a, b) => {
        if (a.is_in_stock !== b.is_in_stock) {
          return a.is_in_stock ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      this.cachedProducts = items;
      this.lastFetchTime = Date.now();
    } catch (err) {
      console.error("[Aggregator] Error fetching supplier products:", err);
    } finally {
      this.isFetching = false;
    }

    // Safety fallback
    if (this.cachedProducts.length === 0) {
      this.cachedProducts = (initialVenteData as any[])
        .filter((p) => p.id !== 2147483000)
        .map((p) => this.transformVente(p));
    }

    return this.cachedProducts;
  }

  static async getProductById(id: string): Promise<OctaneProduct | null> {
    const products = await this.getProducts();
    const found = products.find((p) => p.id === id);
    if (!found) return null;

    // If Rezeki product, we can query real-time stock
    if (found.supplier === "rezeki") {
      try {
        const detail = await RezekiService.getProductDetail(String(found.supplier_product_id));
        if (detail && detail.product) {
          found.is_in_stock = detail.product.availability === "in_stock";
          found.stock = found.is_in_stock ? (detail.product.stock || 10) : 0;
        }
      } catch {
        // use cached stock
      }
    }
    return found;
  }

  static async getSuppliersHealth(): Promise<SupplierHealth[]> {
    const [venteHealth, rezekiHealth] = await Promise.all([
      VenteService.getProfileAndBalance(),
      RezekiService.getProfileAndBalance(),
    ]);

    return [
      {
        source: "vente",
        name: "Vente Telegram Reseller (Supplier 1)",
        ...venteHealth,
      },
      {
        source: "rezeki",
        name: "Rezeki Shop API (Supplier 2)",
        ...rezekiHealth,
      },
    ];
  }
}
