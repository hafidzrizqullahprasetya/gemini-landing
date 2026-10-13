import { useState } from "react";
import { Sun, Moon, Menu, X, ShoppingBag, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  inStockCount: number;
}

export function Navbar({ theme, onToggleTheme, inStockCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Katalog", href: "#katalog" },
    { label: "Flash Drops", href: "#drops" },
    { label: "Keunggulan", href: "#keunggulan" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b hairline-border bg-background/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand */}
        <a
          href="#top"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-foreground"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold text-sm shadow-sm">
            <Flame className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="leading-none tracking-tight">OCTANE</span>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase mt-0.5">
              octane.web.id
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium"
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
        <div className="flex items-center gap-3">
          {/* Live stock indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border hairline-border bg-muted/50 text-xs font-mono text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{inStockCount} Ready</span>
          </div>

          {/* Theme toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            aria-label={
              theme === "dark"
                ? "Beralih ke mode terang"
                : "Beralih ke mode gelap"
            }
            className="h-9 w-9 text-foreground"
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
            className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a href="#katalog" className="flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Buka Katalog</span>
            </a>
          </Button>

          {/* Mobile menu trigger */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup navigasi" : "Buka navigasi"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden h-9 w-9"
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
        <div className="md:hidden border-t hairline-border bg-card px-4 py-4 space-y-3">
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
          <div className="pt-2 border-t hairline-border flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">{inStockCount} produk siap diaktivasi</span>
            <Button
              asChild
              size="sm"
              className="w-full bg-primary text-primary-foreground mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <a href="#katalog">Lihat Semua Produk</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
