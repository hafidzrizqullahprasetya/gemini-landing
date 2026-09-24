import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const emailSignal = useSignal("");
  const whatsappSignal = useSignal("");
  const paymentMethod = useSignal<"qris" | "bni">("qris");
  const copiedField = useSignal<string | null>(null);
  const activeFaq = useSignal<number | null>(null);

  const bniAccount = "1880243465";
  const bniHolder = "Hafidz Rizqullah Prasetya";
  const priceAmount = "30000";
  const formattedPrice = "Rp 30.000";

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

  const getWaLink = () => {
    const email = emailSignal.value.trim() || "(Belum diisi)";
    const wa = whatsappSignal.value.trim() || "(Belum diisi)";
    const method = paymentMethod.value === "qris" ? "QRIS" : "Transfer BNI";
    const text = `Halo Octane, saya sudah menyelesaikan pembayaran ${formattedPrice} untuk Google One AI Premium 18 Bulan.\n\nDetail Pesanan:\n- Email Google: ${email}\n- No. WhatsApp: ${wa}\n- Metode: ${method}\n\nMohon dikirimkan tautan aktivasinya ya. Terima kasih!`;
    return `https://wa.me/6281325081046?text=${encodeURIComponent(text)}`;
  };

  return (
    <div class="relative min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white antialiased font-sans">
      {/* Background Soft Glow */}
      <div
        aria-hidden="true"
        class="pointer-events-none fixed top-0 left-1/2 -z-10 h-[480px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,145,255,0.12),transparent_70%)] blur-3xl"
      ></div>

      {/* Top Header */}
      <header class="sticky top-0 z-50 w-full border-b border-white/8 bg-black/70 backdrop-blur-xl">
        <div class="container-wrap flex items-center justify-between py-3.5">
          <div class="flex items-center gap-2.5">
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
              <span class="text-[11px] font-medium text-neutral-400">Checkout</span>
            </div>
          </div>

          <div class="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Promo 18 Bulan Aktif</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main class="container-wrap py-6 md:py-10">
        <div class="mx-auto max-w-4xl">
          {/* Page Lead */}
          <div class="mb-6 text-left">
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Beli Tautan Aktivasi Google One AI Premium
            </h1>
            <p class="mt-1 text-sm text-neutral-300">
              Aktivasi instan ke akun Google pribadi Anda tanpa registrasi akun atau login kata sandi.
            </p>
          </div>

          {/* Checkout Card Grid */}
          <div class="overflow-hidden rounded-2xl border border-white/12 bg-[#0d0e13] shadow-2xl">
            <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/8">
              
              {/* Left Column: Product Summary & Account Form (7 cols) */}
              <div class="p-6 md:p-8 lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Badge & Title */}
                  <div class="flex items-center justify-between">
                    <span class="rounded bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                      Paket 18 Bulan
                    </span>
                    <span class="text-xs text-neutral-400">
                      Garansi Sukses 100%
                    </span>
                  </div>

                  <h2 class="mt-3 text-xl sm:text-2xl font-bold text-white">
                    Gemini 1.5 Pro & 2TB Cloud Storage
                  </h2>

                  {/* Pricing Comparison */}
                  <div class="mt-4 flex items-baseline gap-3 rounded-xl border border-white/6 bg-white/[0.02] p-3.5">
                    <div>
                      <div class="text-[11px] text-neutral-400 line-through">
                        Harga Resmi: Rp 5.562.000
                      </div>
                      <div class="text-3xl font-extrabold text-white">
                        {formattedPrice}
                      </div>
                    </div>
                    <div class="ml-auto text-right">
                      <span class="inline-block rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        Hemat 99%
                      </span>
                      <div class="text-[11px] text-neutral-400 mt-1">Sekali bayar</div>
                    </div>
                  </div>

                  {/* Bullet Specs */}
                  <div class="mt-5 space-y-2.5 text-xs text-neutral-200">
                    <div class="flex items-start gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400 shrink-0 mt-0.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>Model penalaran Gemini 1.5 Pro dengan kapasitas 2 Juta Token.</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400 shrink-0 mt-0.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>Penyimpanan 2.000 GB (2TB) untuk Google Drive, Photos, dan Gmail.</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-400 shrink-0 mt-0.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>Aktivasi mandiri via serviceactivation.google.com tanpa kata sandi.</span>
                    </div>
                  </div>

                  {/* 2-Field Form (No Login Required) */}
                  <div class="mt-6 border-t border-white/8 pt-5">
                    <div class="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                      Langkah 1: Masukkan Data Penerima Tautan
                    </div>

                    <div class="space-y-3.5">
                      <div>
                        <label class="block text-xs font-medium text-neutral-300 mb-1">
                          Email Google yang Mau Di-upgrade <span class="text-blue-400">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="contoh: namaanda@gmail.com"
                          value={emailSignal.value}
                          onInput$={(e) => (emailSignal.value = (e.target as HTMLInputElement).value)}
                          class="w-full rounded-xl border border-white/12 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p class="mt-1 text-[11px] text-neutral-400">
                          Hanya untuk verifikasi penerima tautan aktivasi resmi.
                        </p>
                      </div>

                      <div>
                        <label class="block text-xs font-medium text-neutral-300 mb-1">
                          Nomor WhatsApp Penerima <span class="text-blue-400">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="contoh: 081234567890"
                          value={whatsappSignal.value}
                          onInput$={(e) => (whatsappSignal.value = (e.target as HTMLInputElement).value)}
                          class="w-full rounded-xl border border-white/12 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p class="mt-1 text-[11px] text-neutral-400">
                          Tautan aktivasi dan instruksi klaim dikirimkan ke nomor ini.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 border-t border-white/8 pt-4 flex items-center justify-between text-xs text-neutral-400">
                  <span>Tanpa Biaya Admin</span>
                  <span>Proses 1 sampai 5 Menit</span>
                </div>
              </div>

              {/* Right Column: Instant Payment & Direct QR (5 cols) */}
              <div class="p-6 md:p-8 lg:col-span-5 bg-[#090a0e] flex flex-col justify-between">
                <div>
                  <div class="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                    Langkah 2: Pilih Metode Pembayaran
                  </div>

                  {/* Payment Tabs */}
                  <div class="grid grid-cols-2 gap-2 rounded-xl bg-black/60 p-1 border border-white/8">
                    <button
                      type="button"
                      onClick$={() => (paymentMethod.value = "qris")}
                      class={`rounded-lg py-2 text-xs font-semibold transition-all ${
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
                      class={`rounded-lg py-2 text-xs font-semibold transition-all ${
                        paymentMethod.value === "bni"
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Transfer BNI
                    </button>
                  </div>

                  {/* QRIS View */}
                  {paymentMethod.value === "qris" && (
                    <div class="mt-4 flex flex-col items-center text-center">
                      <div class="relative rounded-2xl bg-white p-3 shadow-xl">
                        <img
                          src="/qris-code.svg"
                          alt="QRIS Pembayaran Google One 30 Ribu"
                          width="210"
                          height="210"
                          class="block rounded-lg"
                        />
                      </div>

                      <div class="mt-3 text-xs font-bold text-white tracking-wide">
                        Nominal Pas: {formattedPrice}
                      </div>
                      <p class="mt-1 text-[11px] leading-tight text-neutral-400 max-w-[220px]">
                        Scan via BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, atau ShopeePay.
                      </p>

                      <div class="mt-3 flex items-center gap-2">
                        <a
                          href="/qris-code.svg"
                          download="QRIS-Octane-Gemini-30k.svg"
                          class="rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          Unduh QR
                        </a>
                        <button
                          type="button"
                          onClick$={() => copyToClipboard(priceAmount, "nominal")}
                          class="rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {copiedField.value === "nominal" ? "Nominal Tersalin" : "Salin Nominal"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* BNI Transfer View */}
                  {paymentMethod.value === "bni" && (
                    <div class="mt-4 rounded-xl border border-white/8 bg-black/40 p-4 text-left">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-semibold text-neutral-400">Bank Tujuan</span>
                        <span class="text-xs font-bold text-white">BNI</span>
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
                            class="rounded bg-blue-500/20 px-2 py-1 text-[11px] font-semibold text-blue-300 hover:bg-blue-500/30"
                          >
                            {copiedField.value === "bni" ? "Tersalin!" : "Salin"}
                          </button>
                        </div>
                      </div>

                      <div class="mt-3">
                        <div class="text-[11px] text-neutral-400">Atas Nama</div>
                        <div class="text-xs font-medium text-white">{bniHolder}</div>
                      </div>

                      <div class="mt-3 border-t border-white/8 pt-2.5">
                        <div class="text-[11px] text-neutral-400">Nominal Transfer</div>
                        <div class="mt-0.5 flex items-center justify-between">
                          <span class="text-sm font-bold text-emerald-400">{formattedPrice}</span>
                          <button
                            type="button"
                            onClick$={() => copyToClipboard(priceAmount, "nominal-bni")}
                            class="rounded border border-white/12 px-2 py-0.5 text-[11px] text-neutral-300 hover:text-white"
                          >
                            {copiedField.value === "nominal-bni" ? "Tersalin!" : "Salin"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <div class="mt-6 border-t border-white/8 pt-4">
                  <a
                    href={getWaLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="figma-liquid-button group relative flex w-full items-center justify-center overflow-hidden rounded-full border border-white/20 py-3.5 text-sm font-bold text-white shadow-xl transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  >
                    <div class="cta-btn-inner-glow absolute inset-0 rounded-full pointer-events-none"></div>
                    <div class="cta-btn-border-base absolute inset-0 rounded-full pointer-events-none"></div>
                    <div class="cta-btn-border-shine absolute inset-0 rounded-full pointer-events-none"></div>
                    <span class="relative z-10 flex items-center justify-center gap-2">
                      Sudah Bayar? Konfirmasi WhatsApp
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                  <p class="mt-2 text-center text-[11px] text-neutral-400">
                    Otomatis mengirimkan detail email dan nomor ke WhatsApp.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 3 Core Trust FAQs */}
          <div class="mt-8 space-y-3">
            {[
              {
                q: "Apakah perlu memberikan kata sandi Google saya?",
                a: "Sama sekali tidak. Anda hanya akan menerima tautan aktivasi resmi dari serviceactivation.google.com. Seluruh proses klaim dilakukan oleh Anda sendiri di akun Google Anda.",
              },
              {
                q: "Berapa lama tautan aktivasi akan dikirim?",
                a: "Tautan aktivasi langsung dikirim ke WhatsApp Anda dalam kurun waktu 1 hingga 5 menit setelah konfirmasi pembayaran diterima.",
              },
              {
                q: "Bagaimana jika tautan tidak dapat digunakan?",
                a: "Kami memberikan garansi aktivasi penuh. Apabila tautan mengalami kendala teknis saat pertama kali diklaim, kami sediakan tautan pengganti baru atau garansi dana kembali 100%.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                class="overflow-hidden rounded-xl border border-white/8 bg-[#0c0d12]"
              >
                <button
                  type="button"
                  onClick$={() => toggleFaq(idx)}
                  class="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-white hover:text-blue-400 focus-visible:outline-none"
                >
                  <span>{faq.q}</span>
                  <span class="ml-2 text-neutral-400 text-xs">
                    {activeFaq.value === idx ? "−" : "+"}
                  </span>
                </button>
                {activeFaq.value === idx && (
                  <div class="border-t border-white/6 px-4 pt-1 pb-4 text-xs leading-relaxed text-neutral-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div class="mt-8 text-center text-xs text-neutral-500">
            © 2026 Octane AI (octane.web.id). Layanan aktivasi mandiri Google One AI Premium.
          </div>
        </div>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Beli Tautan Aktivasi Google Gemini Pro 18 Bulan | Octane",
  meta: [
    {
      name: "description",
      content:
        "Beli tautan aktivasi Google One AI Premium (Gemini 1.5 Pro + 2TB Storage) 18 Bulan hanya Rp 30.000. Langsung bayar via QRIS tanpa login.",
    },
    {
      property: "og:title",
      content: "Beli Tautan Aktivasi Google Gemini Pro 18 Bulan | Octane",
    },
    {
      property: "og:description",
      content:
        "Aktivasi resmi Google One AI Premium 18 Bulan Rp 30.000. Tanpa login, langsung scan QRIS.",
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
