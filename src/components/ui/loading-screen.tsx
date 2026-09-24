import { component$ } from "@builder.io/qwik";

interface LoadingScreenProps {
  readonly title?: string;
  readonly subtitle?: string;
}

export const LoadingScreen = component$<LoadingScreenProps>(
  ({
    title = "Menyiapkan Sesi Pembayaran...",
    subtitle = "Mengamankan sesi aktivasi & QRIS instan.",
  }) => {
    return (
      <div class="mx-auto max-w-sm w-full text-center py-20 sm:py-28 md:py-36">
        <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white mb-4 animate-spin">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
        <div class="text-base font-semibold text-white">{title}</div>
        <div class="text-xs sm:text-sm text-neutral-400 mt-1">{subtitle}</div>
      </div>
    );
  },
);
