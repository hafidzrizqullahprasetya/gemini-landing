import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, Check, AlertCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createBrandVectorBadge, type EnrichedProduct, type ProductCategory } from "@/services/venteApi";

interface ProductCatalogProps {
  products: EnrichedProduct[];
  onSelectProduct: (product: EnrichedProduct) => void;
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
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "stock" | "name">("default");
  const [visibleCount, setVisibleCount] = useState(24);

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
    <section id="katalog" className="py-14 sm:py-20 border-b hairline-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-semibold uppercase tracking-wider">
            <span>Katalog Produk</span>
            <span>·</span>
            <span>Katalog Resmi Octane</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground font-display mt-1">
            Daftar Produk Digital
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
            Pilih produk yang kamu butuhkan. Informasi stok dan harga disinkronkan secara langsung dengan server.
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
                placeholder="Cari produk (Gemini, Claude, CapCut, Office, VPN)..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border hairline-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground"
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
                className={`h-11 px-3.5 rounded-lg border hairline-border text-xs font-medium flex items-center gap-2 transition-colors ${onlyInStock
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                aria-pressed={onlyInStock}
              >
                <div
                  className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${onlyInStock ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                    }`}
                >
                  {onlyInStock && <Check className="h-2.5 w-2.5" />}
                </div>
                <span>Hanya Ready Stock</span>
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "default" | "price-asc" | "price-desc" | "stock" | "name")}
                  aria-label="Urutkan produk"
                  className="h-11 px-3 pr-8 rounded-lg border hairline-border bg-card text-foreground text-xs font-medium appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="default">Urutan Default</option>
                  <option value="price-asc">Harga: Rendah ke Tinggi</option>
                  <option value="price-desc">Harga: Tinggi ke Rendah</option>
                  <option value="stock">Stok Terbanyak</option>
                  <option value="name">Nama: A - Z</option>
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
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(24);
                  }}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <span>{cat}</span>
                  <span className="ml-1.5 opacity-60 font-mono text-[11px]">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6 pb-2 border-b hairline-border font-mono">
          <span>
            Ditemukan {filteredProducts.length} produk
            {selectedCategory !== "Semua" ? ` dalam kategori "${selectedCategory}"` : ""}
          </span>
          {onlyInStock && <span>Menyaring produk yang siap diaktivasi</span>}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border hairline-border bg-card p-12 text-center max-w-md mx-auto my-8">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground font-display">
              Tidak ada produk ditemukan
            </h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Coba sesuaikan kata kunci pencarian atau matikan filter stok.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
                setOnlyInStock(false);
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl border hairline-border bg-card flex flex-col justify-between overflow-hidden transition-all duration-200 hover:border-foreground/30 hover:shadow-lg"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30">
                    <img
                      src={product.display_image}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = createBrandVectorBadge(product.name, product.category);
                      }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Duration badge */}
                    <div className="absolute top-2.5 left-2.5 bg-background/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider text-foreground">
                      {product.duration_label}
                    </div>

                    {/* Stock badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {product.is_in_stock ? (
                        <span className="bg-emerald-500/90 text-white backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                          Ready ({product.stock})
                        </span>
                      ) : (
                        <span className="bg-muted text-muted-foreground backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono">
                          Habis
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>{product.category}</span>
                      <span>{product.warranty_label}</span>
                    </div>

                    <h3 className="font-semibold text-foreground text-base tracking-tight leading-snug line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description.replace(/[🤖⭐️✦🚫⏩🚀💎]/g, "").trim()}
                    </p>
                  </div>
                </div>

                {/* Footer: Price and CTA */}
                <div className="p-4 pt-0 mt-2 border-t hairline-border/60">
                  <div className="flex items-baseline justify-between pt-3">
                    <div>
                      <span className="text-xs text-muted-foreground block text-[10px] uppercase font-mono">
                        Harga Satuan
                      </span>
                      <span className="text-base font-bold font-mono text-primary">
                        {product.formatted_price}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-muted-foreground">
                      ${product.price_usd} USD
                    </span>
                  </div>

                  <Button
                    onClick={() => onSelectProduct(product)}
                    className="w-full mt-3 h-9 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                    <span>Detail & Beli</span>
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
              className="px-8 font-medium"
            >
              Muat Lebih Banyak ({filteredProducts.length - displayedProducts.length} tersisa)
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
