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
          {onlyInStock && (
            <span>
              {lang === "id"
                ? "Menyaring produk yang siap diaktivasi"
                : "Showing products ready for instant activation"}
            </span>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl border border-border/50 bg-card flex flex-col justify-between overflow-hidden transition-all duration-200 hover:border-border hover:shadow-lg"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30">
                    <img
                      src={product.display_image || createBrandVectorBadge(product.name, product.category)}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = createBrandVectorBadge(product.name, product.category);
                      }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Duration badge */}
                    <div className="absolute top-2.5 left-2.5 bg-background/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider text-foreground">
                      {localizeDuration(product.duration_label, lang)}
                    </div>

                    {/* Stock badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {product.is_in_stock ? (
                        <span className="bg-emerald-500/90 text-white backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                          {t.ready} ({product.stock})
                        </span>
                      ) : (
                        <span className="bg-muted text-muted-foreground backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono">
                          {t.outOfStock}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>{localizeCategory(product.category, lang)}</span>
                      <span>{localizeWarranty(product.warranty_label, lang)}</span>
                    </div>

                    <h3 className="font-semibold text-foreground text-base tracking-tight leading-snug line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description.replace(/[🤖⭐️✦🚫⏩🚀💎🔑⚡⏳📋🔹✨🌐📊📖⚠️🔗👉•-]/g, "").trim()}
                    </p>
                  </div>
                </div>

                {/* Footer: Price and CTA */}
                <div className="p-4 pt-0 mt-2 border-t border-border/40">
                  <div className="flex items-baseline justify-between pt-3">
                    <div>
                      <span className="text-xs text-muted-foreground block text-[10px] uppercase font-mono">
                        {lang === "id" ? "Harga Satuan" : "Unit Price"}
                      </span>
                      <span className="text-base font-bold font-mono text-primary">
                        {product.formatted_price}
                      </span>
                    </div>

                    {product.price_usd && (
                      <span className="text-[11px] font-mono text-muted-foreground">
                        ${product.price_usd} USD
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => onSelectProduct(product)}
                    className="w-full mt-3 h-10 text-xs font-medium rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                    <span>{t.orderNow}</span>
                  </Button>
                </div>
              </div>
            ))}
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
