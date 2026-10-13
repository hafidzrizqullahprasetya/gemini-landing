import Pricing16, { type Plan } from "@/components/ui/pricing-16";

export function ComparisonSection() {
  const comparisonPlans: Plan[] = [
    {
      name: "Marketplace & Jastip Umum",
      price: "Markup Tinggi",
      cadence: "akun sharing",
      description: "Sering bermasalah akun bentrok, risiko banned, dan perantara lambat.",
      cta: "Hindari Risiko Banned",
      ctaHref: "#katalog",
      features: [
        "Akun sharing ramai-ramai (sering nabrak layar)",
        "Harga dinaikkan tinggi oleh perantara pihak ketiga",
        "Komplain rumit lewat pusat resolusi berhari-hari",
        "Rawan terkena suspend atau ganti password sepihak",
        "Tanpa panduan & kredensial 2FA tidak lengkap",
      ],
    },
    {
      name: "Toko Web Manual Lain",
      price: "Stok Terbatas",
      cadence: "update manual",
      description: "Pencatatan stok manual yang sering tidak sinkron saat jam sibuk.",
      cta: "Bandingkan Kecepatan",
      ctaHref: "#katalog",
      features: [
        "Stok dicatat manual (sering kosong setelah transfer)",
        "Katalog terbatas hanya 5–15 produk umum saja",
        "Antrean respon chat admin berjam-jam",
        "Tidak menyediakan Token API Developer (Claude/Codex)",
        "Ketentuan garansi sering tidak dijelaskan di awal",
      ],
    },
    {
      name: "OCTANE Direct System",
      price: "Mulai Rp 7.500",
      cadence: "stok real-time",
      description: "Bahan bakar digital terintegrasi langsung dengan aktivasi instan 2–5 menit.",
      highlight: true,
      cta: "Pilih Octane Sekarang",
      ctaHref: "#katalog",
      features: [
        "Stok detik ini langsung dari server (790+ unit ready)",
        "Aktivasi instan 2–5 menit via WhatsApp Hafidz Prasetya",
        "100+ varian terlengkap (AI, Token API Claude, Dev tools)",
        "SLA garansi replace tertulis pasti & klaim 1-klik",
        "Kredensial lengkap: email, password, dan 2FA secret key",
        "Pembayaran instan bebas ribet via QRIS & bank lokal",
      ],
    },
  ];

  return (
    <div id="keunggulan">
      <Pricing16
        title="Tiga Pilihan Beli. Octane Paling Pasti."
        subtitle="Bandingkan transparansi dan kecepatan layanan sebelum bertransaksi. Octane mengeliminasi risiko akun bermasalah dan drama stok kosong."
        plans={comparisonPlans}
        footnote="Seluruh akun diperiksa otomatis sebelum pengiriman. Garansi replace berlaku sesuai paket produk."
      />
    </div>
  );
}
