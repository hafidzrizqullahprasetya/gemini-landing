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
    "Halo Octane, saya mau order tautan aktivasi Google Gemini Pro 18 Bulan (Rp 30.000). Mohon instruksi pembayaran QRIS / transfer ya."
  );
  const waUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  const copyTemplate = $(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("Halo Octane, saya mau order tautan aktivasi Google Gemini Pro 18 Bulan (Rp 30.000).");
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2500);
    }
  });

  return (
    <div class="relative min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white antialiased">
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        class="pointer-events-none fixed top-0 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,145,255,0.14),rgba(66,133,244,0.06),transparent_70%)] blur-3xl"
      ></div>

      {/* Floating Navbar */}
      <header class="sticky top-0 z-50 w-full pt-4 transition-all">
        <div class="container-wrap flex items-center justify-between">
          {/* Brand */}
          <a
            href="/"
            class="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-lg p-1"
          >
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
            <div class="flex items-baseline gap-1.5">
              <span class="text-lg font-bold tracking-tight text-white">Octane</span>
              <span class="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Gemini Pro
              </span>
            </div>
          </a>

          {/* Nav Links (Desktop) */}
          <nav class="hidden md:flex items-center gap-6 rounded-full border border-white/16 bg-[rgba(255,255,255,0.06)] px-6 py-2 backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.4)]">
            <a
              href="#fitur"
              class="text-sm font-medium text-neutral-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1"
            >
              Fitur
            </a>
            <a
              href="#cara-kerja"
              class="text-sm font-medium text-neutral-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1"
            >
              Cara Kerja
            </a>
            <a
              href="#harga"
              class="text-sm font-medium text-neutral-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1"
            >
              Harga
            </a>
            <a
              href="#faq"
              class="text-sm font-medium text-neutral-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1"
            >
              FAQ
            </a>
          </nav>

          {/* CTA Action */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="figma-liquid-button group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/16 px-5 py-2 text-sm font-medium text-white shadow-lg active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <div class="cta-btn-inner-glow absolute inset-0 rounded-full pointer-events-none"></div>
            <div class="cta-btn-border-base absolute inset-0 rounded-full pointer-events-none"></div>
            <div class="cta-btn-border-shine absolute inset-0 rounded-full pointer-events-none"></div>
            <span class="relative z-10 flex items-center gap-2">
              Pesan Rp 30k
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
          {/* Main Heading */}
          <h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl md:leading-[1.15] max-w-4xl">
            Upgrade Akun Google ke <br />
            <span class="hero-accent-gradient">Gemini Pro 1.5</span> & <span class="gemini-accent-gradient">2TB Cloud Storage</span>
          </h1>

          {/* Subtitle */}
          <p class="mt-6 max-w-2xl text-base leading-relaxed text-neutral-300 md:text-lg">
            Aktivasi paket Google One AI Premium langsung ke akun Google pribadimu. Nikmati kapasitas 2 juta token context window, deep research, dan penyimpanan 2.000 GB tanpa biaya langganan bulanan.
          </p>

          {/* CTA Buttons */}
          <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="figma-liquid-button group relative inline-flex min-w-[220px] items-center justify-center overflow-hidden rounded-full border border-white/20 px-8 py-3.5 text-base font-semibold text-white shadow-xl transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <div class="cta-btn-inner-glow absolute inset-0 rounded-full pointer-events-none"></div>
              <div class="cta-btn-border-base absolute inset-0 rounded-full pointer-events-none"></div>
              <div class="cta-btn-border-shine absolute inset-0 rounded-full pointer-events-none"></div>
              <span class="relative z-10 flex items-center gap-2">
                Pesan Sekarang (Rp 30.000)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>

            <a
              href="#cara-kerja"
              class="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/5 px-6 py-3.5 text-base font-medium text-neutral-200 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              Pelajari Cara Kerja
            </a>
          </div>

          {/* Trust Matrix */}
          <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full text-xs font-medium text-neutral-300 border-t border-white/10 pt-6">
            <div class="flex items-center justify-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
              100% Akun Google Pribadi
            </div>
            <div class="flex items-center justify-center gap-2">
              <span class="h-2 w-2 rounded-full bg-blue-400"></span>
              Tanpa Berbagi Password
            </div>
            <div class="flex items-center justify-center gap-2">
              <span class="h-2 w-2 rounded-full bg-purple-400"></span>
              Tautan Resmi Google
            </div>
            <div class="flex items-center justify-center gap-2">
              <span class="h-2 w-2 rounded-full bg-cyan-400"></span>
              Garansi Redeem Sukses
            </div>
          </div>

          {/* Concrete Spec Preview Card */}
          <div class="relative mt-14 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/12 bg-[#0c0d12] p-5 shadow-2xl md:p-6 text-left">
            <div class="flex items-center justify-between border-b border-white/8 pb-4">
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-neutral-600"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-neutral-600"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-neutral-600"></span>
                <span class="ml-2 text-xs text-neutral-400 font-mono">serviceactivation.google.com/redeem</span>
              </div>
              <span class="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Paket AI Premium Aktif
              </span>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div class="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <div class="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Model Utama</div>
                <div class="mt-1 text-base font-bold text-white flex items-center gap-2">
                  Gemini 1.5 Pro
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-normal">2M Token</span>
                </div>
                <p class="mt-2 text-xs text-neutral-300 leading-relaxed">
                  Pemrosesan dokumen panjang, analisa dataset komprehensif, dan eksekusi kode terintegrasi.
                </p>
              </div>

              <div class="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <div class="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Kapasitas Cloud</div>
                <div class="mt-1 text-base font-bold text-white flex items-center gap-2">
                  2.000 GB (2TB)
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-normal">Google One</span>
                </div>
                <p class="mt-2 text-xs text-neutral-300 leading-relaxed">
                  Ruang penyimpanan bersama untuk Google Drive, cadangan Google Photos kualitas asli, dan Gmail.
                </p>
              </div>

              <div class="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <div class="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Masa Berlaku</div>
                <div class="mt-1 text-base font-bold text-white flex items-center gap-2">
                  18 Bulan Penuh
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-normal">Sekali Bayar</span>
                </div>
                <p class="mt-2 text-xs text-neutral-300 leading-relaxed">
                  Nilai langganan normal setara Rp 5,5 juta per 18 bulan, dapat diakses hanya dengan Rp 30.000.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Specs Section */}
      <section id="fitur" class="py-20 md:py-24 border-t border-white/8 bg-[#050608]">
        <div class="container-wrap">
          <div class="max-w-2xl text-left">
            <h2 class="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Rincian Kapasitas & Fitur Layanan
            </h2>
            <p class="mt-3 text-base text-neutral-300">
              Setiap aktivasi mencakup seluruh spesifikasi resmi Google One AI Premium Plan tanpa penurunan batas pemakaian.
            </p>
          </div>

          <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: 2M Context Window */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0e0f14] p-7 md:col-span-2">
              <div>
                <span class="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                  Kapasitas Konteks
                </span>
                <h3 class="mt-4 text-2xl font-bold text-white">2.000.000 Token Context Window</h3>
                <p class="mt-2 max-w-xl text-sm leading-relaxed text-neutral-300">
                  Batas input terbesar yang tersedia saat ini. Anda dapat memasukkan materi skala besar dalam satu instruksi tanpa kehilangan referensi data sebelumnya.
                </p>

                <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="rounded-xl border border-white/6 bg-black/50 p-3">
                    <div class="text-lg font-bold text-white">1.500+ Halaman</div>
                    <div class="text-xs text-neutral-400 mt-1">Dokumentasi teknis & buku PDF</div>
                  </div>
                  <div class="rounded-xl border border-white/6 bg-black/50 p-3">
                    <div class="text-lg font-bold text-white">30.000+ Baris</div>
                    <div class="text-xs text-neutral-400 mt-1">Codebase proyek dalam 1 prompt</div>
                  </div>
                  <div class="rounded-xl border border-white/6 bg-black/50 p-3">
                    <div class="text-lg font-bold text-white">1 Jam Video</div>
                    <div class="text-xs text-neutral-400 mt-1">Analisa rekaman materi visual</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: 2TB Cloud */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0e0f14] p-7">
              <div>
                <span class="rounded-lg bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20">
                  Cloud Storage
                </span>
                <h3 class="mt-4 text-2xl font-bold text-white">2TB Google One</h3>
                <p class="mt-2 text-sm leading-relaxed text-neutral-300">
                  Penyimpanan 2.048 GB yang langsung terhubung ke email Anda. Mengamankan file kerja, video beresolusi tinggi, dan arsip dokumen.
                </p>
              </div>
              <div class="mt-8 border-t border-white/8 pt-4">
                <div class="text-2xl font-bold text-white">2.048 GB</div>
                <div class="text-xs text-neutral-400">Kuota Resmi Google Drive & Photos</div>
              </div>
            </div>

            {/* Card 3: Deep Research */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0e0f14] p-7">
              <div>
                <span class="rounded-lg bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                  Penalaran & Riset
                </span>
                <h3 class="mt-4 text-xl font-bold text-white">Analisis Multimodal & Riset</h3>
                <p class="mt-2 text-sm leading-relaxed text-neutral-300">
                  Kemampuan penalaran mendalam untuk memecahkan problem logika rumit, evaluasi data, serta penulisan sintesis akademis dan teknis.
                </p>
              </div>
              <div class="mt-6 text-xs text-neutral-400 border-t border-white/8 pt-3">
                Didukung eksekusi kode Python bawaan di dalam antarmuka Gemini.
              </div>
            </div>

            {/* Card 4: Workspace Integration */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0e0f14] p-7">
              <div>
                <span class="rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                  Workspace
                </span>
                <h3 class="mt-4 text-xl font-bold text-white">Integrasi Docs & Gmail</h3>
                <p class="mt-2 text-sm leading-relaxed text-neutral-300">
                  Asisten penulisan langsung di Google Docs, Gmail, Sheets, dan Slides untuk merangkum percakapan, menyusun naskah, dan menganalisis tabel.
                </p>
              </div>
              <div class="mt-6 text-xs text-neutral-400 border-t border-white/8 pt-3">
                Tombol bantuan penulisan muncul otomatis di akun Anda.
              </div>
            </div>

            {/* Card 5: Security / Privacy */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0e0f14] p-7">
              <div>
                <span class="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  Keamanan Akun
                </span>
                <h3 class="mt-4 text-xl font-bold text-white">Privasi Akun Terlindungi</h3>
                <p class="mt-2 text-sm leading-relaxed text-neutral-300">
                  Kami tidak memiliki akses ke akun Anda. Aktivasi dilakukan sepenuhnya oleh Anda sendiri melalui URL resmi Google.
                </p>
              </div>
              <div class="mt-6 text-xs text-neutral-400 border-t border-white/8 pt-3">
                Riwayat pesan, file drive, dan identitas tetap terlindungi.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="cara-kerja" class="py-20 md:py-24 border-t border-white/8 bg-black">
        <div class="container-wrap">
          <div class="max-w-2xl text-left">
            <h2 class="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Prosedur Aktivasi
            </h2>
            <p class="mt-3 text-base text-neutral-300">
              Empat tahapan terstruktur mulai dari pemesanan hingga layanan aktif di akun Anda.
            </p>
          </div>

          <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0e0f14] p-6 min-h-[220px]">
              <div class="relative z-10">
                <div class="text-xs font-mono font-semibold text-blue-400">TAHAP 01</div>
                <h3 class="mt-2 text-lg font-bold text-white">Konfirmasi & Pembayaran</h3>
                <p class="mt-2 text-sm leading-relaxed text-neutral-300">
                  Kirim format pemesanan via WhatsApp dan lakukan pembayaran Rp 30.000 via QRIS atau transfer.
                </p>
              </div>
              <span class="step-number-gradient pointer-events-none absolute -right-2 -bottom-6 text-8xl font-black select-none">
                1
              </span>
            </div>

            {/* Step 2 */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0e0f14] p-6 min-h-[220px]">
              <div class="relative z-10">
                <div class="text-xs font-mono font-semibold text-blue-400">TAHAP 02</div>
                <h3 class="mt-2 text-lg font-bold text-white">Penerimaan Tautan</h3>
                <p class="mt-2 text-sm leading-relaxed text-neutral-300">
                  Admin mengirimkan tautan redeem resmi dari domain serviceactivation.google.com.
                </p>
              </div>
              <span class="step-number-gradient pointer-events-none absolute -right-2 -bottom-6 text-8xl font-black select-none">
                2
              </span>
            </div>

            {/* Step 3 */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0e0f14] p-6 min-h-[220px]">
              <div class="relative z-10">
                <div class="text-xs font-mono font-semibold text-blue-400">TAHAP 03</div>
                <h3 class="mt-2 text-lg font-bold text-white">Klaim ke Akun Anda</h3>
                <p class="mt-2 text-sm leading-relaxed text-neutral-300">
                  Buka tautan pada peramban yang sudah login dengan akun Google Anda, lalu tekan tombol konfirmasi aktivasi.
                </p>
              </div>
              <span class="step-number-gradient pointer-events-none absolute -right-2 -bottom-6 text-8xl font-black select-none">
                3
              </span>
            </div>

            {/* Step 4 */}
            <div class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0e0f14] p-6 min-h-[220px]">
              <div class="relative z-10">
                <div class="text-xs font-mono font-semibold text-blue-400">TAHAP 04</div>
                <h3 class="mt-2 text-lg font-bold text-white">Layanan Siap Digunakan</h3>
                <p class="mt-2 text-sm leading-relaxed text-neutral-300">
                  Status akun langsung terdaftar pada paket Google One AI Premium dengan kapasitas 2TB aktif seketika.
                </p>
              </div>
              <span class="step-number-gradient pointer-events-none absolute -right-2 -bottom-6 text-8xl font-black select-none">
                4
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Offer Card */}
      <section id="harga" class="py-20 md:py-24 border-t border-white/8 bg-[#050608]">
        <div class="container-wrap">
          <div class="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/16 bg-gradient-to-b from-[#14161f] to-[#0c0d12] p-8 md:p-12 shadow-2xl relative">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/12 pb-8">
              <div>
                <span class="inline-block rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
                  Penawaran Tunggal
                </span>
                <h3 class="mt-3 text-3xl font-extrabold text-white">Google One AI Premium</h3>
                <p class="mt-1 text-sm text-neutral-300">Akses 18 Bulan Gemini Advanced & 2TB Storage</p>
              </div>

              <div class="text-left md:text-right">
                <div class="text-xs text-neutral-400 line-through">Harga Resmi: Rp 5.562.000</div>
                <div class="mt-1 flex items-baseline gap-2 md:justify-end">
                  <span class="text-4xl md:text-5xl font-extrabold text-white">Rp 30.000</span>
                  <span class="text-xs text-neutral-400">(sekali bayar)</span>
                </div>
                <div class="mt-1 text-xs text-emerald-400 font-medium">Hemat 99%, tanpa perpanjangan berkala</div>
              </div>
            </div>

            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-200">
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400 shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Akses Model Gemini 1.5 Pro & Deep Research</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400 shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>2 Terabyte (2.000 GB) Google Drive & Photos</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400 shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>2 Juta Token Context Window</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400 shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Integrasi AI di Docs, Gmail, dan Sheets</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400 shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Aktivasi ke Akun Google Pribadi</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400 shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Garansi Tautan Valid & Sukses Aktivasi</span>
              </div>
            </div>

            <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="figma-liquid-button group relative flex w-full sm:w-auto flex-1 items-center justify-center overflow-hidden rounded-full border border-white/20 py-4 text-base font-bold text-white shadow-xl transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <div class="cta-btn-inner-glow absolute inset-0 rounded-full pointer-events-none"></div>
                <div class="cta-btn-border-base absolute inset-0 rounded-full pointer-events-none"></div>
                <div class="cta-btn-border-shine absolute inset-0 rounded-full pointer-events-none"></div>
                <span class="relative z-10 flex items-center justify-center gap-2">
                  Pesan via WhatsApp (Rp 30.000)
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </a>

              <button
                onClick$={copyTemplate}
                class="w-full sm:w-auto rounded-full border border-white/16 bg-white/5 px-6 py-4 text-sm font-semibold text-neutral-200 transition-all hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                {isCopied.value ? "Format Tersalin ke Clipboard" : "Salin Format Chat"}
              </button>
            </div>

            <div class="mt-5 text-center text-xs text-neutral-400">
              Mendukung pembayaran via QRIS, GoPay, OVO, Dana, ShopeePay, dan transfer bank lokal.
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" class="py-20 md:py-24 border-t border-white/8 bg-black">
        <div class="container-wrap max-w-4xl">
          <div class="text-left">
            <h2 class="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p class="mt-3 text-base text-neutral-300">
              Penjelasan mengenai teknis aktivasi, kompatibilitas akun, dan ketentuan layanan.
            </p>
          </div>

          <div class="mt-12 space-y-4">
            {[
              {
                q: "Apakah aman untuk akun Google utama saya?",
                a: "Aman. Kami hanya memberikan tautan aktivasi resmi dari domain serviceactivation.google.com. Kami tidak pernah meminta kata sandi atau data autentikasi akun Anda. Proses klaim sepenuhnya dilakukan di peramban Anda sendiri.",
              },
              {
                q: "Bagaimana jika akun Google saya sudah memiliki langganan Google One yang sedang aktif?",
                a: "Tautan promo ini berlaku untuk akun yang tidak sedang terikat paket Google One berbayar aktif. Apabila akun Anda saat ini memiliki langganan, disarankan menunggu hingga masa berbayar selesai atau mengklaimnya pada akun Google cadangan.",
              },
              {
                q: "Berapa lama estimasi pengiriman tautan setelah pembayaran diverifikasi?",
                a: "Tautan aktivasi diproses dan dikirimkan dalam kurun waktu 1 hingga 5 menit setelah bukti transfer atau konfirmasi QRIS kami terima.",
              },
              {
                q: "Apa saja hak akses yang diperoleh dengan biaya Rp 30.000?",
                a: "Anda memperoleh hak akses penuh ke paket Google One AI Premium: model penalaran Gemini 1.5 Pro, kapasitas cloud storage 2TB untuk Drive dan Photos, serta asisten penulisan AI di Docs dan Gmail.",
              },
              {
                q: "Bagaimana mekanisme garansi apabila tautan gagal diaktifkan?",
                a: "Kami memberikan garansi aktivasi awal. Jika tautan mengalami kegagalan saat pertama kali diklaim, kami menyediakan tautan pengganti baru atau pengembalian dana 100% tanpa potongan.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                class="overflow-hidden rounded-2xl border border-white/8 bg-[#0e0f14] transition-all"
              >
                <button
                  onClick$={() => toggleFaq(idx)}
                  class="flex w-full items-center justify-between p-6 text-left font-semibold text-white transition-colors hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  <span class="text-base md:text-lg">{faq.q}</span>
                  <span class="ml-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/12 text-sm text-neutral-400">
                    {activeFaq.value === idx ? "−" : "+"}
                  </span>
                </button>
                {activeFaq.value === idx && (
                  <div class="border-t border-white/6 px-6 pt-2 pb-6 text-sm leading-relaxed text-neutral-300">
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
              <span class="text-xl font-bold tracking-tight text-white">Octane</span>
              <span class="text-xs text-neutral-400">| Layanan Google One AI Premium</span>
            </div>

            <div class="flex items-center gap-6 text-xs text-neutral-300">
              <a href="#fitur" class="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded">
                Fitur
              </a>
              <a href="#cara-kerja" class="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded">
                Cara Kerja
              </a>
              <a href="#harga" class="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded">
                Harga
              </a>
              <a href="#faq" class="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded">
                FAQ
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded"
              >
                Bantuan WhatsApp
              </a>
            </div>

            <p class="text-xs text-neutral-400">
              © 2026 Octane AI (octane.web.id). Seluruh hak cipta dilindungi.
            </p>
          </div>

          {/* Big Typography Watermark ala Sokudo */}
          <div
            aria-hidden="true"
            class="footer-text-gradient pointer-events-none mt-12 text-center text-[80px] font-black tracking-tighter select-none sm:text-[140px] md:text-[200px] leading-none"
          >
            OCTANE
          </div>
        </div>
      </footer>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Google Gemini Pro 18 Bulan + 2TB Storage | Octane",
  meta: [
    {
      name: "description",
      content:
        "Dapatkan akses Google Gemini Advanced Pro 18 Bulan dan Google One 2TB Cloud Storage resmi ke akun Google pribadi Anda hanya Rp 30.000. Aktivasi instan via tautan resmi.",
    },
    {
      property: "og:title",
      content: "Google Gemini Pro 18 Bulan + 2TB Storage | Octane",
    },
    {
      property: "og:description",
      content:
        "Upgrade akun Google pribadi ke Gemini Advanced 1.5 Pro dan 2TB Storage Google One seharga Rp 30.000 sekali bayar.",
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
