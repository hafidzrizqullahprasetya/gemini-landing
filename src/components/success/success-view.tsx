import { component$, type QRL } from "@builder.io/qwik";
import type { CopiedField } from "~/types/landing";

interface SuccessViewProps {
  readonly activationLink: string;
  readonly orderId?: string;
  readonly copiedField: CopiedField | null;
  readonly onCopy$: QRL<(text: string, field: CopiedField) => void>;
  readonly onHome$: QRL<() => void>;
  readonly onClearSession$?: QRL<() => void>;
}

export const SuccessView = component$<SuccessViewProps>(
  ({
    activationLink,
    orderId,
    copiedField,
    onCopy$,
    onHome$,
    onClearSession$,
  }) => {
    const waBackupUrl = `https://wa.me/6281325081046?text=${encodeURIComponent(
      `Halo Octane, saya sudah menyelesaikan pembayaran untuk Order ID: #${orderId || "PROMO"}. Tautan aktivasi: ${activationLink}. Mohon bantuan jika ada kendala ya.`,
    )}`;

    return (
      <div class="w-full max-w-xl md:max-w-2xl mx-auto px-2">
        <div class="glass-card overflow-hidden rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
          {/* Order ID Pill */}
          {orderId && (
            <div class="mb-3.5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 py-1 text-xs font-mono font-medium text-neutral-300">
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Order ID: #{orderId}</span>
            </div>
          )}

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

            <div class="mt-4">
              <button
                type="button"
                onClick$={() => onCopy$(activationLink, "link")}
                class="w-full rounded-xl bg-white text-black py-3 text-center text-xs sm:text-sm font-bold hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                <span>
                  {copiedField === "link"
                    ? "Tautan Berhasil Disalin!"
                    : "Salin Tautan Aktivasi"}
                </span>
              </button>
            </div>
          </div>

          {/* Local Recovery Notice */}
          <div class="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3 text-left flex items-start gap-2.5 text-xs text-neutral-300">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-emerald-400 shrink-0 mt-0.5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            <div class="leading-relaxed text-[11px] sm:text-xs">
              <span class="font-semibold text-white">
                Aman & Tersimpan Otomatis:
              </span>{" "}
              Tautan aktivasi ini telah disimpan di peramban ini. Jika tab
              browser Anda tidak sengaja tertutup, cukup buka kembali alamat ini
              untuk melihatnya lagi.
            </div>
          </div>

          {/* Backup to WhatsApp */}
          <div class="mt-3">
            <a
              href={waBackupUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-2.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Kirim Salinan Order ID ke WhatsApp</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* 2-Step Claim Guide & Notice */}
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
                Salin tautan aktivasi di atas, tempel (paste) dan buka di
                peramban untuk konfirmasi aktivasi. Kapasitas 5TB dan Gemini 3.1
                Pro langsung aktif.
              </span>
            </div>
            <div class="text-[11px] sm:text-xs text-neutral-500 pt-1 leading-relaxed">
              Catatan: Tautan berlaku 1x pakai langsung dan tanpa garansi
              perpanjangan berkala. Harap segera klaim setelah transaksi.
            </div>
          </div>

          {/* Actions */}
          <div class="mt-6 pt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick$={onHome$}
              class="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Kembali ke Beranda
            </button>
            {onClearSession$ && (
              <>
                <span class="text-neutral-700">•</span>
                <button
                  type="button"
                  onClick$={onClearSession$}
                  class="text-xs sm:text-sm text-red-400/80 hover:text-red-300 transition-colors cursor-pointer"
                >
                  Selesai & Hapus Sesi Tersimpan
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);
