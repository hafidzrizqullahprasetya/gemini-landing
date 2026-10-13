import { ProductDropCard, type DropItem } from "@/components/ui/product-card-3";
import { createBrandVectorBadge, type EnrichedProduct } from "@/services/venteApi";

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
      imageSrc: "/products/claude.webp",
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
      imageSrc: "/products/capcut.webp",
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
      imageSrc: "/products/office365.webp",
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
      imageSrc: "/products/figma.webp",
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
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
            Octane Flash Drops
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Varian produk digital terlaris dengan stok siap aktivasi instan dan garansi replace.
          </p>
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
