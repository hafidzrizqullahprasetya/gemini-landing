import { component$, type QRL } from "@builder.io/qwik";

interface NavbarProps {
  readonly onHome$: QRL<() => void>;
  readonly durationLabel?: string;
}

export const Navbar = component$<NavbarProps>(
  ({ onHome$, durationLabel = "Aktivasi 18 Bulan" }) => {
    return (
      <header class="sticky top-0 z-50 w-full border-b border-white/8 bg-black/80 backdrop-blur-xl">
        <div class="container-wrap flex items-center justify-between py-3.5 sm:py-4">
          <button
            type="button"
            onClick$={onHome$}
            class="flex items-center gap-2.5 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-sm cursor-pointer"
            aria-label="Kembali ke Beranda Octane"
          >
            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] border border-white/12">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 3L27 8.8V23.2L16 29L5 23.2V8.8L16 3Z"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M16 8L23 12.2V19.8L16 24L9 19.8V12.2L16 8Z"
                  fill="#ffffff"
                  fill-opacity="0.15"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
                <circle cx="16" cy="16" r="2.5" fill="#ffffff" />
              </svg>
            </div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-sm sm:text-base font-bold tracking-tight text-white">
                Octane
              </span>
              <span class="text-[11px] sm:text-xs font-medium text-neutral-400">
                / Google AI Pro
              </span>
            </div>
          </button>

          {/* Live Scarcity & Stock Pip in Header */}
          <div class="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-[11px] sm:text-xs font-medium text-neutral-300">
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>{durationLabel}</span>
          </div>
        </div>
      </header>
    );
  },
);
