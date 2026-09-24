import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const activeFaq = useSignal<number | null>(null);
  const isCopied = useSignal<boolean>(false);

  const toggleFaq = $((index: number) => {
    activeFaq.value = activeFaq.value === index ? null : index;
  });

  const whatsappNumber = "6281325081046";
  const defaultMessage = encodeURIComponent(
    "Halo min, saya mau order Link Google Gemini Pro 18 Bulan (Rp 30.000). Mohon info nomor rekening / QRIS untuk pembayaran ya."
  );
  const waUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  const copyTemplate = $(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("Halo min, saya mau order Link Google Gemini Pro 18 Bulan (Rp 30.000).");
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);
    }
  });

  return (
    <div class="relative min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white">
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        class="pointer-events-none fixed top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(66,133,244,0.18),rgba(155,114,203,0.12),transparent_70%)] blur-3xl"
      ></div>

      {/* Floating Navbar */}
      <header class="sticky top-0 z-50 w-full pt-4 transition-all">
        <div class="container-wrap flex items-center justify-between">
          {/* Brand */}
          <a href="#" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div class="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/16 bg-white/5 backdrop-blur-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-blue-400">
                <path
                  d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                  fill="url(#sparkle-grad)"
                />
                <defs>
                  <linearGradient id="sparkle-grad" x1="2" y1="2" x2="22" y2="22">
                    <stop stop-color="#8fb9ff" />
                    <stop offset="0.5" stop-color="#1d6dff" />
                    <stop offset="1" stop-color="#00bdf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="text-lg font-bold tracking-tight text-white">
              Gemini<span class="hero-accent-gradient ml-1">Pro</span>
            </span>
          </a>

          {/* Nav Links (Desktop) */}
          <nav class="hidden md:flex items-center gap-6 rounded-full border border-white/16 bg-[rgba(255,255,255,0.06)] px-6 py-2 backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.4)]">
            <a href="#fitur" class="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Fitur
            </a>
            <a href="#workflow" class="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Cara Klaim
            </a>
            <a href="#pricing" class="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Harga
            </a>
            <a href="#faq" class="text-sm font-medium text-white/70 transition-colors hover:text-white">
              FAQ
            </a>
          </nav>

          {/* CTA Action */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="figma-liquid-button group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/16 px-5 py-2 text-sm font-medium text-white shadow-lg active:scale-95"
          >
            <div class="cta-btn-inner-glow absolute inset-0 rounded-full pointer-events-none"></div>
            <div class="cta-btn-border-base absolute inset-0 rounded-full pointer-events-none"></div>
            <div class="cta-btn-border-shine absolute inset-0 rounded-full pointer-events-none"></div>
            <span class="relative z-10 flex items-center gap-2">
              Order Rp 30k
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section class="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div class="container-wrap relative flex flex-col items-center text-center">
          {/* Top Badge */}
          <div class="figma-sparkle-badge inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="text-blue-400">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
            <span>Promo 18 Bulan Google One AI Premium • Slot Terbatas</span>
          </div>

          {/* Heading */}
          <h1 class="mt-8 text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl md:leading-[1.15]">
            Upgrade Akun Google ke <br />
            <span class="hero-accent-gradient">Gemini Pro 1.5</span> & <span class="gemini-accent-gradient">2TB Cloud</span>
          </h1>

          {/* Subtitle */}
          <p class="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            Akses resmi langsung ke email Google pribadimu tanpa perlu share password. Nikmati kapasitas 2 juta token context window, deep research, dan 2.000 GB Google Drive storage seumur masa aktif.
          </p>

          {/* CTA Buttons */}
          <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="figma-liquid-button group relative inline-flex min-w-[200px] items-center justify-center overflow-hidden rounded-full border border-white/20 px-8 py-3.5 text-base font-semibold text-white shadow-xl transition-transform active:scale-95"
            >
              <div class="cta-btn-inner-glow absolute inset-0 rounded-full pointer-events-none"></div>
              <div class="cta-btn-border-base absolute inset-0 rounded-full pointer-events-none"></div>
              <div class="cta-btn-border-shine absolute inset-0 rounded-full pointer-events-none"></div>
              <span class="relative z-10 flex items-center gap-2">
                Klaim Sekarang (Rp 30.000)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>

            <a
              href="#workflow"
              class="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/5 px-6 py-3.5 text-base font-medium text-white/90 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
            >
              Lihat Cara Kerja ↓
            </a>
          </div>

          {/* Trust Indicators */}
          <div class="mt-12 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-medium text-white/60">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
              100% Akun Pribadi Kamu
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-blue-400"></span>
              Tanpa Butuh Password
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-purple-400"></span>
              Link Aktivasi Resmi Google
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-cyan-400"></span>
              Garansi Redeem Sukses
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div class="relative mt-16 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/16 bg-[#0c0d12]/90 p-4 shadow-2xl backdrop-blur-2xl md:p-6">
            <div class="flex items-center justify-between border-b border-white/8 pb-4">
              <div class="flex items-center gap-2">
                <span class="h-3 w-3 rounded-full bg-rose-500/80"></span>
                <span class="h-3 w-3 rounded-full bg-amber-500/80"></span>
                <span class="h-3 w-3 rounded-full bg-emerald-500/80"></span>
                <span class="ml-3 text-xs text-white/50 font-mono">serviceactivation.google.com/redeem</span>
              </div>
              <span class="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                Resmi Google One AI
              </span>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div class="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <div class="text-xs text-white/50">Model AI Terpasang</div>
                <div class="mt-1 text-base font-bold text-white flex items-center gap-2">
                  Gemini 1.5 Pro
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-normal">2M Token</span>
                </div>
                <p class="mt-2 text-xs text-white/60 leading-relaxed">
                  Kemampuan multimodal terkuat untuk analisa teks panjang, video, audio, dan debugging kode.
                </p>
              </div>

              <div class="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <div class="text-xs text-white/50">Penyimpanan Cloud</div>
                <div class="mt-1 text-base font-bold text-white flex items-center gap-2">
                  2.000 GB (2TB)
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-normal">Google One</span>
                </div>
                <p class="mt-2 text-xs text-white/60 leading-relaxed">
                  Gabungan kapasitas lega untuk Google Drive, Google Photos kualitas penuh, dan Gmail.
                </p>
              </div>

              <div class="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <div class="text-xs text-white/50">Masa Berlaku</div>
                <div class="mt-1 text-base font-bold text-white flex items-center gap-2">
                  18 Bulan Penuh
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-normal">Hemat 99%</span>
                </div>
                <p class="mt-2 text-xs text-white/60 leading-relaxed">
                  Nilai langganan asli Rp 5,5 Juta. Cukup bayar Rp 30.000 satu kali di awal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="fitur" class="py-20 md:py-28">
        <div class="container-wrap">
          <div class="flex flex-col items-center text-center">
            <span class="figma-sparkle-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90">
              Eksklusif Fitur
            </span>
            <h2 class="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Kemampuan Kelas Dunia di Ujung Jari
            </h2>
            <p class="mt-4 max-w-xl text-base text-white/70">
              Semua keunggulan paket Google One AI Premium senilai Rp 309.000/bulan langsung aktif di akun Google kamu.
            </p>
          </div>

          <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: 2M Context Window */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#121318] p-8 md:col-span-2">
              <div class="navbar-glass-border-base absolute inset-0 pointer-events-none"></div>
              <div class="navbar-glass-border-all-corners absolute inset-0 pointer-events-none"></div>
              <div>
                <span class="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                  Massive Context
                </span>
                <h3 class="mt-4 text-2xl font-bold text-white">2 Juta Token Context Window</h3>
                <p class="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
                  Context window terbesar di dunia AI saat ini. Mampu memproses 1 jam video, 11 jam audio, codebase 30.000 baris, atau buku 700.000 kata sekaligus dalam 1 kali input prompt tanpa lupa konteks.
                </p>
              </div>
              <div class="mt-8 rounded-xl border border-white/6 bg-black/40 p-4 font-mono text-xs text-white/60">
                <span class="text-blue-400">~/gemini-pro</span> upload --context=2000000 --reasoning=ultra
                <br />
                <span class="text-emerald-400">✓ 1.420.000 tokens indexed in memory (zero latency drop)</span>
              </div>
            </div>

            {/* Card 2: 2TB Cloud */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#121318] p-8">
              <div class="navbar-glass-border-base absolute inset-0 pointer-events-none"></div>
              <div class="navbar-glass-border-all-corners absolute inset-0 pointer-events-none"></div>
              <div>
                <span class="rounded-lg bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20">
                  Penyimpanan
                </span>
                <h3 class="mt-4 text-2xl font-bold text-white">2TB Google One Storage</h3>
                <p class="mt-2 text-sm leading-relaxed text-white/70">
                  Kapasitas 2.000 GB untuk Google Photos, Drive, dan Gmail. Simpan video 4K dan backup seluruh device dengan leluasa.
                </p>
              </div>
              <div class="mt-8 flex items-end justify-between border-t border-white/8 pt-4">
                <div>
                  <div class="text-2xl font-bold text-white">2.048 GB</div>
                  <div class="text-xs text-white/50">Total Cloud Quota</div>
                </div>
                <span class="text-xs font-semibold text-purple-400">Google One Included</span>
              </div>
            </div>

            {/* Card 3: Deep Research */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#121318] p-8">
              <div class="navbar-glass-border-base absolute inset-0 pointer-events-none"></div>
              <div class="navbar-glass-border-all-corners absolute inset-0 pointer-events-none"></div>
              <div>
                <span class="rounded-lg bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                  Intelligence
                </span>
                <h3 class="mt-4 text-xl font-bold text-white">Gemini Advanced & Reasoning</h3>
                <p class="mt-2 text-sm leading-relaxed text-white/70">
                  Akses model tercanggih Google dengan kemampuan Deep Research, analisis data interaktif, dan eksekusi Python langsung.
                </p>
              </div>
              <div class="mt-6 text-xs text-white/50 border-t border-white/8 pt-3">
                Terbaik untuk tugas kuliah, coding, riset, dan analisis dokumen kompleks.
              </div>
            </div>

            {/* Card 4: Workspace Integration */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#121318] p-8">
              <div class="navbar-glass-border-base absolute inset-0 pointer-events-none"></div>
              <div class="navbar-glass-border-all-corners absolute inset-0 pointer-events-none"></div>
              <div>
                <span class="rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                  Integrasi
                </span>
                <h3 class="mt-4 text-xl font-bold text-white">AI di Google Workspace</h3>
                <p class="mt-2 text-sm leading-relaxed text-white/70">
                  Bantuan AI langsung di dalam Google Docs, Gmail, Sheets, dan Slides. Buat draft email, rangkum catatan, dan bikin slide otomatis.
                </p>
              </div>
              <div class="mt-6 text-xs text-white/50 border-t border-white/8 pt-3">
                Tersedia tombol 'Help me write' langsung di Gmail & Docs.
              </div>
            </div>

            {/* Card 5: Security / Privacy */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#121318] p-8">
              <div class="navbar-glass-border-base absolute inset-0 pointer-events-none"></div>
              <div class="navbar-glass-border-all-corners absolute inset-0 pointer-events-none"></div>
              <div>
                <span class="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  Privasi & Keamanan
                </span>
                <h3 class="mt-4 text-xl font-bold text-white">100% Akun Pribadi</h3>
                <p class="mt-2 text-sm leading-relaxed text-white/70">
                  Kami tidak pernah meminta password atau OTP akunmu. Yang kamu terima adalah tautan resmi aktivasi langsung dari Google.
                </p>
              </div>
              <div class="mt-6 text-xs text-white/50 border-t border-white/8 pt-3">
                Data pribadi dan riwayat chatmu tetap privat hanya milikmu.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Workflow Section */}
      <section id="workflow" class="py-20 md:py-28 bg-[#07080b]">
        <div class="container-wrap">
          <div class="flex flex-col items-center text-center">
            <span class="figma-sparkle-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90">
              Proses Aktivasi
            </span>
            <h2 class="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              4 Langkah Cepat & Praktis
            </h2>
            <p class="mt-4 max-w-xl text-base text-white/70">
              Tanpa ribet instalasi aplikasi tambahan. Hanya butuh browser dan akun Google kamu.
            </p>
          </div>

          <div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#121318] p-6 min-h-[220px]">
              <div class="relative z-10">
                <h3 class="text-lg font-bold text-white">1. Pesan & Bayar</h3>
                <p class="mt-2 text-sm leading-relaxed text-white/70">
                  Hubungi WhatsApp kami atau checkout via QRIS seharga Rp 30.000.
                </p>
              </div>
              <span class="step-number-gradient pointer-events-none absolute -right-2 -bottom-6 text-8xl font-black select-none">
                1
              </span>
            </div>

            {/* Step 2 */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#121318] p-6 min-h-[220px]">
              <div class="relative z-10">
                <h3 class="text-lg font-bold text-white">2. Terima Link</h3>
                <p class="mt-2 text-sm leading-relaxed text-white/70">
                  Admin kami akan langsung mengirim tautan redeem resmi dari serviceactivation.google.com.
                </p>
              </div>
              <span class="step-number-gradient pointer-events-none absolute -right-2 -bottom-6 text-8xl font-black select-none">
                2
              </span>
            </div>

            {/* Step 3 */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#121318] p-6 min-h-[220px]">
              <div class="relative z-10">
                <h3 class="text-lg font-bold text-white">3. Buka & Redeem</h3>
                <p class="mt-2 text-sm leading-relaxed text-white/70">
                  Buka link di browser yang sudah login dengan akun Google pribadimu, lalu klik tombol 'Aktifkan'.
                </p>
              </div>
              <span class="step-number-gradient pointer-events-none absolute -right-2 -bottom-6 text-8xl font-black select-none">
                3
              </span>
            </div>

            {/* Step 4 */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#121318] p-6 min-h-[220px]">
              <div class="relative z-10">
                <h3 class="text-lg font-bold text-white">4. Siap Digunakan</h3>
                <p class="mt-2 text-sm leading-relaxed text-white/70">
                  Gemini Advanced dan kuota 2TB Google One langsung aktif dan siap menemani produktivitasmu!
                </p>
              </div>
              <span class="step-number-gradient pointer-events-none absolute -right-2 -bottom-6 text-8xl font-black select-none">
                4
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Offer Hero Box */}
      <section id="pricing" class="py-20 md:py-28">
        <div class="container-wrap">
          <div class="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/16 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 md:p-12 shadow-2xl backdrop-blur-2xl relative">
            <div class="navbar-glass-border-base absolute inset-0 pointer-events-none"></div>
            <div class="navbar-glass-border-shine absolute inset-0 pointer-events-none"></div>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/12 pb-8">
              <div>
                <span class="inline-block rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
                  BEST VALUE • PENAWARAN KHUSUS
                </span>
                <h3 class="mt-3 text-3xl font-extrabold text-white">Google One AI Premium</h3>
                <p class="mt-1 text-sm text-white/70">Akses 18 Bulan Gemini Advanced + 2TB Storage</p>
              </div>

              <div class="text-left md:text-right">
                <div class="text-xs text-white/50 line-through">Harga Normal: Rp 5.562.000</div>
                <div class="mt-1 flex items-baseline gap-2 md:justify-end">
                  <span class="text-4xl md:text-5xl font-extrabold text-white">Rp 30.000</span>
                  <span class="text-xs text-white/60">/ sekali bayar</span>
                </div>
                <div class="mt-1 text-xs text-emerald-400 font-medium">Hemat 99% — Tanpa Tagihan Bulanan</div>
              </div>
            </div>

            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white/80">
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Akses Model Gemini 1.5 Pro & Deep Research</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>2 Terabyte (2.000 GB) Google Drive & Photos</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>2 Juta Token Context Window</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Integrasi AI di Docs, Gmail, Sheets</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Aktivasi ke Akun Google Pribadi</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Garansi Link Valid & Berhasil Redeem</span>
              </div>
            </div>

            <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="figma-liquid-button group relative flex w-full sm:w-auto flex-1 items-center justify-center overflow-hidden rounded-full border border-white/20 py-4 text-base font-bold text-white shadow-xl transition-transform active:scale-95"
              >
                <div class="cta-btn-inner-glow absolute inset-0 rounded-full pointer-events-none"></div>
                <div class="cta-btn-border-base absolute inset-0 rounded-full pointer-events-none"></div>
                <div class="cta-btn-border-shine absolute inset-0 rounded-full pointer-events-none"></div>
                <span class="relative z-10 flex items-center justify-center gap-2">
                  Beli Sekarang via WhatsApp (Rp 30k)
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </a>

              <button
                onClick$={copyTemplate}
                class="w-full sm:w-auto rounded-full border border-white/16 bg-white/5 px-6 py-4 text-sm font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                {isCopied.value ? "✓ Format Tersalin!" : "Salin Format Chat"}
              </button>
            </div>

            <div class="mt-4 text-center text-xs text-white/50">
              Pembayaran instan via QRIS, GoPay, OVO, Dana, ShopeePay, dan Transfer Bank.
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" class="py-20 md:py-28 bg-[#07080b]">
        <div class="container-wrap max-w-4xl">
          <div class="flex flex-col items-center text-center">
            <span class="figma-sparkle-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90">
              Pertanyaan Umum
            </span>
            <h2 class="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p class="mt-4 text-base text-white/70">
              Semua hal yang perlu kamu ketahui sebelum memesan.
            </p>
          </div>

          <div class="mt-12 space-y-4">
            {[
              {
                q: "Apakah aman untuk akun Google utama saya?",
                a: "Sangat aman. Kami sama sekali tidak pernah meminta password atau data login akun kamu. Kamu hanya akan menerima tautan resmi aktivasi langsung dari Google (serviceactivation.google.com), dan kamu sendiri yang mengkliknya saat sudah login di browser.",
              },
              {
                q: "Bagaimana jika akun Google saya sudah punya langganan Google One?",
                a: "Tautan aktivasi ini berlaku optimal untuk akun Google yang saat ini tidak memiliki langganan Google One berbayar yang sedang aktif. Jika akunmu masih memiliki langganan aktif, disarankan menunggu hingga periode langganan tersebut habis atau gunakan akun Google baru/cadangan.",
              },
              {
                q: "Berapa lama proses pengiriman link setelah transfer?",
                a: "Pengiriman link dilakukan secara instan dalam 1–5 menit setelah bukti transfer atau pembayaran QRIS berhasil kami terima.",
              },
              {
                q: "Apa saja yang didapatkan dengan harga Rp 30.000?",
                a: "Kamu mendapatkan akses penuh ke paket Google One AI Premium selama masa aktif promo (hingga 18 bulan): akses model Gemini 1.5 Pro (Gemini Advanced), 2TB penyimpanan cloud Google One, dan integrasi AI di Gmail serta Google Docs.",
              },
              {
                q: "Bagaimana dengan garansi?",
                a: "Kami memberikan garansi aktivasi sukses. Jika tautan yang kamu terima tidak dapat diaktifkan saat proses redeem pertama kali, kami akan berikan tautan pengganti atau refund 100% uang kamu.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                class="overflow-hidden rounded-2xl border border-white/8 bg-[#121318] transition-all"
              >
                <button
                  onClick$={() => toggleFaq(idx)}
                  class="flex w-full items-center justify-between p-6 text-left font-semibold text-white transition-colors hover:text-blue-400"
                >
                  <span class="text-base md:text-lg">{faq.q}</span>
                  <span class="ml-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/12 text-sm text-white/60">
                    {activeFaq.value === idx ? "−" : "+"}
                  </span>
                </button>
                {activeFaq.value === idx && (
                  <div class="border-t border-white/6 px-6 pt-2 pb-6 text-sm leading-relaxed text-white/70">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="relative overflow-hidden border-t border-white/12 bg-black pt-16 pb-12">
        <div class="container-wrap">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold tracking-tight text-white">
                Gemini<span class="hero-accent-gradient ml-1">Pro</span>
              </span>
              <span class="text-xs text-white/40">| Akses Google One AI Premium</span>
            </div>

            <div class="flex items-center gap-6 text-xs text-white/60">
              <a href="#fitur" class="hover:text-white transition-colors">
                Fitur
              </a>
              <a href="#workflow" class="hover:text-white transition-colors">
                Cara Klaim
              </a>
              <a href="#pricing" class="hover:text-white transition-colors">
                Harga
              </a>
              <a href="#faq" class="hover:text-white transition-colors">
                FAQ
              </a>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">
                WhatsApp Support
              </a>
            </div>

            <p class="text-xs text-white/40">
              © 2026 GeminiPro. All rights reserved.
            </p>
          </div>

          {/* Big Typography Watermark ala Sokudo */}
          <div
            aria-hidden="true"
            class="footer-text-gradient pointer-events-none mt-12 text-center text-[80px] font-black tracking-tighter select-none sm:text-[140px] md:text-[200px] leading-none"
          >
            GEMINI
          </div>
        </div>
      </footer>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Google Gemini Pro 18 Bulan + 2TB Google One — Akses Resmi 30K",
  meta: [
    {
      name: "description",
      content:
        "Dapatkan akses Google Gemini Advanced Pro 18 Bulan dan Google One 2TB Cloud Storage resmi ke akun Google pribadi kamu hanya Rp 30.000. Aktivasi instan via link redeem resmi.",
    },
    {
      property: "og:title",
      content: "Google Gemini Pro 18 Bulan + 2TB Google One — Akses Resmi 30K",
    },
    {
      property: "og:description",
      content:
        "Upgrade akun Google pribadimu ke Gemini Advanced 1.5 Pro dan 2TB Storage Google One seharga Rp 30.000 sekali bayar.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
};
