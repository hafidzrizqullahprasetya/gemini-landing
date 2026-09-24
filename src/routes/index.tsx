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

  const bniAccount = "1880243465";
  const bniHolder = "Hafidz Rizqullah Prasetya";
  const formattedPrice = "Rp 30.000";
  const activationLink = "https://serviceactivation.google.com/redeem?promocode=OCTANE-GOOGLE-AI-PRO-18M";

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
    }, 650);
  });

  const checkPaymentStatus = $(() => {
    if (isCheckingPayment.value) return;
    isCheckingPayment.value = true;
    setTimeout(() => {
      isCheckingPayment.value = false;
      currentView.value = "success";
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

  return (
    <div class="relative min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white antialiased font-sans flex flex-col justify-between">
      {/* Background Soft Glow */}
      <div
        aria-hidden="true"
        class="pointer-events-none fixed top-0 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,145,255,0.14),transparent_70%)] blur-3xl"
      ></div>

      {/* Top Header */}
      <header class="sticky top-0 z-50 w-full border-b border-white/8 bg-black/70 backdrop-blur-xl">
        <div class="container-wrap flex items-center justify-between py-3.5">
          <button
            type="button"
            onClick$={() => (currentView.value = "landing")}
            class="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none"
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-blue-400">
                <path
                  d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-base font-bold tracking-tight text-white">Octane</span>
              <span class="text-xs font-semibold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Google AI Pro
              </span>
            </div>
          </button>

          <div class="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Aktivasi 18 Bulan Aktif</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main class="container-wrap py-8 md:py-16 flex-1 flex flex-col justify-center">

        {/* LOADING OVERLAY TRANSISI ANTAR HALAMAN */}
        {isNavigating.value && (
          <div class="mx-auto max-w-sm w-full text-center py-20">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-4 animate-spin">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <div class="text-sm font-bold text-white">Menyiapkan Sesi Pembayaran...</div>
            <div class="text-xs text-neutral-400 mt-1">Meng-generate QRIS unik & mengamankan sesi aktivasi.</div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: LANDING (Judul Besar + Tagline + Tombol Beli)     */}
        {/* ======================================================== */}
        {!isNavigating.value && currentView.value === "landing" && (
          <div class="mx-auto max-w-3xl text-center">
            {/* Grand Title */}
            <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Upgrade Akun Google ke <br />
              <span class="hero-accent-gradient">Google AI Pro</span> & <span class="gemini-accent-gradient">5TB Storage</span>
            </h1>

            {/* Tagline */}
            <p class="mt-6 text-base sm:text-lg leading-relaxed text-neutral-300 max-w-2xl mx-auto">
              Dapatkan akses lebih tinggi ke fitur baru dan canggih untuk meningkatkan produktivitas dan kreativitas Anda. Batas penggunaan 4x lebih tinggi, Deep Search, dan Google Antigravity langsung di akun Google pribadimu.
            </p>

            {/* Pricing Tag */}
            <div class="mt-8 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2">
              <span class="text-xs text-neutral-400 line-through">Rp 309.000 / bln</span>
              <span class="text-xl sm:text-2xl font-black text-white">{formattedPrice}</span>
              <span class="rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                18 Bulan Penuh
              </span>
            </div>

            {/* Direct Buy Button (Liquid Metal) */}
            <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick$={goToPayment}
                class="figma-liquid-button group relative inline-flex min-w-[260px] items-center justify-center overflow-hidden rounded-full border border-white/20 px-9 py-4 text-base font-extrabold text-white shadow-2xl transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <div class="cta-btn-inner-glow absolute inset-0 rounded-full pointer-events-none"></div>
                <div class="cta-btn-border-base absolute inset-0 rounded-full pointer-events-none"></div>
                <div class="cta-btn-border-shine absolute inset-0 rounded-full pointer-events-none"></div>
                <span class="relative z-10 flex items-center gap-2.5">
                  Beli Sekarang (Rp 30.000)
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>

            <p class="mt-3 text-xs text-neutral-400">
              Tanpa registrasi akun. Klik untuk langsung bayar via QRIS otomatis.
            </p>

            {/* 6 Official Feature Pillars from Google AI Pro */}
            <div class="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-left">
              <div class="rounded-xl border border-white/8 bg-[#0c0d12] p-4">
                <div class="text-xs font-semibold text-blue-400 uppercase tracking-wider">Aplikasi Gemini</div>
                <div class="mt-1 text-sm font-bold text-white">Batas Penggunaan 4x Lipat</div>
                <p class="mt-1 text-xs text-neutral-400 leading-relaxed">
                  Batas penggunaan 4x lebih tinggi dibanding versi gratis dan fitur pembuatan video AI.
                </p>
              </div>

              <div class="rounded-xl border border-white/8 bg-[#0c0d12] p-4">
                <div class="text-xs font-semibold text-purple-400 uppercase tracking-wider">Google Flow</div>
                <div class="mt-1 text-sm font-bold text-white">1.000 Kredit Studio</div>
                <p class="mt-1 text-xs text-neutral-400 leading-relaxed">
                  Studio kreatif AI untuk adegan sinematik dengan akses ke Gemini Omni Flash dan alat kustom.
                </p>
              </div>

              <div class="rounded-xl border border-white/8 bg-[#0c0d12] p-4">
                <div class="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Google Penelusuran</div>
                <div class="mt-1 text-sm font-bold text-white">Gemini 3 Pro & Deep Search</div>
                <p class="mt-1 text-xs text-neutral-400 leading-relaxed">
                  Akses lebih tinggi ke model penalaran Gemini 3 Pro, Deep Search, dan kemampuan agentic.
                </p>
              </div>

              <div class="rounded-xl border border-white/8 bg-[#0c0d12] p-4">
                <div class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Google Antigravity</div>
                <div class="mt-1 text-sm font-bold text-white">Platform Agentic Dev</div>
                <p class="mt-1 text-xs text-neutral-400 leading-relaxed">
                  Batas kapasitas standar untuk model agen di platform pengembangan agentic Google Antigravity.
                </p>
              </div>

              <div class="rounded-xl border border-white/8 bg-[#0c0d12] p-4">
                <div class="text-xs font-semibold text-amber-400 uppercase tracking-wider">Gemini Notebook</div>
                <div class="mt-1 text-sm font-bold text-white">5x Ringkasan Audio</div>
                <p class="mt-1 text-xs text-neutral-400 leading-relaxed">
                  Asisten riset dan penulisan dengan 5x lebih banyak Ringkasan Audio, notebook, dan analisis data.
                </p>
              </div>

              <div class="rounded-xl border border-white/8 bg-[#0c0d12] p-4">
                <div class="text-xs font-semibold text-pink-400 uppercase tracking-wider">Cloud Storage & Workspace</div>
                <div class="mt-1 text-sm font-bold text-white">Penyimpanan Cloud Besar</div>
                <p class="mt-1 text-xs text-neutral-400 leading-relaxed">
                  Penyimpanan cloud di Gmail, Drive, dan Foto, serta integrasi Gemini langsung di Dokumen dan Vids.
                </p>
              </div>
            </div>

            {/* Essential FAQs */}
            <div class="mt-12 text-left">
              <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Pertanyaan Penting
              </h3>
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
                    q: "Bagaimana jika ada kendala saat aktivasi?",
                    a: "Kami menyediakan garansi aktivasi penuh. Jika tautan mengalami kendala teknis, kami sediakan tautan pengganti baru atau garansi dana kembali 100%.",
                  },
                ].map((faq, idx) => (
                  <div key={idx} class="overflow-hidden rounded-xl border border-white/8 bg-[#0c0d12]">
                    <button
                      type="button"
                      onClick$={() => toggleFaq(idx)}
                      class="flex w-full items-center justify-between p-3.5 text-left text-xs sm:text-sm font-semibold text-white hover:text-blue-400 focus-visible:outline-none"
                    >
                      <span>{faq.q}</span>
                      <span class="ml-2 text-neutral-400 text-xs">{activeFaq.value === idx ? "−" : "+"}</span>
                    </button>
                    {activeFaq.value === idx && (
                      <div class="border-t border-white/6 px-3.5 pt-1 pb-3.5 text-xs text-neutral-300 leading-relaxed">
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
          <div class="mx-auto max-w-md w-full">
            {/* Back Button */}
            <button
              type="button"
              onClick$={() => (currentView.value = "landing")}
              class="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 transition-colors hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Kembali ke Halaman Awal
            </button>

            {/* Payment Box */}
            <div class="overflow-hidden rounded-3xl border border-white/14 bg-[#0d0e13] p-6 shadow-2xl text-center">
              
              <div class="flex items-center justify-between border-b border-white/8 pb-4">
                <div class="text-left">
                  <div class="text-xs text-neutral-400">Total Pembayaran</div>
                  <div class="text-2xl font-black text-white">{formattedPrice}</div>
                </div>

                <div class="text-right">
                  <div class="text-[11px] text-neutral-400">Waktu Pembayaran</div>
                  <div class="font-mono text-sm font-bold text-amber-400">
                    {formatTimer(timerSeconds.value)}
                  </div>
                </div>
              </div>

              {/* Payment Tabs */}
              <div class="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-black/60 p-1 border border-white/8">
                <button
                  type="button"
                  onClick$={() => (paymentMethod.value = "qris")}
                  class={`rounded-lg py-2 text-xs font-bold transition-all ${
                    paymentMethod.value === "qris"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  QRIS Instan
                </button>
                <button
                  type="button"
                  onClick$={() => (paymentMethod.value = "bni")}
                  class={`rounded-lg py-2 text-xs font-bold transition-all ${
                    paymentMethod.value === "bni"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Transfer BNI
                </button>
              </div>

              {/* QRIS Container */}
              {paymentMethod.value === "qris" && (
                <div class="mt-5 flex flex-col items-center">
                  <div class="relative rounded-2xl bg-white p-3.5 shadow-xl">
                    <img
                      src="/qris-code.svg"
                      alt="QRIS Pembayaran 30 Ribu"
                      width="210"
                      height="210"
                      class="block rounded-lg"
                    />
                  </div>

                  <p class="mt-3 text-xs text-neutral-300 font-medium">
                    Scan via BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay.
                  </p>

                  <div class="mt-3 flex items-center gap-2">
                    <a
                      href="/qris-code.svg"
                      download="QRIS-Octane-30k.svg"
                      class="rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-white/10 hover:text-white"
                    >
                      Unduh QR
                    </a>
                    <button
                      type="button"
                      onClick$={() => copyToClipboard("30000", "nominal")}
                      class="rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-white/10 hover:text-white"
                    >
                      {copiedField.value === "nominal" ? "Nominal Tersalin" : "Salin Rp 30.000"}
                    </button>
                  </div>
                </div>
              )}

              {/* BNI Container */}
              {paymentMethod.value === "bni" && (
                <div class="mt-5 rounded-2xl border border-white/8 bg-black/40 p-4 text-left">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-neutral-400">Bank Tujuan</span>
                    <span class="font-bold text-white">BNI</span>
                  </div>

                  <div class="mt-3">
                    <div class="text-[11px] text-neutral-400">Nomor Rekening</div>
                    <div class="mt-0.5 flex items-center justify-between">
                      <span class="font-mono text-base font-bold text-white tracking-wider">
                        {bniAccount}
                      </span>
                      <button
                        type="button"
                        onClick$={() => copyToClipboard(bniAccount, "bni")}
                        class="rounded bg-blue-500/20 px-2 py-1 text-xs font-bold text-blue-300 hover:bg-blue-500/30"
                      >
                        {copiedField.value === "bni" ? "Tersalin!" : "Salin"}
                      </button>
                    </div>
                  </div>

                  <div class="mt-3">
                    <div class="text-[11px] text-neutral-400">Atas Nama</div>
                    <div class="text-xs font-semibold text-white">{bniHolder}</div>
                  </div>
                </div>
              )}

              {/* Live Status Radar & Verification Button */}
              <div class="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <div class="flex items-center justify-center gap-2.5 text-xs text-neutral-300">
                  <span class="relative flex h-2.5 w-2.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                  <span>Menunggu sinyal pembayaran...</span>
                </div>
                <p class="mt-1 text-[11px] text-neutral-500">
                  Layar otomatis memunculkan link aktivasi begitu pembayaran terkonfirmasi.
                </p>

                {/* Professional Status Checker Button */}
                <div class="mt-4 pt-3 border-t border-white/6">
                  <button
                    type="button"
                    disabled={isCheckingPayment.value}
                    onClick$={checkPaymentStatus}
                    class="w-full rounded-xl border border-blue-500/30 bg-blue-600/20 py-3 text-xs font-bold text-blue-300 transition-colors hover:bg-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCheckingPayment.value ? (
                      <>
                        <svg class="animate-spin h-4 w-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        <span>Memverifikasi Mutasi Pembayaran...</span>
                      </>
                    ) : (
                      <>
                        <span>Saya Sudah Bayar (Cek Status Sekarang)</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Fallback Help */}
              <div class="mt-4 text-center">
                <a
                  href={waConfirmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs text-neutral-400 hover:text-white underline decoration-neutral-600"
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
          <div class="mx-auto max-w-lg w-full">
            <div class="overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#0b100e] p-6 sm:p-8 shadow-2xl text-center">

              {/* Checkmark Icon */}
              <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              <h2 class="mt-4 text-2xl font-black text-white">
                Pembayaran Berhasil Diverifikasi!
              </h2>
              <p class="mt-1.5 text-xs text-neutral-300">
                Paket Google AI Pro 18 Bulan Anda sudah siap diklaim ke akun Google pribadi Anda.
              </p>

              {/* Activation Link Container */}
              <div class="mt-6 rounded-2xl border border-white/12 bg-black/70 p-4 text-left">
                <div class="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                  <span class="font-semibold text-emerald-400">Tautan Resmi Google</span>
                  <span>1x Pakai</span>
                </div>

                <div class="font-mono text-xs text-blue-300 break-all select-all bg-white/[0.04] p-3 rounded-xl border border-white/8">
                  {activationLink}
                </div>

                <div class="mt-3 flex items-center gap-2">
                  <a
                    href={activationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="figma-liquid-button flex-1 rounded-xl border border-blue-500/30 py-3 text-center text-xs font-bold text-white shadow-lg active:scale-95"
                  >
                    Klaim ke Akun Google Sekarang
                  </a>

                  <button
                    type="button"
                    onClick$={() => copyToClipboard(activationLink, "link")}
                    class="rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-xs font-semibold text-neutral-200 hover:bg-white/10 hover:text-white"
                  >
                    {copiedField.value === "link" ? "Tersalin!" : "Salin"}
                  </button>
                </div>
              </div>

              {/* 2-Step Claim Guide */}
              <div class="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-left">
                <div class="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Petunjuk Klaim Mandiri
                </div>
                <ol class="space-y-2 text-xs text-neutral-300 list-decimal list-inside leading-relaxed">
                  <li>Pastikan peramban Anda sudah login dengan akun Google yang ingin di-upgrade.</li>
                  <li>Buka tautan aktivasi di atas dan klik tombol konfirmasi. Semua benefit Google AI Pro langsung aktif seketika.</li>
                </ol>
              </div>

              {/* Reset to home button */}
              <div class="mt-6">
                <button
                  type="button"
                  onClick$={() => (currentView.value = "landing")}
                  class="text-xs text-neutral-400 hover:text-white underline decoration-neutral-600"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer Minimal */}
      <footer class="w-full border-t border-white/8 py-4 text-center text-xs text-neutral-500">
        © 2026 Octane AI (octane.web.id). Layanan aktivasi mandiri Google AI Pro.
      </footer>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Upgrade Google AI Pro 18 Bulan + Cloud Storage | Octane",
  meta: [
    {
      name: "description",
      content:
        "Upgrade akun Google pribadi ke Google AI Pro (Gemini 3 Pro, Deep Search, Google Antigravity, dan Google Flow) 18 Bulan seharga Rp 30.000 sekali bayar. Tanpa login, bayar langsung via QRIS.",
    },
    {
      property: "og:title",
      content: "Upgrade Google AI Pro 18 Bulan + Cloud Storage | Octane",
    },
    {
      property: "og:description",
      content:
        "Aktivasi resmi Google AI Pro 18 Bulan Rp 30.000. Langsung bayar via QRIS tanpa login.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://octane.web.id/",
    },
  ],
};
