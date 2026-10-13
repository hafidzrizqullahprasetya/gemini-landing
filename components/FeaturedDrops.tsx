import { ProductDropCard, type DropItem } from "@/components/ui/product-card-3";
import { createBrandVectorBadge, type EnrichedProduct } from "@/services/venteApi";
import { Flame } from "lucide-react";

interface FeaturedDropsProps {
  products: EnrichedProduct[];
  onSelectProduct: (product: EnrichedProduct) => void;
}

export function FeaturedDrops({
  products,
  onSelectProduct,
}: FeaturedDropsProps) {
  const storeDropItems: DropItem[] = [
    {
      time: "FLASH SALE",
      name: "Gemini 18 Months",
      collection: "Google AI & 5TB Storage",
      badge: "Stok 790+",
      price: "Rp 8.000",
      imageSrc: "/products/gemini.webp",
      onSelect: () => {
        const found = products.find((p) => p.name.includes("Gemini 18"));
        if (found) onSelectProduct(found);
      },
    },
    {
      time: "DEV TOKEN",
      name: "Claude 50M Token",
      collection: "Anthropic Claude Codex",
      badge: "Fast Api",
      price: "Rp 50.500",
      imageSrc: createBrandVectorBadge("API Claude 50M Token", "AI & LLM"),
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
      imageSrc: createBrandVectorBadge("Capcut pro 1M", "Desain & Kreatif"),
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
      imageSrc: createBrandVectorBadge("Microsoft Office 365", "Office & Edu"),
      onSelect: () => {
        const found = products.find((p) => p.name.includes("Microsoft Office 365"));
        if (found) onSelectProduct(found);
      },
    },
    {
      time: "UI DESIGN",
      name: "Figma Pro Edu 2 Years",
      collection: "UI/UX Design Studio",
      badge: "2 Tahun",
      price: "Rp 59.000",
      imageSrc: createBrandVectorBadge("Figma Pro Edu", "Desain & Kreatif"),
      onSelect: () => {
        const found = products.find((p) => p.name.includes("Figma"));
        if (found) onSelectProduct(found);
      },
    },
    {
      time: "DEV CLOUD",
      name: "Supabase Pro 12M",
      collection: "PostgreSQL & Auth Cloud",
      badge: "Developer",
      price: "Rp 588.000",
      imageSrc: createBrandVectorBadge("Supabase Pro", "Dev & Cloud"),
      onSelect: () => {
        const found = products.find((p) => p.name.includes("Supabase"));
        if (found) onSelectProduct(found);
      },
    },
  ];

  return (
    <section id="drops" className="py-16 sm:py-24 border-b border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-semibold uppercase tracking-wider">
              <Flame className="h-3.5 w-3.5" />
              <span>Sorotan Pilihan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display mt-1">
              Octane Flash Drops
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Varian produk digital terlaris dengan stok siap aktivasi instan dan garansi replace.
            </p>
          </div>
        </div>

        <ProductDropCard
          title="Today's Digital Drops"
          subtitle="Varian terlaris dengan garansi replace dan aktivasi cepat"
          items={storeDropItems}
        />
      </div>
    </section>
  );
}
