import { component$, type QRL } from "@builder.io/qwik";
import type { CopiedField } from "~/types/landing";

interface QrisDisplayProps {
  readonly qrUrl: string | null;
  readonly isLoadingQr: boolean;
  readonly orderId: string;
  readonly amountFormatted: string;
  readonly copiedField: CopiedField | null;
  readonly onCopy$: QRL<(text: string, field: CopiedField) => void>;
}

export const QrisDisplay = component$<QrisDisplayProps>(
  ({ qrUrl, isLoadingQr, orderId, amountFormatted, copiedField, onCopy$ }) => {
    return (
      <div class="mt-4 flex flex-col items-center">
        {/* QR Code Container */}
        <div class="relative min-h-[240px] w-full max-w-[260px] flex items-center justify-center rounded-2xl bg-white p-3.5 shadow-xl transition-transform hover:scale-[1.01]">
          {isLoadingQr || !qrUrl ? (
            <div class="flex flex-col items-center justify-center py-12 text-center">
              <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/10 text-black mb-3 animate-spin">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </div>
              <div class="text-xs font-bold text-neutral-800">
                Menghubungkan Midtrans...
              </div>
              <div class="text-[11px] text-neutral-500 mt-0.5">
                Membuat QRIS Dinamis {amountFormatted}
              </div>
            </div>
          ) : (
            <div class="flex flex-col items-center">
              <img
                src={qrUrl}
                alt="Midtrans QRIS Pembayaran Resmi"
                width="220"
                height="220"
                class="block rounded-lg"
                decoding="async"
              />
              <div class="mt-2 text-[10px] font-mono text-neutral-500 tracking-wider">
                ORDER #{orderId}
              </div>
            </div>
          )}
        </div>

        <p class="mt-3 text-center text-xs text-neutral-400 max-w-xs leading-relaxed">
          Pindai via BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, atau ShopeePay.
        </p>

        <div class="mt-3.5 flex flex-wrap items-center justify-center gap-2">
          {qrUrl && (
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-xl border border-white/12 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              Buka / Unduh QR
            </a>
          )}
          <button
            type="button"
            onClick$={() => onCopy$("1", "nominal")}
            class="rounded-xl border border-white/12 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            {copiedField === "nominal"
              ? "Nominal Tersalin"
              : `Salin ${amountFormatted}`}
          </button>
        </div>
      </div>
    );
  },
);
