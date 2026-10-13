import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Plan = {
  name: string;
  price: number | string;
  cadence: string;
  description: string;
  highlight?: boolean;
  cta: string;
  features: string[];
  ctaHref?: string;
};

const defaultPlans: Plan[] = [
  {
    name: "Solo",
    price: 0,
    cadence: "free forever",
    description: "Start with the free blocks, no account needed.",
    cta: "Start free",
    features: [
      "All free blocks",
      "Copy-paste install",
      "Community support",
      "MIT licensed",
    ],
  },
  {
    name: "Pro",
    price: 119,
    cadence: "one-time",
    description: "Every block we've shipped and every block we'll ship next.",
    highlight: true,
    cta: "Get Pro access",
    features: [
      "All free blocks",
      "All Pro blocks",
      "Future blocks, forever",
      "Commercial license",
      "Priority support",
    ],
  },
];

export interface Pricing16Props {
  title?: string;
  subtitle?: string;
  plans?: Plan[];
  footnote?: string;
}

export default function Pricing16({
  title = "Two plans. No subscriptions.",
  subtitle = "Free gets you in the door. Pro gets you everything — once.",
  plans = defaultPlans,
  footnote = "All sales final. No refunds, no chargebacks.",
}: Pricing16Props) {
  return (
    <section className="bg-background py-16 sm:py-24 border-b hairline-border">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mx-auto mb-12 max-w-lg text-center">
          <h2 className="text-balance font-semibold text-3xl tracking-tight sm:text-4xl text-foreground font-display">
            {title}
          </h2>
          <p className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "relative flex flex-col gap-7 rounded-2xl border border-border bg-card p-7 transition-all duration-200",
                plan.highlight &&
                  "border-primary/40 ring-1 ring-primary/20 shadow-md",
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary-foreground shadow-sm">
                  Recommended
                </span>
              )}

              <div className="flex flex-col gap-1.5">
                <h3 className="font-semibold text-xl tracking-tight text-foreground font-display">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-2 border-y border-border py-5">
                {plan.price === 0 || plan.price === "0" ? (
                  <span className="font-semibold text-4xl tracking-tight text-foreground">
                    Free
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-4xl tracking-tight tabular-nums text-foreground">
                      {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.cadence}
                    </span>
                  </>
                )}
              </div>

              <ul className="flex flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-primary"
                      strokeWidth={2.5}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                variant={plan.highlight ? "default" : "outline"}
                className="mt-auto w-full rounded-lg"
              >
                <a href={plan.ctaHref || "#katalog"} className="flex items-center justify-center gap-2">
                  <span>{plan.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </article>
          ))}
        </div>

        {footnote && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
