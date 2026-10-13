interface HeroSectionProps {
  totalProducts: number;
  inStockCount?: number;
}

export function HeroSection({ totalProducts }: HeroSectionProps) {
  const trendingTags = [
    "Gemini 18M",
    "Claude API Token",
    "ChatGPT Plus",
    "CapCut 1600 Cr",
    "Figma Edu",
    "Microsoft 365",
    "Supabase Pro",
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Editorial Hero Content */}
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
        <h1 className="w-full font-[Manrope] text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.04] sm:leading-[0.98] tracking-[-0.05em] sm:tracking-[-0.07em] text-foreground">
          Bahan bakar kerja,
          <span className="block mt-1 sm:mt-2 text-foreground">
            <span className="text-primary">performa</span> tanpa batas.
          </span>
        </h1>

        <p className="mt-6 max-w-[580px] text-base leading-relaxed text-muted-foreground sm:text-lg">
          Katalog akun AI premium, developer stack, dan alat kreatif bergaransi resmi.
          Aktivasi langsung 2–5 menit tanpa kartu kredit luar negeri, harga Rupiah transparan, dan stok real-time.
        </p>

        {/* Hongfilms Style Rounded-Full CTAs */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:mt-10">
          <a
            href="#katalog"
            className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity duration-200 hover:opacity-90 cursor-pointer"
          >
            Telusuri {totalProducts} Produk
          </a>
          <a
            href="#drops"
            className="rounded-full bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-muted cursor-pointer"
          >
            Flash Drops Hari Ini
          </a>
        </div>

        {/* Clean Editorial Trending List (No Box Borders) */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono text-muted-foreground">
          <span className="text-foreground/80 font-semibold">Paling dicari:</span>
          {trendingTags.map((tag, idx) => (
            <span key={tag} className="inline-flex items-center gap-4">
              <a
                href="#katalog"
                className="hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {tag}
              </a>
              {idx < trendingTags.length - 1 && (
                <span className="text-muted-foreground/30">·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Hongfilms Minimalist Ticker Bar */}
      <div className="border-y border-border/40 py-3.5 text-center font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70">
        AI Models <span className="px-3 text-primary">✦</span> Developer Tools{" "}
        <span className="px-3 text-primary">✦</span> Creative Suite{" "}
        <span className="px-3 text-primary">✦</span> Cloud Infra{" "}
        <span className="px-3 text-primary">✦</span> 2-5 Menit Aktif
      </div>
    </section>
  );
}
