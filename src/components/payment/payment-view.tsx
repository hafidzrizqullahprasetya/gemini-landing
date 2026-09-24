import { component$, type QRL } from "@builder.io/qwik";
import { QrisDisplay } from "~/components/payment/qris-display";
import { BniDisplay } from "~/components/payment/bni-display";
import {
  PRICING_CONFIG,
  BANK_CONFIG,
  WHATSAPP_CONFIRM_URL,
} from "~/constants/landing-data";
import type { CopiedField, PaymentMethod } from "~/types/landing";

interface PaymentViewProps {
  readonly timerSeconds: number;
  readonly formattedTimer: string;
  readonly paymentMethod: PaymentMethod;
  readonly isCheckingPayment: boolean;
  readonly copiedField: CopiedField | null;
  readonly onBack$: QRL<() => void>;
  readonly onSelectMethod$: QRL<(method: PaymentMethod) => void>;
  readonly onCheckPayment$: QRL<() => void>;
  readonly onCopy$: QRL<(text: string, field: CopiedField) => void>;
}

export const PaymentView = component$<PaymentViewProps>(
  ({
    timerSeconds,
    formattedTimer,
    paymentMethod,
    isCheckingPayment,
    copiedField,
    onBack$,
    onSelectMethod$,
    onCheckPayment$,
    onCopy$,
  }) => {
    return (
      <div class="w-full max-w-4xl mx-auto px-2">
        {/* Back Button */}
        <button
          type="button"
          onClick$={onBack$}
          class="mb-4 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-400 transition-colors hover:text-white cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Kembali ke Beranda</span>
        </button>

        {/* Responsive Grid: 1 col on mobile, 2 cols on tablet & laptop/PC */}
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Left Column: Order Summary & Timer (Tablet & PC) */}
          <div class="md:col-span-5 space-y-4">
            <div class="glass-card rounded-2xl p-5 sm:p-6 text-left">
              <div class="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Ringkasan Pesanan
              </div>

              <div class="mt-3">
                <h2 class="text-lg sm:text-xl font-bold text-white">
                  Google AI Pro
                </h2>
                <p class="text-xs text-neutral-400 mt-0.5">
                  Paket Resmi 18 Bulan • Nilai Asli Rp 309 rb/bln
                </p>
              </div>

              <div class="mt-4 pt-4 border-t border-white/8 space-y-2 text-xs text-neutral-300">
                <div class="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    class="text-emerald-400 shrink-0"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Akses 4x Lipat Gemini 3.1 Pro & Deep Research</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    class="text-emerald-400 shrink-0"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Penyimpanan 5 TB + Berbagi 5 Keluarga</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    class="text-emerald-400 shrink-0"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>1.000 Kredit Google Flow (Video, Musik, Gambar)</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    class="text-emerald-400 shrink-0"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>AI Studio, Google Antigravity, & Jules Coding</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    class="text-emerald-400 shrink-0"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Gemini di Gmail, Dokumen, Spreadsheet, & Spark</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    class="text-emerald-400 shrink-0"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>US$10 Kredit Cloud/bln + Home & Health Premium</span>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-white/8 flex items-baseline justify-between">
                <div>
                  <div class="text-[11px] text-neutral-400">Total Tagihan</div>
                  <div class="text-2xl font-black text-white">
                    {PRICING_CONFIG.promoPriceFormatted}
                  </div>
                </div>
                <span class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                  Sekali Bayar
                </span>
              </div>
            </div>

            {/* Countdown Timer Widget */}
            <div class="glass-card rounded-2xl p-4 sm:p-5 text-left">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span
                    class={`h-2 w-2 rounded-full ${timerSeconds > 0 ? "bg-amber-400" : "bg-red-400"}`}
                  />
                  <span class="text-xs font-medium text-neutral-300">
                    Sisa Batas Waktu Sesi
                  </span>
                </div>
                <div class="font-mono text-sm sm:text-base font-bold text-white tracking-wider">
                  {formattedTimer}
                </div>
              </div>
              <p class="mt-2 text-[11px] text-neutral-500 leading-tight">
                Selesaikan transaksi sebelum waktu habis untuk memastikan tautan
                terbit otomatis.
              </p>
            </div>
          </div>

          {/* Right Column: Payment Method & Action (QRIS / BNI) */}
          <div class="md:col-span-7">
            <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-2xl text-center">
              {/* Header Tabs Monokrom */}
              <div class="flex items-center justify-between pb-3.5 border-b border-white/8">
                <div class="text-left">
                  <div class="text-xs font-semibold text-white">
                    Metode Pembayaran
                  </div>
                  <div class="text-[11px] text-neutral-400">
                    Pilih kanal transaksi favorit Anda
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-[11px] text-neutral-400">Nominal</div>
                  <div class="text-sm font-bold text-white">
                    {PRICING_CONFIG.promoPriceFormatted}
                  </div>
                </div>
              </div>

              {/* Payment Method Switcher */}
              <div class="mt-4 grid grid-cols-2 gap-1.5 rounded-xl bg-black p-1 border border-white/8">
                <button
                  type="button"
                  onClick$={() => onSelectMethod$("qris")}
                  class={`rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    paymentMethod === "qris"
                      ? "bg-white text-black shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  QRIS Instan
                </button>
                <button
                  type="button"
                  onClick$={() => onSelectMethod$("bni")}
                  class={`rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    paymentMethod === "bni"
                      ? "bg-white text-black shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Transfer BNI
                </button>
              </div>

              {/* QRIS / BNI Panel */}
              {paymentMethod === "qris" ? (
                <QrisDisplay copiedField={copiedField} onCopy$={onCopy$} />
              ) : (
                <BniDisplay
                  bank={BANK_CONFIG}
                  copiedField={copiedField}
                  onCopy$={onCopy$}
                />
              )}

              {/* Status Verification Checker Button */}
              <div class="mt-6 pt-4 border-t border-white/8">
                <button
                  type="button"
                  disabled={isCheckingPayment}
                  onClick$={onCheckPayment$}
                  class="luminous-cta w-full rounded-full text-black py-3.5 text-xs sm:text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isCheckingPayment ? (
                    <>
                      <svg
                        class="animate-spin h-4 w-4 text-black"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      <span>Memverifikasi Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <span>Saya Sudah Bayar (Cek Status)</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Fallback WhatsApp Confirmation */}
              <div class="mt-3.5 text-center">
                <a
                  href={WHATSAPP_CONFIRM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  Butuh bantuan? Konfirmasi manual via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
