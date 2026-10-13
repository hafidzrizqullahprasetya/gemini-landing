import { useState } from "react";
import { Sun, Moon, Menu, X, ShoppingBag, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface NavbarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  lang: Language;
  onToggleLang: () => void;
  inStockCount: number;
}

export function Navbar({
  theme,
  onToggleTheme,
  lang,
  onToggleLang,
  inStockCount,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang].nav;

  const navLinks = [
    { label: t.catalog, href: "#katalog" },
    { label: t.drops, href: "#drops" },
    { label: t.features, href: "#keunggulan" },
    { label: t.faq, href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 sm:px-10 h-18">
        {/* Brand */}
        <a
          href="#top"
          className="flex items-center gap-3 font-display text-lg font-bold tracking-tight text-foreground group"
        >
          <img
            src="/logo.webp"
            alt="Octane Logo"
            className="h-9 w-9 object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="leading-none tracking-tight font-extrabold text-base">
              OCTANE
            </span>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase mt-0.5">
              octane.web.id
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium"
          aria-label="Navigasi Utama"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Live stock indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 text-xs font-mono text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{inStockCount} Ready</span>
          </div>

          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleLang}
            title={lang === "id" ? "Beralih ke Bahasa Inggris" : "Switch to Indonesian"}
            aria-label="Ganti Bahasa"
            className="h-9 px-2.5 text-xs font-mono font-semibold text-foreground rounded-full hover:bg-muted flex items-center gap-1 cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{lang.toUpperCase()}</span>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label={
              theme === "dark"
                ? "Beralih ke mode terang"
                : "Beralih ke mode gelap"
            }
            className="h-9 w-9 text-foreground rounded-full hover:bg-muted cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Catalog CTA */}
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex rounded-full px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium cursor-pointer"
          >
            <a href="#katalog" className="flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>{t.cart}</span>
            </a>
          </Button>

          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup navigasi" : "Buka navigasi"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden h-9 w-9 rounded-full"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-card px-6 py-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">{inStockCount} {lang === "id" ? "produk siap aktivasi" : "products in stock"}</span>
          </div>
        </div>
      )}
    </header>
  );
}
