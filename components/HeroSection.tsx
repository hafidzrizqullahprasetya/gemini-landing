import { ArrowDown, ShieldCheck, Zap, CreditCard, Sparkles, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  totalProducts: number;
  inStockCount: number;
}

export function HeroSection({ totalProducts, inStockCount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b hairline-border bg-gradient-to-b from-background via-background to-muted/20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border hairline-border bg-card px-3.5 py-1 text-xs font-mono text-muted-foreground shadow-xs">
              <span className="flex items-center gap-1 font-bold text-primary">
                <Flame className="h-3.5 w-3.5" />
                <span>OCTANE</span>
              </span>
              <span>·</span>
              <span>BAHAN BAKAR DIGITAL</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-display leading-[1.1]">
              Bahan bakar instan untuk kerja, riset AI & coding.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Tingkatkan kecepatan workflow dengan akses akun AI premium, developer stack, dan tools kreatif.
              Aktivasi mandiri dalam 2 menit tanpa kartu kredit, harga transparan dalam Rupiah, dan garansi replace penuh.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
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
                className="h-11 px-6 border-border text-foreground hover:bg-muted"
              >
                <a href="#keunggulan" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Keunggulan Octane</span>
                </a>
              </Button>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t hairline-border">
              <div className="flex items-start gap-2.5">
                <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Stok Real-Time API</p>
                  <p className="text-[11px] text-muted-foreground">Bukan stok fiktif/manual</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Garansi Replace Pasti</p>
                  <p className="text-[11px] text-muted-foreground">Klaim cepat 1-klik</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Bayar QRIS & Bank</p>
                  <p className="text-[11px] text-muted-foreground">Bebas repot kartu kredit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Spotlight Card (Gemini 18M Highlight) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border hairline-border bg-card p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b hairline-border text-xs">
                <span className="font-mono text-muted-foreground">OCTANE HIGH-PERFORMANCE PICK</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {inStockCount} Ready
                </span>
              </div>

              <div className="pt-4 space-y-4">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted relative">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
                    alt="Gemini AI Pro 18 Bulan"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-[11px] font-mono font-bold text-primary">
                    18 BULAN
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-bold text-foreground font-display">
                      Gemini AI Pro 18 Bulan
                    </h3>
                    <span className="text-lg font-mono font-bold text-primary">
                      Rp 8.000
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Google One cloud storage 5TB, aktivasi tanpa kartu kredit, akses model Gemini Ultra & Pro.
                  </p>
                </div>

                <div className="rounded-lg bg-muted/60 p-3 space-y-1.5 text-xs font-mono text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Format aktivasi:</span>
                    <span className="text-foreground">Akun email siap pakai</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Masa berlaku:</span>
                    <span className="text-foreground">18 Bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Garansi:</span>
                    <span className="text-foreground">24 Jam penggantian</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                >
                  <a href="#katalog">Pilih Produk Ini di Katalog</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
