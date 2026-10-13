import { BrandLogoSlider } from "@/components/BrandLogoSlider";

interface HeroSectionProps {
  totalProducts: number;
  inStockCount?: number;
}

export function HeroSection({ totalProducts }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-background border-b border-border/40">
      {/* Editorial Hero Content */}
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-20 pb-12 text-center sm:pt-28 sm:pb-16">
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

        {/* Brand Logo Slider from Reference Image */}
        <BrandLogoSlider />
      </div>
    </section>
  );
}
