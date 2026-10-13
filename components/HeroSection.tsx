import { ArrowDown, Flame, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  totalProducts: number;
  inStockCount: number;
}

export function HeroSection({ totalProducts, inStockCount }: HeroSectionProps) {
  const trendingTags = [
    "Gemini 18M",
    "Claude API Token",
    "ChatGPT Plus",
    "CapCut Pro",
    "Figma Edu",
    "Microsoft 365",
    "Supabase Pro",
  ];

  return (
    <section className="relative overflow-hidden border-b hairline-border bg-background py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="max-w-3xl space-y-6">
          {/* Main Statement */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground font-display leading-[1.05]">
            Bahan bakar instan untuk kerja, riset AI & coding.
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
            Katalog akun AI premium, developer stack, dan alat kreatif bergaransi resmi.
            Aktivasi langsung 2–5 menit tanpa kartu kredit luar negeri, harga Rupiah transparan, dan stok real-time.
          </p>

          {/* Direct Actions */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="h-12 px-7 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-base rounded-lg shadow-sm"
            >
              <a href="#katalog" className="flex items-center gap-2">
                <span>Telusuri {totalProducts} Produk</span>
                <ArrowDown className="h-4 w-4" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-6 border-border text-foreground hover:bg-muted font-medium text-base rounded-lg"
            >
              <a href="#drops" className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                <span>Lihat Flash Drops</span>
              </a>
            </Button>
          </div>

          {/* Curated Ticker Tags */}
          <div className="pt-6 border-t hairline-border flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="text-foreground font-semibold">Paling dicari:</span>
            {trendingTags.map((tag) => (
              <a
                key={tag}
                href="#katalog"
                className="px-2.5 py-1 rounded-md border hairline-border bg-muted/30 hover:bg-muted hover:text-foreground transition-colors"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
