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

  // 1. Years first if in name/desc: e.g. "1 Year", "2 yrs", "12m", "1 Tahun"
  const yrMatch = combined.match(/(\d+)\s*(?:tahun|years?|year|yr|yrs)\b/i);
  if (yrMatch && yrMatch[1]) {
    return `${yrMatch[1]} TAHUN`;
  }

  // 2. Months: e.g. "1 Bulan", "6 Months", "12M", "2B"
  const monthMatch = combined.match(/(\d+)\s*(?:bulan|months?|month|bln)\b/i);
  if (monthMatch && monthMatch[1]) {
    return `${monthMatch[1]} BULAN`;
  }

  // 3. Days with word: e.g. "3Day", "7 Days", "30 Hari"
  const dayMatch = combined.match(/(\d+)\s*(?:hari|days?|day)\b/i);
  if (dayMatch && dayMatch[1]) {
    return `${dayMatch[1]} HARI`;
  }

  // 4. Short D (e.g. 30D, 14D) - filter out 2D/3D graphics words
  const cleanForD = combined.replace(/\b[23]D\b/gi, "").replace(/[23]D\/[23]D/gi, "");
  const shortDay = cleanForD.match(/\b(\d{1,3})\s*D\b/i);
  if (shortDay && shortDay[1] && Number(shortDay[1]) <= 365) {
    return `${shortDay[1]} HARI`;
  }

  // 5. Short M (months)
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
  ["google", "/products/gemini.webp"],
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
  ["peacock", "/products/peacock.webp"],
  ["higgsfield", "/products/higgsfield.webp"],
  ["kiro", "/products/kiro.webp"],
  ["brain", "/products/brainfm.webp"],
];

function getCanonicalProductKey(item: OctaneProduct): string {
  const lower = item.name.toLowerCase();
  let brand = "";
  if (lower.includes("adobe") && lower.includes("express")) {
    brand = "adobe-express";
  } else if (lower.includes("ilovepdf")) {
    brand = "ilovepdf";
  } else if (lower.includes("capcut")) {
    brand = lower.includes("credit") ? "capcut-credits" : "capcut";
  } else if (lower.includes("office") || lower.includes("microsoft") || lower.includes("365")) {
    brand = "msoffice-365";
  } else if (lower.includes("notion")) {
    brand = "notion";
  } else if (lower.includes("canva")) {
    brand = lower.includes("admin") || lower.includes("invitation") ? "canva-admin" : "canva";
  } else if (lower.includes("prime video") || lower.includes("prime")) {
    brand = "prime-video";
  } else if (lower.includes("claude") && lower.includes("token")) {
    const m = lower.match(/(\d+m)\s*token/);
    brand = `claude-token-${m ? m[1] : ""}`;
  } else if (lower.includes("claude") && lower.includes("api")) {
    const m = lower.match(/(\d+)\$/);
    brand = `claude-api-${m ? m[1] : ""}`;
  } else if (lower.includes("codex")) {
    const m = lower.match(/(\d+m)\s*token/);
    brand = `codex-token-${m ? m[1] : ""}`;
  } else if (lower.includes("miro")) {
    brand = "miro";
  } else if (lower.includes("figma")) {
    brand = "figma";
  } else if (lower.includes("edx")) {
    brand = "edx";
  } else if (lower.includes("avira")) {
    brand = "avira";
  } else if (lower.includes("jetbrains")) {
    brand = "jetbrains";
  } else if (lower.includes("duolingo")) {
    brand = "duolingo";
  } else if (lower.includes("zoom")) {
    brand = "zoom";
  } else if (lower.includes("hma")) {
    brand = "hma";
  } else if (lower.includes("nord")) {
    brand = "nordvpn";
  } else if (lower.includes("scribd")) {
    brand = "scribd";
  } else if (lower.includes("wink")) {
    brand = "wink";
  } else if (lower.includes("gemini")) {
    brand = "gemini";
  } else if (lower.includes("spotify")) {
    brand = "spotify";
  } else if (lower.includes("netflix")) {
    let plan = "std";
    if (lower.includes("1p1u")) plan = "1p1u";
    else if (lower.includes("1p2u")) plan = "1p2u";
    else if (lower.includes("semi")) plan = "semi";
    brand = `netflix-${plan}`;
  } else {
    const tokens = lower.replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
    brand = tokens[0] || "other";
  }

  return `${brand}__${item.duration_label.toUpperCase().trim()}`;
}
function cleanHtmlAndTelegramTags(text = ""): string {
  if (!text) return "";
  let clean = text.replace(/<tg-emoji[^>]*>(.*?)<\/tg-emoji>/gi, "$1");
  clean = clean.replace(/<[^>]+>/g, "");
  clean = clean.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
  clean = clean.replace(/[━─=\-]{4,}/g, "");
  clean = clean.replace(/🛍️\s*PRODUCT INFORMATION/gi, "");
  return clean.trim();
}

