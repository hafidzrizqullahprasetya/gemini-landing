import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface DropItem {
  time: string;
  name: string;
  collection: string;
  imageSrc: string;
  badge?: string;
  price?: string;
  onSelect?: () => void;
}

export interface ProductDropCardProps {
  title: string;
  subtitle: string;
  items: DropItem[];
}

export const ProductDropCard = ({
  title,
  subtitle,
  items,
}: ProductDropCardProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [itemsToShow, setItemsToShow] = React.useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, items.length - itemsToShow);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1));
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto overflow-hidden hairline-border bg-card">
      <CardHeader className="p-5 sm:p-6 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={!canGoPrev}
              aria-label="Previous drop"
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="Next drop"
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6 pt-0 overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              onClick={item.onSelect}
              className={`flex-shrink-0 w-full rounded-lg border hairline-border bg-card/60 p-4 text-card-foreground transition-all duration-200 hover:border-border ${item.onSelect ? "cursor-pointer hover:shadow-md" : ""
                }`}
              style={{
                flexBasis: `calc((100% / ${itemsToShow}) - (${(itemsToShow - 1) * 16
                  }px / ${itemsToShow}))`,
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">{item.time}</span>
                  {item.badge && (
                    <span className="font-mono font-medium text-primary text-[11px] px-1.5 py-0.5 rounded bg-primary/10">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted/40 relative">
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-foreground text-base tracking-tight truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground truncate">
                      {item.collection}
                    </p>
                    {item.price && (
                      <span className="text-xs font-mono font-bold text-primary">
                        {item.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
