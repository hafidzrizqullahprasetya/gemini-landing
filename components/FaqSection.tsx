import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface FaqSectionProps {
  lang?: Language;
}

export function FaqSection({ lang = "id" }: FaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const t = translations[lang].faq;

  return (
    <section id="faq" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="divide-y divide-border/40 border border-border/40 rounded-2xl bg-card overflow-hidden">
          {t.items.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left gap-4 hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:bg-muted/40 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-foreground">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-foreground" : ""
                      }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
