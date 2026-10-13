import { ProductDropCard, type DropItem } from "@/components/ui/product-card-3";
import type { EnrichedProduct } from "@/services/venteApi";
import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface FeaturedDropsProps {
  products: EnrichedProduct[];
  onSelectProduct: (product: EnrichedProduct) => void;
  lang?: Language;
}

export function FeaturedDrops({
  products,
  onSelectProduct,
  lang = "id",
}: FeaturedDropsProps) {
  const t = translations[lang].drops;

  const storeDropItems: DropItem[] = t.items.map((item) => ({
    time: item.time,
    name: item.name,
    collection: item.collection,
    badge: item.badge,
    price: item.price,
    imageSrc: item.imageSrc,
    onSelect: () => {
      const found = products.find((p) =>
        p.name.toLowerCase().includes(item.searchKey.toLowerCase())
      );
      if (found) onSelectProduct(found);
    },
  }));

  return (
    <section id="drops" className="py-14 sm:py-20 bg-background border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductDropCard
          title={t.title}
          subtitle={t.subtitle}
          items={storeDropItems}
        />
      </div>
    </section>
  );
}
