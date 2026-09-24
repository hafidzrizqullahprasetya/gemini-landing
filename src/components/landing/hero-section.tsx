import { component$, type QRL } from "@builder.io/qwik";
import type { PricingConfig } from "~/types/landing";

interface HeroSectionProps {
  readonly pricing: PricingConfig;
  readonly availableStock: number;
  readonly onBuy$: QRL<() => void>;
}

export const HeroSection = component$<HeroSectionProps>(
  ({ pricing, availableStock, onBuy$ }) => {
    return (
      <section class="mx-auto max-w-4xl text-center px-2">
        {/* Urgency Stock Badge */}
        <div class="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300">
          <span class="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span>Sisa Slot Batch Hari Ini: {availableStock} Tautan</span>
        </div>

        {/* Main Responsive Headline */}
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
          Google AI Pro
          <span class="block text-neutral-400 font-semibold text-lg sm:text-2xl md:text-3xl mt-2 tracking-normal">
            {pricing.headlineBenefit}
          </span>
        </h1>

        {/* Big Centered Price Stage */}
        <div class="my-6 sm:my-8 md:my-9 flex flex-col items-center justify-center text-center">
          <div class="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight">
            {pricing.promoPriceFormatted}
          </div>
          <div class="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <span class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-0.5 text-xs sm:text-sm font-medium text-neutral-400 line-through">
              {pricing.originalPriceFormatted}
            </span>
            <span class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-0.5 text-xs sm:text-sm font-medium text-neutral-200">
              {pricing.billingPeriodLabel}
            </span>
          </div>
          <p class="mt-3 text-xs sm:text-sm text-neutral-400 font-medium max-w-xl mx-auto leading-relaxed">
            Penyimpanan 5 TB • Akses 4x Lipat Gemini 3.1 Pro • Deep Research •
            Berbagi 5 Keluarga
          </p>
        </div>

        {/* Primary Action Button (Centered & Responsive) */}
        <div class="flex justify-center px-2">
          <button
            type="button"
            onClick$={onBuy$}
            class="luminous-cta w-full sm:w-auto min-w-[280px] sm:min-w-[340px] md:min-w-[380px] inline-flex items-center justify-center gap-2.5 rounded-full text-black px-8 sm:px-10 py-4 sm:py-4.5 text-base sm:text-lg font-bold transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none cursor-pointer"
          >
            <span>Beli Sekarang • {pricing.promoPriceFormatted}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              class="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <p class="mt-3 text-xs sm:text-sm text-neutral-400">
          Tanpa registrasi akun • Bayar QRIS • Tautan instan
        </p>
      </section>
    );
  },
);
