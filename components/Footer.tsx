import { MessageCircle, ArrowUp } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface FooterProps {
  lang?: Language;
}

export function Footer({ lang = "id" }: FooterProps) {
  const t = translations[lang].footer;
  const tNav = translations[lang].nav;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-background px-6 py-16 text-foreground sm:px-10 sm:py-24 border-t border-border/40">
      {/* Background Watermark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden opacity-[0.035] flex justify-center w-full">
        <span className="font-display font-black text-[22vw] leading-none tracking-tighter text-foreground">
          OCTANE
        </span>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Top Ticker Bar */}
        <div className="border-y border-border/40 py-4 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
          {t.badgeText}
        </div>

        {/* Center Brand Statement & Direct Action */}
        <div className="flex flex-col items-center py-16 sm:py-20 text-center">
          <div className="flex items-center gap-3 mb-5">
            <img
              src="/logo.webp"
              alt="Octane Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              OCTANE
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              (octane.web.id)
            </span>
          </div>

          <h2 className="max-w-2xl font-[Manrope] text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.04] tracking-[-0.05em] text-foreground">
            {t.headline}
          </h2>

          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed sm:text-base">
            {t.subhead}
          </p>

          <div className="mt-8 flex items-center justify-center">
            <a
              href="https://wa.me/6281325081046"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-sm transition-opacity duration-200 hover:opacity-90 inline-flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              <span>{t.whatsappAdmin}</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center text-center gap-6 border-t border-border/40 pt-8 text-xs font-mono text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              {lang === "id"
                ? "SISTEM AKTIF 24/7 · GARANSI REPLACE RESMI"
                : "24/7 ACTIVE SYSTEM · OFFICIAL SLA WARRANTY"}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="#katalog"
              className="hover:text-foreground transition-colors"
            >
              {tNav.catalog}
            </a>
            <a
              href="#drops"
              className="hover:text-foreground transition-colors"
            >
              {tNav.drops}
            </a>
            <a
              href="#keunggulan"
              className="hover:text-foreground transition-colors"
            >
              {tNav.features}
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              {tNav.faq}
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
            >
              <span>{t.backToTop}</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
