import { ShieldAlert, RefreshCw, Key, HelpCircle } from "lucide-react";

export function WarrantySection() {
  const points = [
    {
      title: "Garansi Replace Penuh",
      desc: "Produk berlabel Full Warranty (FW) atau dengan batas hari (W25D, W5D) mendapatkan penggantian akun baru bila mengalami kendala teknis dalam masa aktif.",
      icon: RefreshCw,
    },
    {
      title: "Ketentuan Akun Non-Garansi (NW)",
      desc: "Untuk akun bertanda NW, pembeli wajib mengecek akun dan mengganti kredensial (2FA/password/passkey) maksimal 1 jam setelah pengiriman.",
      icon: Key,
    },
    {
      title: "Format Akun & 2FA",
      desc: "Sebagian besar akun dikirimkan dalam format Email | Password | 2FA Secret. Anda bisa memasukkan 2FA secret ke autentikator seperti 2fa-auth.com atau Google Authenticator.",
      icon: ShieldAlert,
    },
    {
      title: "Layanan Bantuan Klaim",
      desc: "Klaim kendala ditangani langsung melalui WhatsApp atau Telegram dengan melampirkan ID transaksi dan tangkapan layar kendala.",
      icon: HelpCircle,
    },
  ];

  return (
    <section id="garansi" className="py-14 sm:py-20 border-b hairline-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-semibold uppercase tracking-wider">
            <span>Kebijakan Transaksi</span>
            <span>·</span>
            <span>Transparan & Adil</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground font-display mt-1">
            Ketentuan Garansi & Format Akun
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
            Harap membaca ketentuan garansi sebelum bertransaksi agar proses klaim berjalan lancar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border hairline-border bg-card p-6 flex gap-4 items-start"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground font-display">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
