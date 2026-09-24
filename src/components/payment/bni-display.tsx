import { component$, type QRL } from "@builder.io/qwik";
import type { BankAccountConfig, CopiedField } from "~/types/landing";

interface BniDisplayProps {
  readonly bank: BankAccountConfig;
  readonly copiedField: CopiedField | null;
  readonly onCopy$: QRL<(text: string, field: CopiedField) => void>;
}

export const BniDisplay = component$<BniDisplayProps>(
  ({ bank, copiedField, onCopy$ }) => {
    return (
      <div class="mt-4 rounded-xl border border-white/8 bg-black/40 p-4 text-left">
        <div class="flex items-center justify-between text-xs">
          <span class="text-neutral-400">Bank Tujuan</span>
          <span class="font-bold text-white tracking-wider">
            {bank.bankName}
          </span>
        </div>

        <div class="mt-3">
          <div class="text-[11px] text-neutral-400">Nomor Rekening</div>
          <div class="mt-1 flex items-center justify-between gap-2">
            <span class="font-mono text-sm sm:text-base font-bold text-white tracking-wider">
              {bank.accountNumber}
            </span>
            <button
              type="button"
              onClick$={() => onCopy$(bank.accountNumber, "bni")}
              class="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-neutral-200 transition-colors hover:bg-white/20 cursor-pointer"
            >
              {copiedField === "bni" ? "Tersalin" : "Salin"}
            </button>
          </div>
        </div>

        <div class="mt-3 pt-3 border-t border-white/6">
          <div class="text-[11px] text-neutral-400">Atas Nama</div>
          <div class="text-xs sm:text-sm font-medium text-white mt-0.5">
            {bank.accountHolder}
          </div>
        </div>
      </div>
    );
  },
);
