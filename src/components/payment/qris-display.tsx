/* eslint-disable qwik/jsx-img */
import { component$, type QRL } from "@builder.io/qwik";
import type { CopiedField } from "~/types/landing";

interface QrisDisplayProps {
  readonly copiedField: CopiedField | null;
  readonly onCopy$: QRL<(text: string, field: CopiedField) => void>;
}

export const QrisDisplay = component$<QrisDisplayProps>(
  ({ copiedField, onCopy$ }) => {
    return (
      <div class="mt-4 flex flex-col items-center">
        <div class="relative rounded-2xl bg-white p-3.5 shadow-xl transition-transform hover:scale-[1.01]">
          <img
            src="/qris-code.svg"
            alt="QRIS Pembayaran 30 Ribu Octane Google AI Pro"
            width="200"
            height="200"
            class="block rounded-lg"
            decoding="async"
          />
        </div>

        <p class="mt-3 text-center text-xs text-neutral-400 max-w-xs leading-relaxed">
          Pindai via BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, atau ShopeePay.
        </p>

        <div class="mt-3.5 flex flex-wrap items-center justify-center gap-2">
          <a
            href="/qris-code.svg"
            download="QRIS-Octane-30k.svg"
            class="rounded-xl border border-white/12 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Unduh QR
          </a>
          <button
            type="button"
            onClick$={() => onCopy$("30000", "nominal")}
            class="rounded-xl border border-white/12 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            {copiedField === "nominal" ? "Nominal Tersalin" : "Salin Rp 30.000"}
          </button>
        </div>
      </div>
    );
  },
);
