import { component$, type QRL } from "@builder.io/qwik";
import type { CopiedField } from "~/types/landing";

interface SuccessViewProps {
  readonly activationLink: string;
  readonly copiedField: CopiedField | null;
  readonly onCopy$: QRL<(text: string, field: CopiedField) => void>;
  readonly onHome$: QRL<() => void>;
}

export const SuccessView = component$<SuccessViewProps>(
  ({ activationLink, copiedField, onCopy$, onHome$ }) => {
    return (
      <div class="w-full max-w-xl md:max-w-2xl mx-auto px-2">
        <div class="glass-card overflow-hidden rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
          {/* Checkmark Icon Clean Monochrome */}
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pembayaran Terverifikasi
          </h2>
          <p class="mt-1.5 text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Tautan aktivasi Google AI Pro 18 Bulan Anda siap diklaim ke akun
            Google pribadi.
          </p>

          {/* Activation Link Container */}
          <div class="mt-6 rounded-2xl border border-white/10 bg-black/60 p-4 sm:p-5 text-left">
            <div class="text-xs font-medium text-neutral-400 mb-2">
              Tautan Aktivasi Resmi Google:
            </div>

            <div class="font-mono text-xs sm:text-sm text-white break-all select-all bg-white/[0.04] p-3 rounded-xl border border-white/8 leading-relaxed">
              {activationLink}
            </div>

            <div class="mt-4 flex flex-col sm:flex-row items-center gap-2.5">
              <a
                href={activationLink}
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:flex-1 rounded-xl bg-white text-black py-3 text-center text-xs sm:text-sm font-bold hover:bg-neutral-200 transition-colors"
              >
                Klaim Sekarang ke Akun Google
              </a>

              <button
                type="button"
                onClick$={() => onCopy$(activationLink, "link")}
                class="w-full sm:w-auto rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-xs sm:text-sm font-medium text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                {copiedField === "link" ? "Tersalin!" : "Salin Tautan"}
              </button>
            </div>
          </div>

          {/* 2-Step Claim Guide & No Warranty Notice */}
          <div class="mt-5 text-left text-xs sm:text-sm text-neutral-400 space-y-2 border-t border-white/8 pt-4">
            <div class="flex items-start gap-2">
              <span class="font-bold text-white">1.</span>
              <span>
                Pastikan peramban Anda sudah masuk ke akun Google pribadi yang
                hendak di-upgrade.
              </span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-bold text-white">2.</span>
              <span>
                Klik tombol klaim di atas dan tekan konfirmasi aktivasi.
                Kapasitas 5TB dan Gemini 3 Pro langsung aktif.
              </span>
            </div>
            <div class="text-[11px] sm:text-xs text-neutral-500 pt-1 leading-relaxed">
              Catatan: Tautan berlaku 1x pakai langsung dan tanpa garansi
              perpanjangan berkala. Harap segera klaim setelah transaksi.
            </div>
          </div>

          {/* Reset to home button */}
          <div class="mt-6 pt-2">
            <button
              type="button"
              onClick$={onHome$}
              class="text-xs sm:text-sm text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              ← Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  },
);
