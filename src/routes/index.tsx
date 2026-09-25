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
import type { AppView, CopiedField } from "~/types/landing";

export default component$(() => {
  // Navigation states: "landing" | "payment" | "success"
  const currentView = useSignal<AppView>("landing");
  const isNavigating = useSignal<boolean>(false);
  const isCheckingPayment = useSignal<boolean>(false);
  const copiedField = useSignal<CopiedField | null>(null);
  const activeFaq = useSignal<number | null>(null);
  const availableLinks = linksData.filter(
    (item) => item.status === "available",
  );
  const initialStock = availableLinks.length;
  const activeActivationLink =
    availableLinks[0]?.url ?? ACTIVATION_FALLBACK_LINK;

  const timerSeconds = useSignal<number>(300); // 5 menit
  const availableStock = useSignal<number>(initialStock);
  const currentOrderId = useSignal<string>("");
  const qrUrl = useSignal<string | null>(null);
  const isLoadingQr = useSignal<boolean>(false);
  const statusNotice = useSignal<string | null>(null);
  const recoveredOrder = useSignal<{
    orderId: string;
    activationLink: string;
    savedAt: string;
  } | null>(null);
  const showRecoveryBanner = useSignal<boolean>(true);

  // Check localStorage saat halaman dibuka, polling status Midtrans & timer sesi
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const raw = window.localStorage.getItem("octane_active_order");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.activationLink && parsed?.orderId) {
            recoveredOrder.value = parsed;
            currentOrderId.value = parsed.orderId;
          }
        }
      } catch (err) {
        console.error("Gagal memuat sesi order tersimpan:", err);
      }
    }

    if (typeof window !== "undefined") {
      fetch("/api/stock")
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.stock === "number") {
            availableStock.value = data.stock;
          }
        })
        .catch(() => {});
    }

    track(() => currentView.value);
    if (currentView.value === "payment") {
      timerSeconds.value = 900; // 15 menit (standar QRIS)
      const timerInterval = setInterval(() => {
        if (timerSeconds.value > 0) {
          timerSeconds.value--;
        }
      }, 1000);

      // Polling realtime status pembayaran setiap 3.5 detik
      const pollInterval = setInterval(async () => {
        if (!currentOrderId.value || isCheckingPayment.value) return;
        try {
          const res = await fetch(
            `/api/status?order_id=${encodeURIComponent(currentOrderId.value)}`,
          );
          const data = await res.json();
          if (data && data.is_paid) {
            currentView.value = "success";
            const orderData = {
              orderId: currentOrderId.value,
              activationLink: data.activation_link || activeActivationLink,
              savedAt: new Date().toISOString(),
            };
            recoveredOrder.value = orderData;
            if (typeof window !== "undefined" && window.localStorage) {
              window.localStorage.setItem(
                "octane_active_order",
                JSON.stringify(orderData),
              );
            }
            if (availableStock.value > 0) {
              availableStock.value--;
            }
          }
        } catch {
          // silent polling failover
        }
      }, 3500);

      cleanup(() => {
        clearInterval(timerInterval);
        clearInterval(pollInterval);
      });
    }
  });

  const formatTimer = (sec: number): string => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Navigasi ke halaman pembayaran dengan memanggil Midtrans Core API QRIS langsung
  const goToPayment = $(async () => {
    if (isNavigating.value) return;
    if (availableStock.value <= 0) return;
    isNavigating.value = true;
    isLoadingQr.value = true;
    statusNotice.value = null;

    try {
      const res = await fetch("/api/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gross_amount: 1 }),
      });
      const data = await res.json();
      if (data && data.success) {
        currentOrderId.value = data.order_id;
        qrUrl.value = data.qr_url;
        currentView.value = "payment";
      } else {
        if (typeof data?.message === "string" && data.message.includes("habis")) {
          availableStock.value = 0;
        }
        alert(data?.message || "Gagal membuat transaksi QRIS");
      }
    } catch (err) {
      console.error("Gagal request Midtrans QRIS:", err);
      alert("Koneksi ke server pembayaran terganggu. Silakan coba lagi.");
    } finally {
      isLoadingQr.value = false;
      isNavigating.value = false;
    }
  });

  const goToHome = $(() => {
    currentView.value = "landing";
  });

  const checkPaymentStatus = $(async () => {
    if (isCheckingPayment.value) return;
    isCheckingPayment.value = true;
    statusNotice.value = null;

    try {
      const res = await fetch(
        `/api/status?order_id=${encodeURIComponent(currentOrderId.value)}`,
      );
      const data = await res.json();

      if (data && data.is_paid) {
        isCheckingPayment.value = false;
        currentView.value = "success";

        const orderData = {
          orderId: currentOrderId.value,
          activationLink: data.activation_link || activeActivationLink,
          savedAt: new Date().toISOString(),
        };

        recoveredOrder.value = orderData;
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(
            "octane_active_order",
            JSON.stringify(orderData),
          );
        }

        if (availableStock.value > 0) {
          availableStock.value--;
        }
        return;
      } else {
        statusNotice.value =
          "Pembayaran belum terdeteksi. Silakan selesaikan scan QRIS di aplikasi Anda, lalu tekan cek kembali.";
      }
    } catch (err) {
      console.error("Gagal memeriksa status pembayaran:", err);
      statusNotice.value =
        "Gagal menghubungi server verifikasi. Silakan coba sesaat lagi.";
    } finally {
      isCheckingPayment.value = false;
    }
  });

  const clearSavedSession = $(() => {
    recoveredOrder.value = null;
    currentOrderId.value = "";
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("octane_active_order");
    }
    currentView.value = "landing";
  });

  const resumeSavedOrder = $(() => {
    currentView.value = "success";
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
        {/* Banner Pemulihan Pesanan Jika Browser Sempat Tertutup */}
        {recoveredOrder.value &&
          currentView.value === "landing" &&
          showRecoveryBanner.value && (
            <div class="mb-6 w-full max-w-4xl mx-auto rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold text-white">
                    Pesanan Aktif Ditemukan (Order #
                    {recoveredOrder.value.orderId})
                  </div>
                  <div class="text-[11px] text-neutral-300">
                    Tautan aktivasi Anda tersimpan aman di browser ini dari
                    transaksi sebelumnya.
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick$={resumeSavedOrder}
                  class="rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  Buka Tautan Saya
                </button>
                <button
                  type="button"
                  onClick$={() => (showRecoveryBanner.value = false)}
                  class="rounded-xl border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                  title="Sembunyikan Notifikasi"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

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
            qrUrl={qrUrl.value}
            isLoadingQr={isLoadingQr.value}
            orderId={currentOrderId.value}
            timerSeconds={timerSeconds.value}
            formattedTimer={formatTimer(timerSeconds.value)}
            isCheckingPayment={isCheckingPayment.value}
            statusNotice={statusNotice.value}
            copiedField={copiedField.value}
            onBack$={goToHome}
            onCheckPayment$={checkPaymentStatus}
            onCopy$={copyToClipboard}
          />
        )}

        {/* View 3: Success */}
        {!isNavigating.value && currentView.value === "success" && (
          <SuccessView
            activationLink={
              recoveredOrder.value?.activationLink || activeActivationLink
            }
            orderId={currentOrderId.value || recoveredOrder.value?.orderId}
            copiedField={copiedField.value}
            onCopy$={copyToClipboard}
            onHome$={goToHome}
            onClearSession$={clearSavedSession}
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
