export type Language = "id" | "en";

export interface PlanItem {
  name: string;
  price: string;
  cadence: string;
  description: string;
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  features: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface DropItemData {
  time: string;
  name: string;
  collection: string;
  badge: string;
  price: string;
  imageSrc: string;
  searchKey: string;
}

export interface Translations {
  nav: {
    catalog: string;
    drops: string;
    features: string;
    faq: string;
    cart: string;
    theme: string;
    lang: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    browseCatalog: string;
    flashDrops: string;
  };
  drops: {
    title: string;
    subtitle: string;
    items: DropItemData[];
  };
  catalog: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterInStock: string;
    sortBy: string;
    sortDefault: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortStock: string;
    sortName: string;
    allCategories: string;
    loadMore: string;
    resetFilter: string;
    noProducts: string;
    ready: string;
    outOfStock: string;
    orderNow: string;
  };
  modal: {
    specsTitle: string;
    warranty: string;
    delivery: string;
    duration: string;
    descriptionTitle: string;
    priceNote: string;
    orderWhatsapp: string;
    copySummary: string;
    copied: string;
    paymentMethods: string;
    wholesaleTitle: string;
    close: string;
    categoryLabel: string;
    idLabel: string;
    deliveryTypes: {
      instant: string;
      custom_email: string;
      manual: string;
    };
  };
  comparison: {
    title: string;
    subtitle: string;
    plans: PlanItem[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: FaqItem[];
  };
  footer: {
    headline: string;
    subhead: string;
    tagline: string;
    rights: string;
    whatsappAdmin: string;
    backToTop: string;
    badgeText: string;
  };
}

export const translations: Record<Language, Translations> = {
  id: {
    nav: {
      catalog: "Katalog",
      drops: "Flash Drops",
      features: "Keunggulan",
      faq: "FAQ",
      cart: "Buka Katalog",
      theme: "Ganti Tema",
      lang: "Bahasa",
    },
    hero: {
      badge: "Katalog Akun AI & Dev Stack Terlengkap",
      title1: "Bahan bakar kerja,",
      title2: "performa tanpa batas.",
      description:
        "Katalog akun AI premium, developer stack, dan alat kreatif bergaransi resmi. Aktivasi langsung 2–5 menit tanpa kartu kredit luar negeri, harga Rupiah transparan, dan stok real-time.",
      browseCatalog: "Telusuri {count} Produk",
      flashDrops: "Flash Drops Hari Ini",
    },
    drops: {
      title: "Flash Drops Terpopuler",
      subtitle: "Penawaran akun premium pilihan dengan stok siap kirim hari ini.",
      items: [
        {
          time: "FLASH SALE",
          name: "Gemini 18 Months",
          collection: "Google AI & 5TB Cloud Storage",
          badge: "Stok 500+",
          price: "Rp 7.500",
          imageSrc: "/products/gemini.webp",
          searchKey: "Gemini",
        },
        {
          time: "DEV TOKEN",
          name: "Claude 50M Token",
          collection: "Anthropic Claude Codex",
          badge: "Fast API",
          price: "Rp 50.500",
          imageSrc: "/products/claude.webp",
          searchKey: "Claude 50M",
        },
        {
          time: "CREATOR EDIT",
          name: "CapCut Pro 1 Bulan",
          collection: "ByteDance Video Pro Suite",
          badge: "Full Garansi",
          price: "Rp 27.500",
          imageSrc: "/products/capcut.webp",
          searchKey: "Capcut",
        },
        {
          time: "WORK & STUDY",
          name: "Microsoft 365 1 Tahun",
          collection: "Word, Excel & 1TB Cloud",
          badge: "Aktif 12 Bulan",
          price: "Rp 8.500",
          imageSrc: "/products/office365.webp",
          searchKey: "Office 365",
        },
        {
          time: "DEV HOSTING",
          name: "Railway Credits $20",
          collection: "Container & Serverless Deploy",
          badge: "Cloud Dev",
          price: "Rp 40.000",
          imageSrc: "/products/railway.webp",
          searchKey: "Railway",
        },
        {
          time: "CLOUD DB",
          name: "Supabase Credits $25",
          collection: "PostgreSQL & Auth Realtime",
          badge: "Backend Stack",
          price: "Rp 45.000",
          imageSrc: "/products/supabase.webp",
          searchKey: "Supabase",
        },
      ],
    },
    catalog: {
      title: "Daftar Produk Digital",
      subtitle: "Pilih produk yang kamu butuhkan. Informasi stok dan harga disinkronkan secara langsung dengan server.",
      searchPlaceholder: "Cari produk (Gemini, Claude, CapCut, Office, VPN)...",
      filterInStock: "Hanya Ready Stok",
      sortBy: "Urutan",
      sortDefault: "Urutan Default",
      sortPriceAsc: "Harga: Termurah",
      sortPriceDesc: "Harga: Termahal",
      sortStock: "Stok Terbanyak",
      sortName: "Nama (A–Z)",
      allCategories: "Semua",
      loadMore: "Muat Lebih Banyak ({remaining} tersisa)",
      resetFilter: "Reset Filter",
      noProducts: "Tidak ada produk yang cocok dengan pencarian atau filter yang dipilih.",
      ready: "Ready",
      outOfStock: "Habis",
      orderNow: "Detail & Beli",
    },
    modal: {
      specsTitle: "Spesifikasi Akun",
      warranty: "Garansi",
      delivery: "Pengiriman",
      duration: "Masa Aktif",
      descriptionTitle: "Detail & Panduan Penggunaan",
      priceNote: "Harga final sudah termasuk kurs konversi & biaya aktivasi.",
      orderWhatsapp: "Pesan via WhatsApp",
      copySummary: "Salin Ringkasan Produk",
      copied: "Tersalin ke clipboard",
      paymentMethods: "Metode: QRIS / Transfer BCA / Mandiri",
      wholesaleTitle: "Grosir & Tier Pembelian",
      close: "Tutup",
      categoryLabel: "Kategori",
      idLabel: "ID",
      deliveryTypes: {
        instant: "Aktivasi Instan (Kredensial Otomatis)",
        custom_email: "Undangan / Aktivasi ke Email Kamu",
        manual: "Proses Cepat Admin (2–5 Menit)",
      },
    },
    comparison: {
      title: "Standar Layanan Octane",
      subtitle: "Bandingkan transparansi dan kecepatan aktivasi kami dengan penjual umum.",
      plans: [
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
            "Stok detik ini langsung dari server (150+ varian ready)",
            "Aktivasi instan 2–5 menit via WhatsApp Hafidz Prasetya",
            "Katalog multi-supplier terlengkap (AI, Token API, Streaming, Dev)",
            "SLA garansi replace tertulis pasti & klaim 1-klik",
            "Kredensial lengkap: email, password, dan 2FA secret key",
            "Pembayaran instan bebas ribet via QRIS & bank lokal",
          ],
        },
      ],
    },
    faq: {
      title: "Pertanyaan yang Sering Diajukan",
      subtitle: "Semua jawaban terkait garansi, aktivasi, dan pembayaran.",
      items: [
        {
          q: "Apakah akun yang disediakan siap pakai dan aman digunakan?",
          a: "Ya. Setiap produk diproses langsung melalui sistem aktivasi Octane Cloud yang telah teruji. Jenis pengiriman bervariasi antara akun baru siap login, tautan aktivasi mandiri (invite), atau lisensi resmi.",
        },
        {
          q: "Bagaimana cara membaca kode 2FA saat login akun Google atau OpenAI?",
          a: "Jika format pengiriman memuat kode 2FA (contoh: JBSWY3DPEHPK3PXP), buka situs seperti 2fa-auth.com atau aplikasi Google Authenticator, masukkan secret key tersebut untuk mendapatkan 6 digit kode OTP masuk.",
        },
        {
          q: "Berapa lama estimasi pengiriman setelah pembayaran?",
          a: "Untuk produk berstatus 'Ready', pengiriman berkisar antara 2 hingga 10 menit setelah bukti pembayaran QRIS atau transfer divalidasi oleh admin.",
        },
        {
          q: "Metode pembayaran apa saja yang diterima?",
          a: "Kami menerima QRIS (mendukung GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, BRI, BNI) serta transfer antar-bank lokal tanpa biaya admin tambahan.",
        },
        {
          q: "Bagaimana prosedur jika akun terkendala atau error?",
          a: "Hubungi admin kami dengan menyertakan ID invoice transaksi dan bukti tangkapan layar kendala. Jika masih dalam masa garansi produk (FW/W-Days), akun pengganti akan segera diproses.",
        },
        {
          q: "Apakah saya bisa memesan dalam jumlah banyak untuk dijual kembali?",
          a: "Bisa. Tersedia tier harga grosir untuk pembelian partai besar (min 10-50 akun) pada produk-produk tertentu seperti Gemini 18M, Claude API, dan Microsoft 365.",
        },
      ],
    },
    footer: {
      headline: "Bahan bakar digital untuk alur kerja tanpa jeda.",
      subhead:
        "Penyedia akun AI dan software produktivitas legal bergaransi resmi. Aktivasi langsung 2–5 menit dengan pembayaran QRIS dan bank lokal.",
      tagline: "Bahan bakar digital untuk produktivitas modern.",
      rights: "Semua hak dilindungi undang-undang.",
      whatsappAdmin: "WhatsApp Admin",
      backToTop: "Kembali ke Atas",
      badgeText: "AI MODELS ✦ DEVELOPER TOOLS ✦ CREATIVE SUITE ✦ CLOUD INFRA",
    },
  },
  en: {
    nav: {
      catalog: "Catalog",
      drops: "Flash Drops",
      features: "Features",
      faq: "FAQ",
      cart: "Open Catalog",
      theme: "Toggle Theme",
      lang: "Language",
    },
    hero: {
      badge: "Premium AI Accounts & Developer Stack Catalog",
      title1: "Fuel your work,",
      title2: "unlimited performance.",
      description:
        "Premium AI accounts, developer stacks, and creative tools with official warranty. Instant 2–5 min setup without international credit cards, transparent pricing, and real-time inventory.",
      browseCatalog: "Browse {count} Products",
      flashDrops: "Today's Flash Drops",
    },
    drops: {
      title: "Featured Flash Drops",
      subtitle: "Top trending premium accounts with verified stock ready today.",
      items: [
        {
          time: "FLASH SALE",
          name: "Gemini 18 Months",
          collection: "Google AI & 5TB Cloud Storage",
          badge: "Stock 500+",
          price: "Rp 7,500",
          imageSrc: "/products/gemini.webp",
          searchKey: "Gemini",
        },
        {
          time: "DEV TOKEN",
          name: "Claude 50M Token",
          collection: "Anthropic Claude Codex",
          badge: "Fast API",
          price: "Rp 50,500",
          imageSrc: "/products/claude.webp",
          searchKey: "Claude 50M",
        },
        {
          time: "CREATOR EDIT",
          name: "CapCut Pro 1 Month",
          collection: "ByteDance Video Pro Suite",
          badge: "Full Warranty",
          price: "Rp 27,500",
          imageSrc: "/products/capcut.webp",
          searchKey: "Capcut",
        },
        {
          time: "WORK & STUDY",
          name: "Microsoft 365 1 Year",
          collection: "Word, Excel & 1TB Cloud",
          badge: "Active 12M",
          price: "Rp 8,500",
          imageSrc: "/products/office365.webp",
          searchKey: "Office 365",
        },
        {
          time: "DEV HOSTING",
          name: "Railway Credits $20",
          collection: "Container & Serverless Deploy",
          badge: "Cloud Dev",
          price: "Rp 40,000",
          imageSrc: "/products/railway.webp",
          searchKey: "Railway",
        },
        {
          time: "CLOUD DB",
          name: "Supabase Credits $25",
          collection: "PostgreSQL & Auth Realtime",
          badge: "Backend Stack",
          price: "Rp 45,000",
          imageSrc: "/products/supabase.webp",
          searchKey: "Supabase",
        },
      ],
    },
    catalog: {
      title: "Digital Product Catalog",
      subtitle: "Choose the products you need. Stock and pricing are synchronized live from the server.",
      searchPlaceholder: "Search products (Gemini, Claude, CapCut, Office, VPN)...",
      filterInStock: "In-Stock Only",
      sortBy: "Sort by",
      sortDefault: "Default Sorting",
      sortPriceAsc: "Price: Low to High",
      sortPriceDesc: "Price: High to Low",
      sortStock: "Most Stock",
      sortName: "Name (A–Z)",
      allCategories: "All",
      loadMore: "Load More ({remaining} remaining)",
      resetFilter: "Reset Filter",
      noProducts: "No products matched your search or selected filters.",
      ready: "Ready",
      outOfStock: "Sold Out",
      orderNow: "View & Order",
    },
    modal: {
      specsTitle: "Account Specifications",
      warranty: "Warranty",
      delivery: "Delivery",
      duration: "Duration",
      descriptionTitle: "Details & Usage Guide",
      priceNote: "Final price includes currency conversion & setup fee.",
      orderWhatsapp: "Order via WhatsApp",
      copySummary: "Copy Product Summary",
      copied: "Copied to clipboard",
      paymentMethods: "Methods: QRIS / Bank Transfer / USDT",
      wholesaleTitle: "Wholesale & Volume Tiers",
      close: "Close",
      categoryLabel: "Category",
      idLabel: "ID",
      deliveryTypes: {
        instant: "Instant Activation (Auto Credentials)",
        custom_email: "Email Invitation / Custom Email",
        manual: "Fast Admin Setup (2–5 Mins)",
      },
    },
    comparison: {
      title: "Octane Quality Standard",
      subtitle: "Compare our direct activation speed and transparency against generic sellers.",
      plans: [
        {
          name: "Generic Marketplaces & Resellers",
          price: "High Markup",
          cadence: "shared accounts",
          description: "Frequent login clashes, suspension risks, and sluggish middlemen.",
          cta: "Avoid Suspension Risks",
          ctaHref: "#katalog",
          features: [
            "Crowded shared accounts (screen limit collisions)",
            "Inflated pricing by third-party broker layers",
            "Clunky multi-day dispute resolution process",
            "Prone to sudden password changes or bans",
            "No onboarding guides & incomplete 2FA credentials",
          ],
        },
        {
          name: "Manual Spreadsheet Sellers",
          price: "Limited Stock",
          cadence: "manual inventory",
          description: "Unsynced manual logs that run out during peak hours.",
          cta: "Compare Speed",
          ctaHref: "#katalog",
          features: [
            "Manual inventory (often out of stock after paying)",
            "Narrow catalog limited to 5–15 basic tools",
            "Hours-long admin response queues",
            "No Developer API Tokens (Claude/Codex)",
            "Vague or undisclosed replacement warranty terms",
          ],
        },
        {
          name: "OCTANE Direct System",
          price: "Starts at Rp 7,500",
          cadence: "real-time stock",
          description: "Direct cloud-integrated digital fuel with 2–5 min instant activation.",
          highlight: true,
          cta: "Choose Octane Now",
          ctaHref: "#katalog",
          features: [
            "Live server inventory (150+ ready variants)",
            "Instant 2–5 min activation via WhatsApp Hafidz Prasetya",
            "Comprehensive multi-supplier catalog (AI, APIs, Streaming, Dev)",
            "Definite written SLA replacement policy & 1-click claim",
            "Full credentials provided: email, password & 2FA secret key",
            "Frictionless instant checkout via QRIS, Local Banks & USDT",
          ],
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Clear answers regarding warranty, delivery, and payment methods.",
      items: [
        {
          q: "Are the accounts ready to use and secure?",
          a: "Yes. Every product is handled directly through verified Octane activation systems. Delivery formats range from fresh ready-to-login accounts, direct invite links, or official licenses.",
        },
        {
          q: "How do I use the 2FA code when logging into Google or OpenAI?",
          a: "If your delivery format includes a 2FA secret key (e.g. JBSWY3DPEHPK3PXP), open 2fa-auth.com or the Google Authenticator app, enter the secret key, and copy the 6-digit OTP code to complete login.",
        },
        {
          q: "How long does activation take after payment?",
          a: "For products marked 'Ready', delivery typically takes 2 to 10 minutes once payment confirmation is validated by admin.",
        },
        {
          q: "What payment methods are supported?",
          a: "We support QRIS (GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, BRI, BNI), local bank transfers with zero extra fees, and USDT for international buyers.",
        },
        {
          q: "What is the procedure if an account runs into issues?",
          a: "Contact our admin with your transaction invoice ID and screenshot of the error. If within the warranty period (FW/W-Days), a replacement account is issued immediately.",
        },
        {
          q: "Can I order in bulk for reselling?",
          a: "Yes. Wholesale volume tiers are available for bulk orders (min 10–50 accounts) on select products such as Gemini 18M, Claude API, and Microsoft 365.",
        },
      ],
    },
    footer: {
      headline: "Digital fuel for uninterrupted modern workflows.",
      subhead:
        "Official provider of licensed AI tools and productivity accounts. Instant 2–5 minute setup via QRIS, Bank Transfer, and USDT.",
      tagline: "Digital fuel for modern productivity.",
      rights: "All rights reserved.",
      whatsappAdmin: "WhatsApp Admin",
      backToTop: "Back to Top",
      badgeText: "AI MODELS ✦ DEVELOPER TOOLS ✦ CREATIVE SUITE ✦ CLOUD INFRA",
    },
  },
};

export function localizeDuration(dur = "", lang: Language): string {
  if (lang === "id") return dur;
  let res = dur;
  res = res.replace(/\bHARI\b/gi, "DAYS");
  res = res.replace(/\bBULAN\b/gi, "MONTHS");
  res = res.replace(/\bTAHUN\b/gi, "YEARS");
  res = res.replace(/\b1 DAYS\b/gi, "1 DAY");
  res = res.replace(/\b1 MONTHS\b/gi, "1 MONTH");
  res = res.replace(/\b1 YEARS\b/gi, "1 YEAR");
  return res;
}

export function localizeWarranty(warr = "", lang: Language): string {
  if (lang === "id") return warr;
  if (/full/i.test(warr)) return "Full Warranty";
  if (/24 jam/i.test(warr)) return "24-Hour Warranty";
  if (/non-garansi/i.test(warr)) return "No Warranty";
  const m = warr.match(/(\d+)\s*Hari/i);
  if (m) return `${m[1]}-Day Warranty`;
  return "Official Warranty";
}

export function localizeCategory(cat = "", lang: Language): string {
  if (lang === "id") return cat;
  switch (cat) {
    case "Semua":
      return "All";
    case "Desain & Kreatif":
      return "Design & Creative";
    case "Office & Edu":
      return "Office & Education";
    case "Streaming & Hiburan":
      return "Streaming & Entertainment";
    case "VPN & Sistem":
      return "VPN & Security";
    default:
      return cat;
  }
}
