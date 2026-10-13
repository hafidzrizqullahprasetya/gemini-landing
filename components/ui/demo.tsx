import { ProductDropCard, type DropItem } from "@/components/ui/product-card-3";

const upcomingDrops: DropItem[] = [
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

export const ProductDropCardDemo = () => {
  return (
    <div className="w-full bg-background p-8 flex items-center justify-center">
      <ProductDropCard
        title="Today's Drops"
        subtitle="Upcoming drops from Nike"
        items={upcomingDrops}
      />
    </div>
  );
};

export default ProductDropCardDemo;
