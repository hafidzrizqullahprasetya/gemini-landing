import { MessageCircle, Send, ArrowUp, ShieldCheck, Flame } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-card border-t hairline-border py-12 sm:py-16 text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b hairline-border">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold text-sm shadow-sm">
                <Flame className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                OCTANE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Katalog penyedia akun AI, alat produktivitas kerja, dan langganan digital terverifikasi. Transaksi transparan, garansi aktif, dan pembayaran aman via QRIS.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs font-mono text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>VenteBot Reseller API v1.2.0 Connected</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="#katalog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Katalog Semua Produk
                </a>
              </li>
              <li>
                <a
                  href="#drops"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Flash Drops Hari Ini
                </a>
              </li>
              <li>
                <a
                  href="#cara-order"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Panduan Transaksi
                </a>
              </li>
              <li>
                <a
                  href="#garansi"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Kebijakan Garansi & Klaim
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pertanyaan Umum (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Hubungi Kami
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Layanan bantuan pelanggan dan konfirmasi pesanan aktif setiap hari.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://wa.me/6285179927909"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border hairline-border bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                <span>WhatsApp Customer Support</span>
              </a>
              <a
                href="https://t.me/VenteTelegramBot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border hairline-border bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
              >
                <Send className="h-4 w-4 text-sky-500" />
                <span>Telegram Bot & Channel</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Octane (octane.web.id). Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Garansi Replace Terpercaya</span>
            </div>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-foreground transition-colors font-mono"
            >
              <span>Ke Atas</span>
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
