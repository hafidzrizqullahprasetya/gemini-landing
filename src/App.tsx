import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedDrops } from "@/components/FeaturedDrops";
import { ComparisonSection } from "@/components/ComparisonSection";
import { ProductCatalog } from "@/components/ProductCatalog";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { ProductModal } from "@/components/ProductModal";
import type { Language } from "@/lib/i18n";
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
      return "dark"; // Default dark mode for all new visitors
    }
    return "dark";
  });

  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("prs_lang") as Language | null;
      if (stored === "id" || stored === "en") return stored;
    }
    return "id";
  });

  const [products, setProducts] = useState<EnrichedProduct[]>(
    initialEnrichedProducts
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

    const syncLiveProducts = () => {
      fetchLiveProducts().then((live: EnrichedProduct[]) => {
        if (isMounted && live.length > 0) {
          setProducts(live);
        }
      });
    };

    syncLiveProducts();

    // Auto-sync real-time stock every 45 seconds
    const interval = setInterval(syncLiveProducts, 45000);

    // Refresh immediately when customer switches back to this tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncLiveProducts();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleLang = () => {
    setLang((prev) => {
      const next: Language = prev === "id" ? "en" : "id";
      localStorage.setItem("prs_lang", next);
      return next;
    });
  };

  const inStockCount = products.filter((p) => p.is_in_stock).length;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors selection:bg-primary/20 selection:text-primary">
      <div id="top" />
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onToggleLang={toggleLang}
        inStockCount={inStockCount}
      />

      <main>
        <HeroSection
          totalProducts={products.length}
          inStockCount={inStockCount}
          lang={lang}
        />
        <FeaturedDrops
          products={products}
          onSelectProduct={setSelectedProduct}
          lang={lang}
        />
        <ComparisonSection lang={lang} />
        <ProductCatalog
          products={products}
          onSelectProduct={setSelectedProduct}
          lang={lang}
        />
        <FaqSection lang={lang} />
      </main>

      <Footer lang={lang} />

      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        lang={lang}
      />
    </div>
  );
}
