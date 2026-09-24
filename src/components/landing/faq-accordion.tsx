import { component$, type QRL } from "@builder.io/qwik";
import { WHATSAPP_CONFIRM_URL } from "~/constants/landing-data";
import type { FaqItem } from "~/types/landing";

interface FaqAccordionProps {
  readonly items: readonly FaqItem[];
  readonly activeIndex: number | null;
  readonly onToggle$: QRL<(index: number) => void>;
}

export const FaqAccordion = component$<FaqAccordionProps>(
  ({ items, activeIndex, onToggle$ }) => {
    return (
      <section class="w-full max-w-5xl mx-auto text-left px-2">
        {/* 2-Column Responsive FAQ Layout */}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* Left Column: Heading & Context */}
          <div class="lg:col-span-4 space-y-2.5">
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono font-medium text-neutral-300 inline-block">
              Pertanyaan Penting (FAQ)
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Detail & Ketentuan Aktivasi
            </h2>
            <p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Transparan, instan, dan resmi langsung via domain Google tanpa
              meminta kata sandi email Anda.
            </p>

            <div class="pt-2">
              <a
                href={WHATSAPP_CONFIRM_URL}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <span>Butuh bantuan lain? Tanya via WhatsApp</span>
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
          </div>

          {/* Right Column: Sleek Border-Separated Accordion Rows (No Heavy Pills) */}
          <div class="lg:col-span-8 border-t border-white/10 divide-y divide-white/10">
            {items.map((faq, idx) => {
              const isOpen = activeIndex === idx;
              return (
                <div key={idx} class="transition-colors">
                  <button
                    type="button"
                    onClick$={() => onToggle$(idx)}
                    aria-expanded={isOpen}
                    class="flex w-full items-center justify-between py-4 sm:py-5 text-left text-xs sm:text-sm md:text-base font-semibold text-white hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 cursor-pointer gap-4"
                  >
                    <span class="leading-snug">{faq.question}</span>
                    <span
                      class={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/5 transition-transform duration-300 ease-out ${
                        isOpen
                          ? "rotate-180 bg-white/15 text-white"
                          : "text-neutral-400"
                      }`}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>

                  {/* Smooth CSS Grid Height Transition */}
                  <div
                    class="grid transition-all duration-300 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      opacity: isOpen ? "1" : "0",
                    }}
                  >
                    <div class="overflow-hidden">
                      <p class="pb-4 sm:pb-5 text-xs sm:text-sm text-neutral-400 leading-relaxed pr-6">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);
