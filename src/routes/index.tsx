import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { BackgroundGlow } from "~/components/background-glow/background-glow";
import { Navbar } from "~/components/navbar/navbar";
import { Footer } from "~/components/footer/footer";
import { LoadingScreen } from "~/components/ui/loading-screen";
import { LandingView } from "~/components/landing/landing-view";
import { PaymentView } from "~/components/payment/payment-view";
import { SuccessView } from "~/components/success/success-view";
import linksData from "../../data/links.json";
import {
  ACTIVATION_FALLBACK_LINK,
  PRODUCT_METADATA,
} from "~/constants/landing-data";
import type { AppView, PaymentMethod, CopiedField } from "~/types/landing";

export default component$(() => {
  // Navigation states: "landing" | "payment" | "success"
  const currentView = useSignal<AppView>("landing");
  const isNavigating = useSignal<boolean>(false);
  const isCheckingPayment = useSignal<boolean>(false);
  const paymentMethod = useSignal<PaymentMethod>("qris");
  const copiedField = useSignal<CopiedField | null>(null);
  const activeFaq = useSignal<number | null>(null);
  const availableLinks = linksData.filter(
    (item) => item.status === "available",
  );
  const initialStock = availableLinks.length > 0 ? availableLinks.length : 5;
  const activeActivationLink =
    availableLinks[0]?.url ?? ACTIVATION_FALLBACK_LINK;

  const timerSeconds = useSignal<number>(300); // 5 menit
  const availableStock = useSignal<number>(initialStock);

  // Countdown timer saat masuk ke halaman payment
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    track(() => currentView.value);
    if (currentView.value === "payment") {
      timerSeconds.value = 300;
      const interval = setInterval(() => {
        if (timerSeconds.value > 0) {
          timerSeconds.value--;
        }
      }, 1000);
      cleanup(() => clearInterval(interval));
    }
  });

  const formatTimer = (sec: number): string => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Navigasi dengan loading state profesional (Industry Best Practice)
  const goToPayment = $(() => {
    if (isNavigating.value) return;
    isNavigating.value = true;
    setTimeout(() => {
      currentView.value = "payment";
      isNavigating.value = false;
    }, 500);
  });

  const goToHome = $(() => {
    currentView.value = "landing";
  });

  const checkPaymentStatus = $(() => {
    if (isCheckingPayment.value) return;
    isCheckingPayment.value = true;
    setTimeout(() => {
      isCheckingPayment.value = false;
      currentView.value = "success";
      if (availableStock.value > 1) {
        availableStock.value--;
      }
    }, 1200);
  });

  const copyToClipboard = $((text: string, fieldName: CopiedField) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      copiedField.value = fieldName;
      setTimeout(() => {
        copiedField.value = null;
      }, 2000);
    }
  });

  const toggleFaq = $((idx: number) => {
    activeFaq.value = activeFaq.value === idx ? null : idx;
  });

  const selectPaymentMethod = $((method: PaymentMethod) => {
    paymentMethod.value = method;
  });

  // JSON-LD Structured Data for Google Indexing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT_METADATA.name,
    image: PRODUCT_METADATA.image,
    description: PRODUCT_METADATA.description,
    brand: {
      "@type": "Brand",
      name: PRODUCT_METADATA.brandName,
    },
    offers: {
      "@type": "Offer",
      url: PRODUCT_METADATA.canonicalUrl,
      priceCurrency: "IDR",
      price: "30000",
      priceValidUntil: PRODUCT_METADATA.priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: PRODUCT_METADATA.aggregateRatingValue,
      reviewCount: PRODUCT_METADATA.reviewCount,
    },
  };

  return (
    <div class="relative min-h-screen bg-black text-white selection:bg-neutral-800 selection:text-white antialiased font-sans flex flex-col justify-between overflow-x-hidden">
      {/* JSON-LD Script for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={JSON.stringify(jsonLd)}
      />

      {/* Atmospheric Ambient Glow */}
      <BackgroundGlow />

      {/* Top Header Minimalis & Glass */}
      <Navbar onHome$={goToHome} />
      {/* MAIN CONTENT AREA */}
      <main class="container-wrap pt-6 pb-16 sm:pt-10 sm:pb-20 md:pt-12 md:pb-24 flex-1 flex flex-col items-center">
        {/* Loading overlay */}
        {isNavigating.value && <LoadingScreen />}

        {/* View 1: Landing */}
        {!isNavigating.value && currentView.value === "landing" && (
          <LandingView
            availableStock={availableStock.value}
            activeFaq={activeFaq.value}
            onBuy$={goToPayment}
            onToggleFaq$={toggleFaq}
          />
        )}

        {/* View 2: Payment */}
        {!isNavigating.value && currentView.value === "payment" && (
          <PaymentView
            timerSeconds={timerSeconds.value}
            formattedTimer={formatTimer(timerSeconds.value)}
            paymentMethod={paymentMethod.value}
            isCheckingPayment={isCheckingPayment.value}
            copiedField={copiedField.value}
            onBack$={goToHome}
            onSelectMethod$={selectPaymentMethod}
            onCheckPayment$={checkPaymentStatus}
            onCopy$={copyToClipboard}
          />
        )}

        {/* View 3: Success */}
        {!isNavigating.value && currentView.value === "success" && (
          <SuccessView
            activationLink={activeActivationLink}
            copiedField={copiedField.value}
            onCopy$={copyToClipboard}
            onHome$={goToHome}
          />
        )}
      </main>

      {/* Footer Minimal */}
      <Footer />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Beli Google AI Pro 18 Bulan + 5TB Cloud Storage Rp 30.000 | Octane",
  meta: [
    {
      name: "description",
      content:
        "Beli aktivasi resmi Google AI Pro 18 Bulan (Gemini 3.1 Pro, Deep Research, 5TB Storage, Google Flow, Antigravity, AI Studio, Jules, Family Share 5 orang) seharga Rp 30.000 sekali bayar via QRIS otomatis.",
    },
    {
      name: "keywords",
      content:
        "google ai pro, beli gemini pro, gemini 3.1 pro, deep research, google one 5tb, aktivasi gemini 18 bulan, google flow, deep search, octane web id, qris gemini, ai studio, google antigravity",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "og:title",
      content:
        "Beli Google AI Pro 18 Bulan + 5TB Cloud Storage Rp 30.000 | Octane",
    },
    {
      property: "og:description",
      content:
        "Upgrade akun Google pribadi ke Google AI Pro 18 Bulan seharga Rp 30.000 sekali bayar. Langsung bayar via QRIS tanpa login.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://octane.web.id/",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content:
        "Beli Google AI Pro 18 Bulan + 5TB Cloud Storage Rp 30.000 | Octane",
    },
    {
      name: "twitter:description",
      content:
        "Aktivasi resmi Google AI Pro 18 Bulan Rp 30.000 sekali bayar via QRIS.",
    },
  ],
  links: [
    {
      rel: "canonical",
      href: "https://octane.web.id/",
    },
  ],
};
