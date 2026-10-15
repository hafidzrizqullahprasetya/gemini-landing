import { useState, useMemo } from "react";
import { Search, ArrowUpDown, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrandVectorBadge, type EnrichedProduct, type ProductCategory } from "@/services/venteApi";
import type { Language } from "@/lib/i18n";
import { translations, localizeCategory, localizeDuration, localizeWarranty } from "@/lib/i18n";

interface ProductCatalogProps {
  products: EnrichedProduct[];
  onSelectProduct: (product: EnrichedProduct) => void;
  lang?: Language;
  isLoading?: boolean;
}

const CATEGORIES: ProductCategory[] = [
  "Semua",
  "AI & LLM",
  "Dev & Cloud",
  "Desain & Kreatif",
  "Office & Edu",
  "Streaming & Hiburan",
  "VPN & Sistem",
];

export function ProductCatalog({
  products,
  onSelectProduct,
  lang = "id",
  isLoading = false,
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "stock" | "name">("default");
  const [visibleCount, setVisibleCount] = useState(24);

  const t = translations[lang].catalog;

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "Semua") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (onlyInStock) {
      list = list.filter((p) => p.is_in_stock);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.duration_label.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price_idr - b.price_idr);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price_idr - a.price_idr);
    } else if (sortBy === "stock") {
      list.sort((a, b) => b.stock - a.stock);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, selectedCategory, onlyInStock, searchQuery, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section id="katalog" className="py-16 sm:py-24 border-b border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(24);
                }}
                placeholder={t.searchPlaceholder}
                className="w-full h-11 pl-10 pr-4 rounded-full border border-border/50 bg-card text-foreground placeholder:text-muted-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Controls: In Stock Toggle + Sort */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`h-11 px-4 rounded-full border border-border/50 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${onlyInStock
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
              >
                <div
                  className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${onlyInStock
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground"
                    }`}
                >
                  {onlyInStock && <Check className="h-2.5 w-2.5" />}
                </div>
                <span>{t.filterInStock}</span>
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "default" | "price-asc" | "price-desc" | "stock" | "name"
                    )
                  }
                  aria-label={t.sortBy}
                  className="h-11 px-4 pr-9 rounded-full border border-border/50 bg-card text-foreground text-xs font-medium appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="default">{t.sortDefault}</option>
                  <option value="price-asc">{t.sortPriceAsc}</option>
                  <option value="price-desc">{t.sortPriceDesc}</option>
                  <option value="stock">{t.sortStock}</option>
                  <option value="name">{t.sortName}</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "Semua"
                  ? products.length
                  : products.filter((p) => p.category === cat).length;
              const label = localizeCategory(cat, lang);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(24);
                  }}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${selectedCategory === cat
                      ? "bg-foreground text-background shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <span>{label}</span>
                  <span className="ml-1.5 opacity-60 font-mono text-[11px]">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6 pb-2 border-b border-border/40 font-mono">
          <span>
            {lang === "id"
              ? `Ditemukan ${filteredProducts.length} produk${selectedCategory !== "Semua" ? ` dalam kategori "${selectedCategory}"` : ""
              }`
              : `Found ${filteredProducts.length} products${selectedCategory !== "Semua" ? ` in "${selectedCategory}"` : ""
              }`}
          </span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {lang === "id"
                ? "Sinkronisasi Stok Real-time Aktif"
                : "Real-time Stock Live Sync Active"}
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`cat-skeleton-${idx}`}
                className="rounded-xl sm:rounded-2xl border border-border/40 bg-card flex flex-col justify-between overflow-hidden animate-pulse"
              >
                <div>
                  <div className="aspect-[4/3] sm:aspect-[16/10] w-full bg-muted/60 relative">
                    <div className="absolute top-2 left-2 h-4 w-16 bg-muted/90 rounded" />
                    <div className="absolute top-2 right-2 h-4 w-12 bg-muted/90 rounded" />
                  </div>
                  <div className="p-3 sm:p-4 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-20 bg-muted/60 rounded" />
                      <div className="h-3 w-14 bg-muted/60 rounded" />
                    </div>
                    <div className="h-4 sm:h-5 w-3/4 bg-muted/80 rounded" />
                    <div className="flex gap-1.5 pt-1">
                      <div className="h-4 w-12 bg-muted/50 rounded" />
                      <div className="h-4 w-14 bg-muted/50 rounded" />
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4 pt-0 mt-auto border-t border-border/40">
                  <div className="flex items-baseline justify-between pt-3">
                    <div className="space-y-1">
                      <div className="h-2.5 w-12 bg-muted/50 rounded" />
                      <div className="h-4 sm:h-5 w-20 bg-primary/40 rounded" />
                    </div>
                    <div className="h-8 w-16 bg-muted/60 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl bg-card/50">
            <p className="text-muted-foreground text-sm">
              {t.noProducts}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-full"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
                setOnlyInStock(false);
              }}
            >
              {t.resetFilter}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {displayedProducts.map((product) => {
              const isGeminiProduct = product.name.toLowerCase().includes("gemini");
              return (
                <div
                  key={product.id}
                  className={`group rounded-xl sm:rounded-2xl border bg-card flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-lg ${isGeminiProduct
                      ? "border-primary/50 ring-1 ring-primary/20 shadow-sm"
                      : "border-border/50 hover:border-border"
                    }`}
                >
                  <div>
                    {/* Thumbnail & Badges */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-muted/30">
                      <img
                        src={product.display_image || createBrandVectorBadge(product.name, product.category)}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = createBrandVectorBadge(product.name, product.category);
                        }}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Duration & Gemini highlight */}
                      <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex items-center gap-1">
                        <div className="bg-background/95 px-1.5 sm:px-2.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-foreground">
                          {localizeDuration(product.duration_label, lang)}
                        </div>
                        {isGeminiProduct && (
                          <span className="bg-primary text-primary-foreground font-mono font-bold text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                            <span>🔥</span>
                            <span className="hidden xs:inline">{lang === "id" ? "HOT" : "HOT"}</span>
                          </span>
                        )}
                      </div>

                      {/* Stock badge */}
                      <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5">
                        {product.is_in_stock ? (
                          <span className="bg-emerald-600 text-white px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-medium">
                            {product.stock} Ready
                          </span>
                        ) : (
                          <span className="bg-muted/95 text-muted-foreground px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono">
                            {t.outOfStock}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground font-mono truncate">
                        <span className="truncate pr-1">{localizeCategory(product.category, lang)}</span>
                        <span className="shrink-0">{localizeWarranty(product.warranty_label, lang)}</span>
                      </div>

                      <h3 className="font-semibold text-foreground text-xs sm:text-base tracking-tight leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.75rem]">
                        {product.name}
                      </h3>

                      {/* Clean feature pills instead of raw messy description */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/60 text-[10px] font-mono text-muted-foreground">
                          {product.delivery_type === "custom_email" ? "✉️ Email Invite" : "⚡ Instan"}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/60 text-[10px] font-mono text-muted-foreground">
                          {product.duration_label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer: Price and CTA (Pinned to bottom) */}
                  <div className="p-3 sm:p-4 pt-0 mt-auto border-t border-border/40">
                    <div className="flex items-baseline justify-between pt-2.5 sm:pt-3">
                      <div>
                        <span className="text-muted-foreground block text-[9px] sm:text-[10px] uppercase font-mono">
                          {lang === "id" ? "Harga Satuan" : "Unit Price"}
                        </span>
                        <span className="text-xs sm:text-base font-bold font-mono text-primary">
                          {product.formatted_price}
                        </span>
                      </div>

                      {product.price_usd && (
                        <span className="hidden sm:inline text-[11px] font-mono text-muted-foreground">
                          ${product.price_usd} USD
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => onSelectProduct(product)}
                      className="w-full mt-2.5 sm:mt-3 h-8 sm:h-10 text-[11px] sm:text-xs font-semibold rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5"
                    >
                      <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{t.orderNow}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > displayedProducts.length && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="px-8 font-medium rounded-full cursor-pointer"
            >
              {t.loadMore.replace("{remaining}", String(filteredProducts.length - displayedProducts.length))}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
