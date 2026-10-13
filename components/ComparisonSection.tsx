import Pricing16 from "@/components/ui/pricing-16";
import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface ComparisonSectionProps {
  lang?: Language;
}

export function ComparisonSection({ lang = "id" }: ComparisonSectionProps) {
  const t = translations[lang].comparison;

  return (
    <div id="keunggulan">
      <Pricing16
        title={t.title}
        subtitle={t.subtitle}
        plans={t.plans}
        footnote={
          lang === "id"
            ? "Seluruh akun diperiksa otomatis sebelum pengiriman. Garansi replace berlaku sesuai paket produk."
            : "All accounts are pre-verified prior to dispatch. Replacement warranty applies per product SLA."
        }
      />
    </div>
  );
}
