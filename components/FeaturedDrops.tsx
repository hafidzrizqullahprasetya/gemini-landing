import { useState } from "react";
import { ProductDropCard, type DropItem } from "@/components/ui/product-card-3";
import type { EnrichedProduct } from "@/services/venteApi";
import { Sparkles, ShoppingBag } from "lucide-react";

interface FeaturedDropsProps {
  products: EnrichedProduct[];
  onSelectProduct: (product: EnrichedProduct) => void;
}

export function FeaturedDrops({
  products,
  onSelectProduct,
}: FeaturedDropsProps) {
  const [viewMode, setViewMode] = useState<"store" | "nike">("store");

  const storeDropItems: DropItem[] = [
    {
      time: "FLASH SALE",
      name: "Gemini 18 Months",
      collection: "Google AI & 5TB Storage",
      badge: "Stok 790+",
      price: "Rp 8.000",
      imageSrc:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      onSelect: () => {
        const found = products.find((p) => p.name.includes("Gemini 18"));
        if (found) onSelectProduct(found);
      },
    },
    {
      time: "API DEVELOPER",
      name: "Claude 50M Token",
      collection: "Anthropic Claude Codex",
      badge: "Fast Api",
      price: "Rp 50.500",
      imageSrc:
        "https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=800&q=80",
      onSelect: () => {
        const found = products.find((p) => p.name.includes("Claude 50M"));
        if (found) onSelectProduct(found);
      },
    },
    {
      time: "CREATOR EDIT",
      name: "Capcut Pro 1M (1600 Credits)",
      collection: "ByteDance Video Pro",
      badge: "Full Garansi",
      price: "Rp 27.000",
      imageSrc:
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
      onSelect: () => {
        const found = products.find((p) => p.name.includes("Capcut pro 1M"));
        if (found) onSelectProduct(found);
      },
    },
    {
      time: "WORK & STUDY",
      name: "Microsoft 365 1 Year",
      collection: "Word, Excel & 1TB Cloud",
      badge: "100+ Ready",
      price: "Rp 8.500",
      imageSrc:
        "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
      onSelect: () => {
        const found = products.find((p) => p.name.includes("Microsoft Office 365"));
        if (found) onSelectProduct(found);
      },
    },
    {
      time: "LEARNING",
      name: "Coursera Premium 12M",
      collection: "Akses Kursus & Sertifikat",
      badge: "12 Bulan",
      price: "Rp 31.500",
      imageSrc:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
      onSelect: () => {
        const found = products.find((p) => p.name.includes("Coursera"));
        if (found) onSelectProduct(found);
      },
    },
    {
      time: "PRODUCTIVITY",
      name: "Figma Pro Edu 2 Years",
      collection: "UI/UX Design Studio",
      badge: "2 Tahun",
      price: "Rp 59.000",
      imageSrc:
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      onSelect: () => {
        const found = products.find((p) => p.name.includes("Figma"));
        if (found) onSelectProduct(found);
      },
    },
  ];

  const nikeDropItems: DropItem[] = [
    {
      time: "14:00",
      name: "Lemonade",
      collection: "Off-White Air Force",
      imageSrc:
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    },
    {
      time: "17:00",
      name: "University Blue",
      collection: "Off-White Air Force",
      imageSrc:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    },
    {
      time: "18:00",
      name: "Brooklyn Green",
      collection: "Off-White Air Force",
      imageSrc:
        "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
    },
    {
      time: "19:00",
      name: "Chicago",
      collection: "Off-White Air Jordan 1",
      imageSrc:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    },
    {
      time: "20:00",
      name: "Mocha",
      collection: "Travis Scott Air Jordan 1",
      imageSrc:
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section id="drops" className="py-14 sm:py-20 border-b hairline-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sorotan Pilihan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display mt-1">
              Flash Drops Hari Ini
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Produk digital dengan permintaan tertinggi dan stok siap kirim otomatis. Geser untuk melihat varian lainnya.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg border hairline-border bg-muted/40 text-xs font-medium self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("store")}
              className={`px-3 py-1.5 rounded-md transition-colors ${viewMode === "store"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Katalog Digital</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("nike")}
              className={`px-3 py-1.5 rounded-md transition-colors ${viewMode === "nike"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <span>Nike Drops (Demo)</span>
            </button>
          </div>
        </div>

        {/* Integrated ProductDropCard Component */}
        <ProductDropCard
          title={viewMode === "store" ? "Octane Flash Drops" : "Today's Drops"}
          subtitle={
            viewMode === "store"
              ? "Varian terlaris dengan garansi replace dan aktivasi cepat"
              : "Upcoming drops from Nike"
          }
          items={viewMode === "store" ? storeDropItems : nikeDropItems}
        />
      </div>
    </section>
  );
}
