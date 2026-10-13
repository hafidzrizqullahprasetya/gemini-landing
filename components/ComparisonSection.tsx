import Pricing16, { type Plan } from "@/components/ui/pricing-16";

export function ComparisonSection() {
  const comparisonPlans: Plan[] = [
    {
      name: "Seller Konvensional",
      price: "Serba Manual",
      cadence: "tanpa integrasi",
      description: "Cara lama jualan akun digital yang rawan kendala dan lambat.",
      cta: "Bandingkan Kecepatan",
      ctaHref: "#katalog",
      features: [
        "Stok manual (sering kosong setelah transfer)",
        "Respon chat berjam-jam karena antrean panjang",
        "Katalog terbatas hanya 5–15 produk umum",
        "Klaim garansi berbelit saat akun bermasalah",
        "Hanya kirim email/password tanpa kode 2FA",
      ],
    },
    {
      name: "OCTANE Direct API",
      price: "Mulai Rp 7.500",
      cadence: "stok real-time",
      description: "Bahan bakar digital terhubung langsung ke Octane Cloud Engine.",
      highlight: true,
      cta: "Beli di Octane Sekarang",
      ctaHref: "#katalog",
      features: [
        "Stok detik ini langsung dari server (790+ unit ready)",
        "Aktivasi instan 2–5 menit tanpa birokrasi",
        "100+ varian lengkap (AI, Token API, Dev tools, Edu)",
        "SLA garansi tertulis pasti & klaim 1-klik",
        "Kredensial lengkap termasuk 2FA secret key",
        "Pembayaran praktis via QRIS & transfer bank lokal",
      ],
    },
  ];

  return (
    <div id="keunggulan">
      <Pricing16
        title="Dua Cara Beli. Pilih yang Pasti."
        subtitle="Hindari drama stok kosong dan respon berjam-jam. Octane mengedepankan kecepatan dan transparansi."
        plans={comparisonPlans}
        footnote="Seluruh akun diperiksa otomatis sebelum pengiriman. Garansi replace berlaku sesuai paket produk."
      />
    </div>
  );
}
