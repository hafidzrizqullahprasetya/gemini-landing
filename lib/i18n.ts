export type Language = "id" | "en";

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
    octaneTitle: string;
    otherTitle: string;
  };
  faq: {
    title: string;
    subtitle: string;
  };
  footer: {
    tagline: string;
    rights: string;
    whatsappAdmin: string;
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
      octaneTitle: "Octane Digital",
      otherTitle: "Penjual Biasa / Pasar Gelap",
    },
    faq: {
      title: "Pertanyaan yang Sering Diajukan",
      subtitle: "Semua jawaban terkait garansi, aktivasi, dan pembayaran.",
    },
    footer: {
      tagline: "Bahan bakar digital untuk produktivitas modern.",
      rights: "Semua hak dilindungi undang-undang.",
      whatsappAdmin: "WhatsApp Admin",
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
      subtitle: "Compare our transparency and activation speed with typical sellers.",
      octaneTitle: "Octane Digital",
      otherTitle: "Generic Sellers / Grey Market",
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about warranty, activation, and payment.",
    },
    footer: {
      tagline: "Digital fuel for modern productivity.",
      rights: "All rights reserved.",
      whatsappAdmin: "WhatsApp Admin",
    },
  },
};
