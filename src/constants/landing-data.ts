import type {
  BenefitItem,
  SecurityFeatureItem,
  FaqItem,
  PricingConfig,
  ProductMetadata,
} from "~/types/landing";

export const PRICING_CONFIG = {
  originalPriceFormatted: "Rp 309 rb/bln",
  promoPriceFormatted: "Rp 1",
  promoPriceNumeric: 1,
  currency: "IDR",
  billingPeriodLabel: "Test Produksi • 18 Bulan",
  headlineBenefit: "Akses 4x Lipat ke Gemini 3.1 Pro + Cloud 5 TB",
  storageCapacity: "5 TB",
  geminiMultiplier: "Akses 4x Lipat*",
} as const satisfies PricingConfig;

export const ACTIVATION_FALLBACK_LINK =
  "https://serviceactivation.google.com/redeem?promocode=PROMO-GEMINI-18M-A19X" as const;

export const WHATSAPP_CONFIRM_URL =
  `https://wa.me/6281325081046?text=${encodeURIComponent(
    "Halo Octane, saya sudah menyelesaikan pembayaran Rp 1 untuk Google AI Pro 18 Bulan. Mohon verifikasi ya.",
  )}` as const;

export const BENEFIT_ITEMS = [
  {
    id: "gemini-31-pro",
    title: "Gemini 3.1 Pro & Deep Research",
    highlight: "Akses 4x Lipat",
    tagline: "Produktivitas, riset mendalam & integrasi Workspace",
    description:
      "Akses yang diperluas ke Gemini 3.1 Pro, Deep Research di Gemini, dan Mode AI Google Penelusuran.",
    bullets: [
      "Akses 4x lipat ke Gemini 3.1 Pro & Deep Research",
      "Mode AI Penelusuran (Deep Search) & Gemini Spark",
      "Gemini di Gmail, Dokumen, Spreadsheet, & Ringkasan AI",
      "Laporan informatif multihalaman di Gemini Notebook",
    ],
    badgeColor: "blue",
    iconType: "gemini",
  },
  {
    id: "coding-agentic",
    title: "Coding Cepat & AI Agentic",
    highlight: "Antigravity & AI Studio",
    tagline: "Platform agen otonom & dev tools ekosistem Google",
    description:
      "Batas lebih tinggi di AI Studio, Google Antigravity, Jules, dan Android Studio AI + US$10 kredit Cloud bulanan.",
    bullets: [
      "Batas lebih tinggi di AI Studio, Google Antigravity, & Jules",
      "Bantuan AI agentic di Android Studio pada model terbaik",
      "US$10 kredit Google Cloud bulanan Developer Program",
    ],
    badgeColor: "emerald",
    iconType: "antigravity",
  },
  {
    id: "kreativitas-flow",
    title: "Google Flow & Multimedia",
    highlight: "1.000 Kredit / Bulan",
    tagline: "Generasi video AI sinematik, musik & gambar",
    description:
      "Model pembuatan video, musik, dan gambar sinematik di Google Flow serta kuota pembuatan Remix lebih besar di Foto.",
    bullets: [
      "1.000 kredit Flow bulanan untuk studio video sinematik Veo 2",
      "Model pembuatan gambar resolusi tinggi, audio, & musik",
      "Kuota pembuatan Remix foto lebih besar di Google Foto",
    ],
    badgeColor: "purple",
    iconType: "flow",
  },
  {
    id: "cloud-5tb",
    title: "Penyimpanan 5 TB & Ekosistem",
    highlight: "5 TB Cloud + Keluarga",
    tagline: "Penyimpanan cloud bersama dan ekosistem Google",
    description:
      "Penyimpanan cloud 5 TB untuk Drive, Gmail, dan Foto kualitas asli. Dapat dibagikan hingga maksimal 5 anggota keluarga.",
    bullets: [
      "Penyimpanan cloud 5 TB untuk Gmail, Drive, & Foto asli",
      "Berbagi dengan keluarga hingga maksimal 5 orang anggota",
      "Google Home Premium ($10/bln) & Health Premium gratis",
    ],
    badgeColor: "cyan",
    iconType: "cloud",
  },
] as const satisfies readonly BenefitItem[];

export const SECURITY_FEATURE = {
  title: "Aktivasi Mandiri Resmi: 100% Tanpa Kata Sandi",
  description:
    "Tautan resmi langsung dari domain serviceactivation.google.com. Diklaim langsung ke akun Google pribadi Anda.",
} as const satisfies SecurityFeatureItem;

export const FAQ_ITEMS = [
  {
    question: "Bagaimana cara kerja klaim tautan resmi Google AI Pro?",
    answer:
      "Setelah verifikasi pembayaran Rp 1, layar seketika memunculkan tautan aktivasi resmi dari domain serviceactivation.google.com. Anda cukup membuka tautan tersebut di peramban dan mengonfirmasi aktivasi pada akun Google Anda.",
  },
  {
    question: "Apakah penyimpanan 5 TB bisa dibagikan dengan keluarga?",
    answer:
      "Ya. Sama persis seperti paket resmi Google AI Pro, kapasitas penyimpanan cloud 5 TB dapat Anda bagikan melalui grup keluarga Google (Family Sharing) untuk maksimal 5 orang anggota.",
  },
  {
    question: "Apakah perlu memberikan password email saya?",
    answer:
      "Sama sekali tidak. Anda tidak membagikan kata sandi apa pun. Proses klaim 100% dilakukan mandiri oleh Anda langsung di akun Google pribadi Anda.",
  },
  {
    question:
      "Fitur apa saja yang disertakan dalam paket resmi Google AI Pro ini?",
    answer:
      "Mencakup Gemini 3.1 Pro & Deep Research, 5 TB penyimpanan cloud, Google Flow (1.000 kredit video/musik/gambar), kuota lebih tinggi di AI Studio, Google Antigravity, dan Jules, bantuan AI di Android Studio, kredit Google Cloud $10/bulan, Gemini di Dokumen/Spreadsheet/Gmail, serta Google Home & Health Premium.",
  },
  {
    question: "Apakah ada garansi atau pengembalian dana?",
    answer:
      "Tidak ada garansi perpanjangan berkala maupun pengembalian dana setelah tautan aktivasi terbit (as-is / final sale). Tautan aktivasi resmi langsung dari Google dan wajib segera diklaim ke akun Google Anda saat transaksi berhasil.",
  },
] as const satisfies readonly FaqItem[];

export const PRODUCT_METADATA = {
  name: "Google AI Pro 18 Bulan + 5TB Cloud Storage (Gemini 3.1 Pro)",
  brandName: "Octane",
  description:
    "Aktivasi resmi Google AI Pro 18 Bulan (Gemini 3.1 Pro, Deep Research, 5TB Storage, Google Flow, Antigravity, AI Studio, Jules, Family Share 5 orang) seharga Rp 1.",
  image: "https://octane.web.id/qris-code.svg",
  canonicalUrl: "https://octane.web.id/",
  priceValidUntil: "2026-12-31",
  aggregateRatingValue: "4.9",
  reviewCount: "148",
} as const satisfies ProductMetadata;
