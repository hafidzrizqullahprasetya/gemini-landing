import { ShoppingBag, MessageSquareText, QrCode } from "lucide-react";

export function OrderGuide() {
  const steps = [
    {
      step: "01",
      title: "Pilih Produk & Cek Durasi",
      desc: "Telusuri katalog dan tentukan paket yang sesuai kebutuhan kerja atau belajarmu. Cek status ketersediaan dan ketentuan garansi pada detail produk.",
      icon: ShoppingBag,
    },
    {
      step: "02",
      title: "Hubungi Admin via Chat",
      desc: "Klik tombol Pesan Cepat untuk terhubung ke WhatsApp atau Telegram. Pesan otomatis sudah memuat ID produk, harga, dan format akun.",
      icon: MessageSquareText,
    },
    {
      step: "03",
      title: "Bayar via QRIS & Terima Akun",
      desc: "Lakukan pembayaran instan lewat QRIS semua bank/e-wallet atau transfer bank. Akun, lisensi, atau tautan aktivasi langsung dikirimkan beserta panduan login.",
      icon: QrCode,
    },
  ];

  return (
    <section id="cara-order" className="py-14 sm:py-20 border-b hairline-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-semibold uppercase tracking-wider">
            <span>Panduan Transaksi</span>
            <span>·</span>
            <span>Mudah & Transparan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground font-display mt-1">
            Cara Melakukan Pemesanan
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
            Proses pemesanan selesai dalam hitungan menit tanpa ribet registrasi akun berbelit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-xl border hairline-border bg-card p-6 flex flex-col justify-between space-y-4 hover:border-foreground/30 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xl font-bold text-muted-foreground/60">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground font-display">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t hairline-border/60 text-xs font-mono text-muted-foreground">
                  Proses rata-rata: 2–5 menit
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