function cleanProductName(name: string): string {
  let clean = cleanHtmlAndTelegramTags(name);
  clean = clean.replace(/\bCLaude\b/g, "Claude");
  clean = clean.replace(/\bChatgpt\b/gi, "ChatGPT");
  clean = clean.replace(/\bCapcut\b/gi, "CapCut");
  clean = clean.replace(/^[🔑⚡🛍️🔹✨👑🚀]\s*/, "");
  clean = clean.replace(/^Slot\s*-\s*/i, "");
  clean = clean.replace(/^Key\s*🔑?\s*/i, "");

  // Normalize API Token and Balance titles
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
    const name = cleanProductName(raw.name);
    const description = cleanHtmlAndTelegramTags(raw.description);
    const category = detectCategory(name);
    const lower = name.toLowerCase();

    let price_idr: number;
    if (lower.includes("gemini") && lower.includes("18")) {
      price_idr = 18000;
    } else if (lower.includes("gemini")) {
      price_idr = 12000;
    } else {
      const rawIdr = raw.price_usd * config.vente.usdRate;
      price_idr = Math.max(15000, Math.ceil((rawIdr * 1.3) / 500) * 500);
    }

    return {
      id: `v-${raw.id}`,
      supplier: "vente",
      supplier_product_id: raw.id,
      name,
      description,
      category,
      price_idr,
      formatted_price: formatIDR(price_idr),
      original_cost_raw: raw.price_usd,
      original_currency: "USD",
      stock: raw.stock,
      is_in_stock: raw.stock > 0,
      duration_label: extractDuration(name, description),
      warranty_label: extractWarranty(name, description, raw.warranty_days),
      display_image: getDisplayImage(name),
      requires_email: raw.delivery_type === "custom_email",
      delivery_type: raw.delivery_type === "custom_email" ? "custom_email" : "instant",
    };
  }

  private static transformRezeki(raw: RezekiRawProduct): OctaneProduct {
    const name = cleanProductName(raw.name);
    const description = cleanHtmlAndTelegramTags(raw.description);
    const category = detectCategory(name);
    const cost = raw.price_idr;
    const lower = name.toLowerCase();

    let price_idr: number;
    if (lower.includes("gemini") && lower.includes("18")) {
      price_idr = 18000;
    } else if (lower.includes("spotify")) {
      price_idr = 24000; // Cost 15.5k -> Profit Rp 8.332
    } else if (lower.includes("capcut") && lower.includes("month")) {
      price_idr = 35000; // Cost 23.6k -> Profit Rp 11.155
    } else if (lower.includes("capcut") && lower.includes("credit")) {
      price_idr = 49000; // Cost 35.1k -> Profit Rp 13.557
    } else if (lower.includes("canva") && lower.includes("pro") && !lower.includes("admin")) {
      price_idr = 22000; // Cost 13.1k -> Profit Rp 8.746
    } else if (lower.includes("office") || lower.includes("microsoft")) {
      price_idr = 15000; // Cost 6.7k -> Profit Rp 8.195
    } else if (lower.includes("claude") && lower.includes("api")) {
      price_idr = Math.ceil((cost * 1.35) / 500) * 500;
    } else if (lower.includes("netflix")) {
      price_idr = Math.ceil((cost * 1.25) / 500) * 500;
    } else {
      price_idr = Math.max(
        config.rezeki.minPriceIdr,
        Math.ceil((cost * (1 + config.rezeki.marginPercent / 100)) / 500) * 500
      );
    }
    const inStock = raw.availability === "in_stock";
    const rawStock = (raw as any).stock;
    const stock = typeof rawStock === "number" ? rawStock : (inStock ? 10 : 0);

    return {
      id: `r-${raw.id}`,
      supplier: "rezeki",
      supplier_product_id: raw.id,
      name,
      description,
      category,
      price_idr,
      formatted_price: formatIDR(price_idr),
      original_cost_raw: cost,
      original_currency: "IDR",
      stock,
      is_in_stock: inStock && stock > 0,
      duration_label: extractDuration(name, description),
      warranty_label: extractWarranty(name, description, 0),
      display_image: getDisplayImage(name),
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

      // 1. Prioritize Rezeki (Rupiah Supplier - Primary)
      if (rezekiRes.status === "fulfilled" && Array.isArray(rezekiRes.value)) {
        rezekiRes.value.forEach((p) => items.push(this.transformRezeki(p)));
      }

      // 2. Vente Supplier (Gemini hero products + active items if live)
      const isVenteLive = venteRes.status === "fulfilled" && Array.isArray(venteRes.value);
      if (isVenteLive) {
        venteRes.value.forEach((p) => items.push(this.transformVente(p)));
      } else {
        // Fallback: keep Gemini hero products from Vente / local pool
        (initialVenteData as any[])
          .filter((p) => p.id !== 2147483000)
          .filter((p) => p.name.toLowerCase().includes("gemini"))
          .forEach((p) => items.push(this.transformVente(p)));
      }

      // Smart Deduplication:
      // Group by normalized name + duration + category
      // Priority: Rezeki (Rupiah) wins over Vente; keep in-stock & cheaper retail price
      const dedupMap = new Map<string, OctaneProduct>();
      for (const item of items) {
        const key = getCanonicalProductKey(item);
        const existing = dedupMap.get(key);
        if (!existing) {
          dedupMap.set(key, item);
        } else {
          // Always prioritize Rezeki (Rupiah provider) over Vente unless existing is Gemini
          if (item.supplier === "rezeki" && existing.supplier === "vente" && !existing.name.toLowerCase().includes("gemini")) {
            dedupMap.set(key, item);
          } else if (existing.supplier === "rezeki" && item.supplier === "vente") {
            // Keep existing Rezeki
          } else if (!existing.is_in_stock && item.is_in_stock) {
            dedupMap.set(key, item);
          } else if (existing.is_in_stock === item.is_in_stock && item.price_idr < existing.price_idr) {
            dedupMap.set(key, item);
          }
        }
      }

      const isGemini = (name: string) => name.toLowerCase().includes("gemini");
      const deduplicated = Array.from(dedupMap.values());
      deduplicated.sort((a, b) => {
        const aGemini = isGemini(a.name);
        const bGemini = isGemini(b.name);
        if (aGemini !== bGemini) {
          return aGemini ? -1 : 1;
        }
        if (a.is_in_stock !== b.is_in_stock) {
          return a.is_in_stock ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      this.cachedProducts = deduplicated;
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
