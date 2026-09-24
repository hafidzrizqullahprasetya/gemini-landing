/**
 * Matt Pocock - Total TypeScript patterns:
 * - Strict type definitions with readonly modifiers
 * - Discriminated unions for state machine navigation
 * - Type-safe models compatible with the `satisfies` operator
 * - Zero `any` or dangerous type assertions (`as`)
 */

export type AppView = "landing" | "payment" | "success";

export type PaymentMethod = "qris" | "bni";

export type CopiedField = "nominal" | "bni" | "link";

export type BenefitBadgeColor = "blue" | "purple" | "cyan" | "emerald";

export type IconType = "gemini" | "flow" | "cloud" | "antigravity";

export interface BenefitItem {
  readonly id: string;
  readonly title: string;
  readonly highlight: string;
  readonly tagline: string;
  readonly description: string;
  readonly bullets: readonly string[];
  readonly badgeColor: BenefitBadgeColor;
  readonly iconType: IconType;
}

export interface SecurityFeatureItem {
  readonly title: string;
  readonly description: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface PricingConfig {
  readonly originalPriceFormatted: string;
  readonly promoPriceFormatted: string;
  readonly promoPriceNumeric: number;
  readonly currency: string;
  readonly billingPeriodLabel: string;
  readonly headlineBenefit: string;
  readonly storageCapacity: string;
  readonly geminiMultiplier: string;
}

export interface BankAccountConfig {
  readonly bankName: string;
  readonly accountNumber: string;
  readonly accountHolder: string;
}

export interface ProductMetadata {
  readonly name: string;
  readonly brandName: string;
  readonly description: string;
  readonly image: string;
  readonly canonicalUrl: string;
  readonly priceValidUntil: string;
  readonly aggregateRatingValue: string;
  readonly reviewCount: string;
}

/**
 * Matt Pocock's favorite utility: Prettify
 * Flattens complex object types for crystal clear hover tooltips.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Matt Pocock's DeepReadonly utility:
 * Enforces deep immutability at compile time.
 */
export type DeepReadonly<T> = T extends (...args: unknown[]) => unknown
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

/**
 * Type guard for PaymentMethod
 */
export const isPaymentMethod = (value: unknown): value is PaymentMethod => {
  return value === "qris" || value === "bni";
};

/**
 * Type guard for AppView
 */
export const isAppView = (value: unknown): value is AppView => {
  return value === "landing" || value === "payment" || value === "success";
};
