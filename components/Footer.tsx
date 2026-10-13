import { MessageCircle, Send, ArrowUp, Flame } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "Katalog", href: "#katalog" },
    { label: "Flash Drops", href: "#drops" },
    { label: "Keunggulan", href: "#keunggulan" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <footer className="w-full bg-card border-t hairline-border text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top Ticker: Hongfilms editorial style */}
        <div className="border-b hairline-border pb-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-foreground font-semibold">OCTANE CLOUD ENGINE</span>
            <span>·</span>
            <span>SISTEM AKTIF 24/7</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] uppercase tracking-wider text-muted-foreground/80">
            <span>AI Models</span>
            <span>✦</span>
            <span>Dev Tools</span>
            <span>✦</span>
            <span>Creative Suite</span>
            <span>✦</span>
            <span>Cloud Infra</span>
          </div>
        </div>

        {/* Main Content Bar: Clean flex alignment, not a template column grid */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Brand Info */}
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold text-sm shadow-sm">
                <Flame className="h-4 w-4" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                OCTANE
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                (octane.web.id)
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Penyedia akun AI dan alat kerja produktivitas bergaransi resmi. Transaksi transparan, aktivasi instan, dan pembayaran lokal via QRIS.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Direct Support Contact Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://wa.me/6285179927909"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border hairline-border bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              <span>WhatsApp Admin</span>
            </a>
            <a
              href="https://t.me/octanedigitalbot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border hairline-border bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
            >
              <Send className="h-4 w-4 text-sky-500" />
              <span>Telegram Bot</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t hairline-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Octane. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">Garansi Replace Penuh</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-foreground transition-colors font-mono"
            >
              <span>Ke Atas</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
