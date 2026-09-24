import { component$, type QRL } from "@builder.io/qwik";
import { HeroSection } from "~/components/landing/hero-section";
import { BenefitGrid } from "~/components/landing/benefit-grid";
import { FaqAccordion } from "~/components/landing/faq-accordion";
import {
  PRICING_CONFIG,
  BENEFIT_ITEMS,
  SECURITY_FEATURE,
  FAQ_ITEMS,
} from "~/constants/landing-data";

interface LandingViewProps {
  readonly availableStock: number;
  readonly activeFaq: number | null;
  readonly onBuy$: QRL<() => void>;
  readonly onToggleFaq$: QRL<(index: number) => void>;
}

export const LandingView = component$<LandingViewProps>(
  ({ availableStock, activeFaq, onBuy$, onToggleFaq$ }) => {
    return (
      <div class="w-full flex flex-col items-center">
        {/* Hero Section */}
        <HeroSection
          pricing={PRICING_CONFIG}
          availableStock={availableStock}
          onBuy$={onBuy$}
        />

        {/* Specular Divider */}
        <div class="specular-divider max-w-5xl mx-auto my-8 sm:my-10 md:my-12" />

        {/* Visual Benefit Grid (Mobile 2-col, Tablet 2-col, Laptop/PC 4-col) */}
        <BenefitGrid items={BENEFIT_ITEMS} securityFeature={SECURITY_FEATURE} />
        {/* Specular Divider */}
        <div class="specular-divider max-w-5xl mx-auto my-12 sm:my-16 md:my-20" />

        {/* FAQ Accordion */}
        <FaqAccordion
          items={FAQ_ITEMS}
          activeIndex={activeFaq}
          onToggle$={onToggleFaq$}
        />
      </div>
    );
  },
);
