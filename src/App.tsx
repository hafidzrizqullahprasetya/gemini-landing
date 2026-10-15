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

  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] =
    useState<EnrichedProduct | null>(null);

  const getUrlProductId = (): string | null => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get("p") || params.get("product") || params.get("id");
    if (fromParam) return fromParam;
    const match = window.location.pathname.match(/^\/p\/([^/?#]+)/);
    if (match) return decodeURIComponent(match[1]);
    return null;
  };

  const handleSelectProduct = (product: EnrichedProduct) => {
    setSelectedProduct(product);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("p", String(product.id));
      window.history.pushState({ productId: product.id }, "", url.toString());
    }
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("p");
      url.searchParams.delete("product");
      url.searchParams.delete("id");
      let cleanPath = url.pathname;
      if (cleanPath.startsWith("/p/")) {
        cleanPath = "/";
      }
      window.history.pushState({}, "", `${cleanPath}${url.search}`);
    }
  };

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
        if (isMounted) {
          if (live.length > 0) {
            setProducts(live);
            const urlId = getUrlProductId();
            setSelectedProduct((current) => {
              if (current) {
                return live.find((p) => p.id === current.id) || current;
              }
              if (urlId) {
                return live.find((p) => String(p.id) === urlId || p.supplier_product_id === urlId) || null;
              }
              return null;
            });
          }
          setIsLoading(false);
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

  useEffect(() => {
    const handlePopState = () => {
      const id = getUrlProductId();
      if (id) {
        const found = products.find((p) => String(p.id) === id || p.supplier_product_id === id);
        if (found) setSelectedProduct(found);
      } else {
        setSelectedProduct(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [products]);

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
          onSelectProduct={handleSelectProduct}
          lang={lang}
        />
        <ProductCatalog
          products={products}
          onSelectProduct={handleSelectProduct}
          lang={lang}
          isLoading={isLoading}
        />
        <ComparisonSection lang={lang} />
        <FaqSection lang={lang} />
      </main>

      <Footer lang={lang} />

      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={handleCloseProduct}
        lang={lang}
      />
    </div>
  );
}
