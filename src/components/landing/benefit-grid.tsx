import { component$ } from "@builder.io/qwik";
import type { BenefitItem, SecurityFeatureItem } from "~/types/landing";

interface BenefitGridProps {
  readonly items: readonly BenefitItem[];
  readonly securityFeature: SecurityFeatureItem;
}

export const BenefitGrid = component$<BenefitGridProps>(
  ({ items, securityFeature }) => {
    return (
      <section class="w-full max-w-5xl mx-auto px-2">
        {/* Section Sub-header */}
        <div class="text-center mb-6 sm:mb-8">
          <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono font-medium text-neutral-300">
            Paket Resmi Google AI Pro • Rp 309 rb/bln
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2.5">
            4 Pilar Kemampuan Premium Google
          </h2>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-xl mx-auto leading-relaxed">
            Semua fitur resmi di bawah ini aktif langsung di akun Google pribadi
            Anda selama 18 bulan penuh.
          </p>
        </div>

        {/* Symmetrical 4-Pillar Grid: 1 col mobile, 2 cols tablet, 4 cols laptop/desktop */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {items.map((item) => (
            <div
              key={item.id}
              class="glass-card rounded-2xl p-5 flex flex-col justify-between transition-colors hover:border-white/16 hover:bg-white/[0.035]"
            >
              <div>
                {/* Card Header: Bespoke Icon on Left, Highlight Badge on Right */}
                <div class="flex items-center justify-between gap-2 mb-4">
                  {item.badgeColor === "blue" && (
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
                          fill="url(#gemini-spark-grad)"
                        />
                        <defs>
                          <linearGradient
                            id="gemini-spark-grad"
                            x1="2"
                            y1="2"
                            x2="22"
                            y2="22"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#38bdf8" />
                            <stop offset="0.5" stop-color="#818cf8" />
                            <stop offset="1" stop-color="#c084fc" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  )}
                  {item.badgeColor === "emerald" && (
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M4 17l6-6-6-6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path d="M12 19h8" stroke-linecap="round" />
                        <circle
                          cx="18"
                          cy="7"
                          r="2.5"
                          fill="currentColor"
                          fill-opacity="0.3"
                          stroke="none"
                        />
                      </svg>
                    </div>
                  )}
                  {item.badgeColor === "purple" && (
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path
                          d="M12 3a9 9 0 0 1 7.79 4.5L12 12l-7.79 4.5A9 9 0 0 1 12 3Z"
                          fill="currentColor"
                          fill-opacity="0.15"
                          stroke="none"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  )}
                  {item.badgeColor === "cyan" && (
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M6 19a4 4 0 0 1-.8-7.92A6 6 0 0 1 17 8.5a4.5 4.5 0 0 1 3.5 6.5M6 19h14M6 15h14"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  )}

                  <span class="rounded-md border border-white/8 bg-white/[0.04] px-2 py-0.5 text-[11px] font-mono font-medium text-neutral-300">
                    {item.highlight}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 class="text-sm sm:text-base font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p class="text-xs text-neutral-400 leading-snug mt-1">
                  {item.tagline}
                </p>

                {/* Official Feature Bullet List */}
                <div class="mt-4 pt-3.5 border-t border-white/8 space-y-2">
                  {item.bullets.map((b, bIdx) => (
                    <div
                      key={bIdx}
                      class="flex items-start gap-2 text-xs text-neutral-300 leading-relaxed"
                    >
                      <span class="text-neutral-500 mt-0.5 select-none">•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Direct Official Google Link Banner */}
        <div class="mt-4 w-full">
          <div class="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div class="flex items-center gap-3 sm:gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <div>
                <div class="text-xs sm:text-sm font-bold text-white">
                  {securityFeature.title}
                </div>
                <div class="text-[11px] sm:text-xs text-neutral-400 mt-0.5 leading-relaxed">
                  {securityFeature.description}
                </div>
              </div>
            </div>

            <div class="hidden sm:flex items-center gap-2 self-center shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>Domain Resmi Google</span>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
