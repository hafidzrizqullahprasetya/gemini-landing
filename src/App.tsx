import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedDrops } from "@/components/FeaturedDrops";
import { ComparisonSection } from "@/components/ComparisonSection";
import { ProductCatalog } from "@/components/ProductCatalog";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { ProductModal } from "@/components/ProductModal";
import {
  initialEnrichedProducts,
  fetchLiveProducts,
  type EnrichedProduct,
} from "@/services/venteApi";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("prs_theme");
      if (stored === "dark" || stored === "light") return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const [products, setProducts] = useState<EnrichedProduct[]>(
    initialEnrichedProducts,
  );
  const [selectedProduct, setSelectedProduct] =
    useState<EnrichedProduct | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("prs_theme", theme);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;
    fetchLiveProducts().then((live: EnrichedProduct[]) => {
      if (isMounted && live.length > 0) {
        setProducts(live);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const inStockCount = products.filter((p) => p.is_in_stock).length;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors selection:bg-primary/20 selection:text-primary">
      <div id="top" />
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        inStockCount={inStockCount}
      />

      <main>
        <HeroSection
          totalProducts={products.length}
          inStockCount={inStockCount}
        />
        <FeaturedDrops
          products={products}
          onSelectProduct={setSelectedProduct}
        />
        <ComparisonSection />
        <ProductCatalog
          products={products}
          onSelectProduct={setSelectedProduct}
        />
        <FaqSection />
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
