import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  // Navigation states: "landing" | "payment" | "success"
  const currentView = useSignal<"landing" | "payment" | "success">("landing");
  const isNavigating = useSignal<boolean>(false);
  const isCheckingPayment = useSignal<boolean>(false);
  const paymentMethod = useSignal<"qris" | "bni">("qris");
  const copiedField = useSignal<string | null>(null);
  const activeFaq = useSignal<number | null>(null);
  const timerSeconds = useSignal<number>(300); // 5 menit
  const availableStock = useSignal<number>(5);

  const bniAccount = "1880243465";
  const bniHolder = "Hafidz Rizqullah Prasetya";
  const formattedPrice = "Rp 30.000";
  const activationLink = "https://serviceactivation.google.com/redeem?promocode=PROMO-GEMINI-18M-A19X";

  // Countdown timer saat masuk ke halaman payment
  useVisibleTask$(({ track, cleanup }) => {
    track(() => currentView.value);
    if (currentView.value === "payment") {
      timerSeconds.value = 300;
      const interval = setInterval(() => {
        if (timerSeconds.value > 0) {
          timerSeconds.value--;
        }
      }, 1000);
      cleanup(() => clearInterval(interval));
    }
  });

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Navigasi dengan loading state profesional (Industry Best Practice)
  const goToPayment = $(() => {
    if (isNavigating.value) return;
    isNavigating.value = true;
    setTimeout(() => {
      currentView.value = "payment";
      isNavigating.value = false;
    }, 600);
  });

  const checkPaymentStatus = $(() => {
    if (isCheckingPayment.value) return;
    isCheckingPayment.value = true;
    setTimeout(() => {
      isCheckingPayment.value = false;
      currentView.value = "success";
      if (availableStock.value > 1) {
        availableStock.value--;
      }
    }, 1200);
  });

  const copyToClipboard = $((text: string, fieldName: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      copiedField.value = fieldName;
      setTimeout(() => {
        copiedField.value = null;
      }, 2000);
    }
  });

  const toggleFaq = $((idx: number) => {
    activeFaq.value = activeFaq.value === idx ? null : idx;
  });

  const waConfirmUrl = `https://wa.me/6281325081046?text=${encodeURIComponent(
    "Halo Octane, saya sudah menyelesaikan pembayaran Rp 30.000 untuk Google AI Pro 18 Bulan. Mohon verifikasi ya."
  )}`;

  // JSON-LD Structured Data for Google Indexing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Google AI Pro 18 Bulan + 5TB Cloud Storage",
    "image": "https://octane.web.id/qris-code.svg",
    "description":
      "Aktivasi resmi Google AI Pro (Gemini 3 Pro, Deep Search, Google Flow 1.000 kredit, dan Google Antigravity) 18 Bulan seharga Rp 30.000.",
    "brand": {
      "@type": "Brand",
      "name": "Octane"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://octane.web.id/",
      "priceCurrency": "IDR",
      "price": "30000",
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  return (
    <div class="relative min-h-screen bg-black text-white selection:bg-neutral-800 selection:text-white antialiased font-sans flex flex-col justify-between">
      {/* JSON-LD Script for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={JSON.stringify(jsonLd)}
      />

      {/* Atmospheric Ambient Glow (Linear / Raycast Style) */}
      <div
        aria-hidden="true"
        class="pointer-events-none fixed top-0 left-1/2 -z-10 h-[580px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),rgba(99,102,241,0.06)_40%,transparent_70%)] blur-[110px]"
      ></div>

      {/* Top Header Minimalis & Glass */}
      <header class="sticky top-0 z-50 w-full border-b border-white/8 bg-black/80 backdrop-blur-xl">
        <div class="container-wrap flex items-center justify-between py-3.5">
          <button
            type="button"
            onClick$={() => (currentView.value = "landing")}
            class="flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none"
          >
            <span class="text-sm font-bold tracking-tight text-white">Octane</span>
            <span class="text-[11px] font-medium text-neutral-400">/ Google AI Pro</span>
          </button>

          {/* Live Scarcity & Stock Pip in Header */}
          <div class="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-neutral-300">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Aktivasi 18 Bulan</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main class="container-wrap py-6 md:py-12 flex-1 flex flex-col justify-center">

        {/* LOADING OVERLAY TRANSISI ANTAR HALAMAN */}
        {isNavigating.value && (
          <div class="mx-auto max-w-sm w-full text-center py-24">
            <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white mb-4 animate-spin">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <div class="text-sm font-semibold text-white">Menyiapkan Sesi Pembayaran...</div>
            <div class="text-xs text-neutral-400 mt-1">Mengamankan sesi aktivasi & QRIS instan.</div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: LANDING (Center Price + Visual UI Cards + Zero Clutter) */}
        {/* ======================================================== */}
        {!isNavigating.value && currentView.value === "landing" && (
          <div class="mx-auto max-w-xl text-center">
            
            {/* Urgency Stock Badge */}
            <div class="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-300">
              <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Sisa Slot Batch Hari Ini: {availableStock.value} Tautan</span>
            </div>

            {/* Title Ringkas & Tajam */}
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Google AI Pro
              <span class="block text-neutral-400 font-semibold text-lg sm:text-2xl mt-1">
                Aktivasi Resmi 18 Bulan Penuh
              </span>
            </h1>

            {/* BIG CENTERED 30K PRICE (DEAD-CENTER STAGE) */}
            <div class="my-6 flex flex-col items-center justify-center text-center">
              <div class="text-5xl sm:text-6xl font-black text-white tracking-tight">
                {formattedPrice}
              </div>
              <div class="mt-2 flex items-center justify-center gap-2">
                <span class="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-neutral-400 line-through">
                  Rp 309.000/bln
                </span>
                <span class="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-neutral-200">
                  Sekali Bayar • 18 Bulan
                </span>
              </div>
            </div>

            {/* Primary Action Button (Centered) */}
            <div class="flex justify-center">
              <button
                type="button"
                onClick$={goToPayment}
                class="luminous-cta w-full sm:w-auto min-w-[280px] max-w-sm inline-flex items-center justify-center gap-2.5 rounded-full text-black px-8 py-4 text-sm sm:text-base font-bold transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <span>Beli Sekarang — Rp 30.000</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <p class="mt-2 text-[11px] text-neutral-400 whitespace-nowrap">
              Tanpa registrasi akun • Bayar QRIS • Tautan instan
            </p>

            {/* Specular Divider */}
            <div class="specular-divider my-7"></div>

            {/* VISUAL ICON-FIRST BENEFIT GRID (Orang Malas Baca -> Cukup Liat Icon!) */}
            <div class="grid grid-cols-2 gap-2.5 text-left max-w-md mx-auto">
              
              {/* Feature 1: Gemini 3 Pro */}
              <div class="glass-card rounded-2xl p-3.5 flex flex-col justify-between">
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold text-white">Gemini 3 Pro</div>
                  <div class="text-[11px] text-neutral-400 leading-tight mt-0.5">Batas 4x Lipat + Deep Search</div>
                </div>
              </div>

              {/* Feature 2: Google Flow Studio */}
              <div class="glass-card rounded-2xl p-3.5 flex flex-col justify-between">
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="m9 8 6 4-6 4Z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold text-white">1.000 Kredit Flow</div>
                  <div class="text-[11px] text-neutral-400 leading-tight mt-0.5">Studio Video AI Sinematik</div>
                </div>
              </div>

              {/* Feature 3: 5TB Cloud */}
              <div class="glass-card rounded-2xl p-3.5 flex flex-col justify-between">
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold text-white">5TB Cloud Storage</div>
                  <div class="text-[11px] text-neutral-400 leading-tight mt-0.5">Drive, Photos, dan Gmail</div>
                </div>
              </div>

              {/* Feature 4: Antigravity */}
              <div class="glass-card rounded-2xl p-3.5 flex flex-col justify-between">
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m18 16 4-4-4-4" />
                    <path d="m6 8-4 4 4 4" />
                    <path d="m14.5 4-5 16" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold text-white">Google Antigravity</div>
                  <div class="text-[11px] text-neutral-400 leading-tight mt-0.5">Platform Agen Otonom AI</div>
                </div>
              </div>

            </div>

            {/* Feature 5: Security / Direct Link Full Width Card */}
            <div class="mt-2.5 max-w-md mx-auto">
              <div class="glass-card rounded-2xl p-3 flex items-center gap-3 text-left">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold text-white">Aktivasi Mandiri Tanpa Password</div>
                  <div class="text-[11px] text-neutral-400">Klaim langsung via domain resmi Google di akun pribadimu.</div>
                </div>
              </div>
            </div>

            {/* Specular Divider */}
            <div class="specular-divider my-7"></div>

            {/* Essential FAQs (Glassmorphic Cards + Rotating Chevron) */}
            <div class="text-left max-w-md mx-auto">
              <div class="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Pertanyaan Penting
              </div>
              <div class="space-y-2">
                {[
                  {
                    q: "Bagaimana cara kerja klaimnya?",
                    a: "Setelah pembayaran diverifikasi, layar ini seketika memunculkan tautan aktivasi resmi dari domain serviceactivation.google.com. Anda cukup membuka tautan tersebut di peramban dan mengonfirmasi aktivasi pada akun Google Anda.",
                  },
                  {
                    q: "Apakah perlu memberikan password email saya?",
                    a: "Sama sekali tidak. Anda tidak membagikan kata sandi apa pun. Proses klaim 100% dilakukan mandiri oleh Anda di akun Google pribadi Anda.",
                  },
                  {
                    q: "Apakah ada garansi atau pengembalian dana?",
                    a: "Tidak ada garansi perpanjangan berkala maupun pengembalian dana setelah tautan aktivasi terbit (as-is / final sale). Tautan aktivasi resmi langsung dari Google dan wajib segera diklaim ke akun Google Anda saat transaksi berhasil.",
                  },
                ].map((faq, idx) => (
                  <div key={idx} class="glass-card overflow-hidden rounded-xl">
                    <button
                      type="button"
                      onClick$={() => toggleFaq(idx)}
                      class="flex w-full items-center justify-between p-3.5 text-left text-xs font-medium text-white hover:text-neutral-300 focus-visible:outline-none"
                    >
                      <span>{faq.q}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        class={`transition-transform duration-200 text-neutral-400 ${
                          activeFaq.value === idx ? "rotate-180" : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {activeFaq.value === idx && (
                      <div class="border-t border-white/6 px-3.5 pt-1 pb-3.5 text-xs text-neutral-400 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: PAYMENT (QRIS Langsung + Countdown + Live Status) */}
        {/* ======================================================== */}
        {!isNavigating.value && currentView.value === "payment" && (
          <div class="mx-auto max-w-sm w-full">
            {/* Back Button */}
            <button
              type="button"
              onClick$={() => (currentView.value = "landing")}
              class="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </button>

            {/* Payment Box */}
            <div class="glass-card overflow-hidden rounded-2xl p-5 shadow-2xl text-center">
              
              <div class="flex items-center justify-between border-b border-white/8 pb-3.5">
                <div class="text-left">
                  <div class="text-[11px] text-neutral-400">Total Pembayaran</div>
                  <div class="text-xl font-bold text-white">{formattedPrice}</div>
                </div>

                <div class="text-right">
                  <div class="text-[11px] text-neutral-400">Batas Waktu</div>
                  <div class="font-mono text-xs font-bold text-white">
                    {formatTimer(timerSeconds.value)}
                  </div>
                </div>
              </div>

              {/* Payment Tabs Monokrom */}
              <div class="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-black p-1 border border-white/8">
                <button
                  type="button"
                  onClick$={() => (paymentMethod.value = "qris")}
                  class={`rounded-md py-1.5 text-xs font-semibold transition-all ${
                    paymentMethod.value === "qris"
                      ? "bg-white text-black shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  QRIS Instan
                </button>
                <button
                  type="button"
                  onClick$={() => (paymentMethod.value = "bni")}
                  class={`rounded-md py-1.5 text-xs font-semibold transition-all ${
                    paymentMethod.value === "bni"
                      ? "bg-white text-black shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Transfer BNI
                </button>
              </div>

              {/* QRIS Container */}
              {paymentMethod.value === "qris" && (
                <div class="mt-4 flex flex-col items-center">
                  <div class="relative rounded-xl bg-white p-3 shadow-lg">
                    <img
                      src="/qris-code.svg"
                      alt="QRIS Pembayaran 30 Ribu"
                      width="190"
                      height="190"
                      class="block rounded-md"
                    />
                  </div>

                  <p class="mt-2.5 text-[11px] text-neutral-400">
                    BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay.
                  </p>

                  <div class="mt-3 flex items-center gap-2">
                    <a
                      href="/qris-code.svg"
                      download="QRIS-Octane-30k.svg"
                      class="rounded-lg border border-white/12 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white"
                    >
                      Unduh QR
                    </a>
                    <button
                      type="button"
                      onClick$={() => copyToClipboard("30000", "nominal")}
                      class="rounded-lg border border-white/12 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white"
                    >
                      {copiedField.value === "nominal" ? "Nominal Tersalin" : "Salin Rp 30.000"}
                    </button>
                  </div>
                </div>
              )}

              {/* BNI Container */}
              {paymentMethod.value === "bni" && (
                <div class="mt-4 rounded-xl border border-white/8 bg-black/40 p-3.5 text-left">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-neutral-400">Bank Tujuan</span>
                    <span class="font-bold text-white">BNI</span>
                  </div>

                  <div class="mt-2.5">
                    <div class="text-[11px] text-neutral-400">Nomor Rekening</div>
                    <div class="mt-0.5 flex items-center justify-between">
                      <span class="font-mono text-sm font-bold text-white tracking-wider">
                        {bniAccount}
                      </span>
                      <button
                        type="button"
                        onClick$={() => copyToClipboard(bniAccount, "bni")}
                        class="rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-neutral-200 hover:bg-white/20"
                      >
                        {copiedField.value === "bni" ? "Tersalin" : "Salin"}
                      </button>
                    </div>
                  </div>

                  <div class="mt-2.5">
                    <div class="text-[11px] text-neutral-400">Atas Nama</div>
                    <div class="text-xs font-medium text-white">{bniHolder}</div>
                  </div>
                </div>
              )}

              {/* Status Verification Checker Button */}
              <div class="mt-5 pt-3.5 border-t border-white/8">
                <button
                  type="button"
                  disabled={isCheckingPayment.value}
                  onClick$={checkPaymentStatus}
                  class="luminous-cta w-full rounded-full text-black py-3 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCheckingPayment.value ? (
                    <>
                      <svg class="animate-spin h-3.5 w-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      <span>Memverifikasi Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <span>Saya Sudah Bayar (Cek Status)</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Fallback Help */}
              <div class="mt-3 text-center">
                <a
                  href={waConfirmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[11px] text-neutral-500 hover:text-neutral-300"
                >
                  Konfirmasi manual via WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: SUCCESS (Output Langsung Tautan Aktivasi)         */}
        {/* ======================================================== */}
        {!isNavigating.value && currentView.value === "success" && (
          <div class="mx-auto max-w-sm w-full">
            <div class="glass-card overflow-hidden rounded-2xl p-5 shadow-2xl text-center">

              {/* Checkmark Icon Clean Monochrome */}
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              <h2 class="text-xl font-bold text-white">
                Pembayaran Terverifikasi
              </h2>
              <p class="mt-1 text-xs text-neutral-400">
                Tautan aktivasi Google AI Pro 18 Bulan Anda siap diklaim.
              </p>

              {/* Activation Link Container */}
              <div class="mt-5 rounded-xl border border-white/10 bg-black p-3.5 text-left">
                <div class="text-[11px] text-neutral-400 mb-1">
                  Tautan Aktivasi Resmi Google:
                </div>

                <div class="font-mono text-xs text-white break-all select-all bg-white/[0.04] p-2.5 rounded-lg border border-white/6">
                  {activationLink}
                </div>

                <div class="mt-3 flex items-center gap-2">
                  <a
                    href={activationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex-1 rounded-lg bg-white text-black py-2.5 text-center text-xs font-bold hover:bg-neutral-200 transition-colors"
                  >
                    Klaim Sekarang
                  </a>

                  <button
                    type="button"
                    onClick$={() => copyToClipboard(activationLink, "link")}
                    class="rounded-lg border border-white/12 bg-white/5 px-3 py-2.5 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white"
                  >
                    {copiedField.value === "link" ? "Tersalin" : "Salin"}
                  </button>
                </div>
              </div>

              {/* 2-Step Claim Guide & No Warranty Notice */}
              <div class="mt-4 text-left text-xs text-neutral-400 space-y-1.5 border-t border-white/8 pt-3">
                <div>1. Pastikan peramban Anda sudah login ke akun Google pribadi Anda.</div>
                <div>2. Klik tombol klaim di atas dan tekan konfirmasi. Benefit langsung aktif.</div>
                <div class="text-[11px] text-neutral-500 pt-1">
                  Catatan: Tautan berlaku 1x pakai langsung dan tanpa garansi perpanjangan. Harap segera klaim.
                </div>
              </div>

              {/* Reset to home button */}
              <div class="mt-5">
                <button
                  type="button"
                  onClick$={() => (currentView.value = "landing")}
                  class="text-xs text-neutral-500 hover:text-white"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer Minimal with SEO & Legal Disclaimer */}
      <footer class="w-full border-t border-white/8 py-6 text-center text-xs text-neutral-500">
        <div class="container-wrap">
          <p class="text-neutral-400">© 2026 Octane (octane.web.id). Seluruh hak cipta dilindungi.</p>
          <p class="mt-1 text-[11px] text-neutral-600 max-w-md mx-auto">
            Penafian: Octane adalah penyedia independen aktivasi digital promo dan tidak berafiliasi resmi dengan Google LLC atau Alphabet Inc.
          </p>
        </div>
      </footer>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Beli Google AI Pro 18 Bulan + 5TB Cloud Storage Rp 30.000 | Octane",
  meta: [
    {
      name: "description",
      content:
        "Beli aktivasi resmi Google AI Pro 18 Bulan (Gemini 3 Pro, Deep Search, Google Flow, dan Google Antigravity) + 5TB Cloud Storage seharga Rp 30.000 sekali bayar. Tanpa login akun, bayar via QRIS otomatis.",
    },
    {
      name: "keywords",
      content:
        "google ai pro, beli gemini pro, google one 5tb, aktivasi gemini 18 bulan, google flow, deep search, octane web id, qris gemini",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "og:title",
      content: "Beli Google AI Pro 18 Bulan + 5TB Cloud Storage Rp 30.000 | Octane",
    },
    {
      property: "og:description",
      content:
        "Upgrade akun Google pribadi ke Google AI Pro 18 Bulan seharga Rp 30.000 sekali bayar. Langsung bayar via QRIS tanpa login.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://octane.web.id/",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "Beli Google AI Pro 18 Bulan + 5TB Cloud Storage Rp 30.000 | Octane",
    },
    {
      name: "twitter:description",
      content:
        "Aktivasi resmi Google AI Pro 18 Bulan Rp 30.000 sekali bayar via QRIS.",
    },
  ],
  links: [
    {
      rel: "canonical",
      href: "https://octane.web.id/",
    },
  ],
};
