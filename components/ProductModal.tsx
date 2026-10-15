import { useState, useMemo, useEffect } from "react";
import QRCode from "qrcode";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createBrandVectorBadge, type EnrichedProduct } from "@/services/venteApi";
import type { Language } from "@/lib/i18n";
import { translations, localizeCategory, localizeDuration, localizeWarranty } from "@/lib/i18n";
import {
  ShieldCheck,
  Zap,
  Clock,
  MessageCircle,
  Copy,
  Check,
  Layers,
  ExternalLink,
  Download,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  CreditCard,
  Mail,
  Minus,
  Plus,
  Share2,
} from "lucide-react";

interface ProductModalProps {
  product: EnrichedProduct | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

interface DynamicQrData {
  qrUrl?: string;
  qrString?: string;
  qrDataUrl?: string;
  orderId?: string;
  grossAmount?: number;
  isDynamic: boolean;
  isTest?: boolean;
  message?: string;
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  lang = "id",
}: ProductModalProps) {
  // Step state: "detail" -> "checkout" -> "success"
  const [step, setStep] = useState<"detail" | "checkout" | "success">("detail");
  const [quantity, setQuantity] = useState(1);
  const [userEmail, setUserEmail] = useState("");

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [liveStock, setLiveStock] = useState<{ stock: number; inStock: boolean } | null>(null);
  const [isVerifyingStock, setIsVerifyingStock] = useState(false);

  // Midtrans Dynamic QR state
  const [dynamicQr, setDynamicQr] = useState<DynamicQrData | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [activationUrl, setActivationUrl] = useState<string | null>(null);
  const [activationUrls, setActivationUrls] = useState<string[]>([]);
  const [localQrDataUrl, setLocalQrDataUrl] = useState<string | null>(null);
  const [fulfillmentMeta, setFulfillmentMeta] = useState<{ allDelivered?: boolean; pendingCount?: number; deliveredCount?: number; message?: string } | null>(null);

  // Convert raw Midtrans qrString directly to crisp base64 Data URL (immune to external network issues)
  useEffect(() => {
    if (dynamicQr?.qrString) {
      QRCode.toDataURL(dynamicQr.qrString, {
        margin: 1,
        width: 380,
        color: { dark: "#000000", light: "#ffffff" },
      })
        .then((url) => setLocalQrDataUrl(url))
        .catch(() => setLocalQrDataUrl(null));
    } else {
      setLocalQrDataUrl(null);
    }
  }, [dynamicQr?.qrString]);
  const t = translations[lang].modal;
  const tCat = translations[lang].catalog;

  // Reset states when modal is opened or product changes
  useEffect(() => {
    if (!product || !isOpen) {
      setStep("detail");
      setQuantity(1);
      setLiveStock(null);
      setDynamicQr(null);
      setActivationUrl(null);
      setActivationUrls([]);
      setUserEmail("");
      setFulfillmentMeta(null);
      return;
    }

    setStep("detail");
    setQuantity(1);
    setActivationUrl(null);
    setActivationUrls([]);

    let isMounted = true;
    setIsVerifyingStock(true);
    fetch(`/api/octane/products/${product.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.product) {
          setLiveStock({
            stock: data.product.stock,
            inStock: data.product.is_in_stock,
          });
        }
      })
      .catch(() => { })
      .finally(() => {
        if (isMounted) setIsVerifyingStock(false);
      });

    return () => {
      isMounted = false;
    };
  }, [product, isOpen]);

  const currentStock = liveStock !== null ? liveStock.stock : (product ? product.stock : 0);
  const currentInStock = liveStock !== null ? liveStock.inStock : (product ? product.is_in_stock : false);

  // Compute unit price based on wholesale tiers if active
  const { unitPrice, activeTier, discountPerUnit } = useMemo(() => {
    if (!product) return { unitPrice: 0, activeTier: null, discountPerUnit: 0 };

    const basePrice = product.price_idr;
    let foundTier: { min_qty: number; max_qty: number; price_usd: number } | null = null;

    // Wholesale rules for Gemini 18M (Starts at Rp 18.000)
    const isGemini18 = product.name.toLowerCase().includes("gemini") && product.name.toLowerCase().includes("18");
    if (isGemini18) {
      if (quantity >= 10) {
        return { unitPrice: 15000, activeTier: { min_qty: 10, max_qty: 999, price_usd: 15000 / 16800 }, discountPerUnit: basePrice - 15000 };
      }
      if (quantity >= 5) {
        return { unitPrice: 16000, activeTier: { min_qty: 5, max_qty: 9, price_usd: 16000 / 16800 }, discountPerUnit: basePrice - 16000 };
      }
      if (quantity >= 2) {
        return { unitPrice: 17000, activeTier: { min_qty: 2, max_qty: 4, price_usd: 17000 / 16800 }, discountPerUnit: basePrice - 17000 };
      }
    }

    if (product.price_tiers && product.price_tiers.length > 0) {
      for (const tier of product.price_tiers) {
        if (quantity >= tier.min_qty && quantity <= tier.max_qty) {
          foundTier = tier;
          const tierIdr = Math.max(8500, Math.ceil((tier.price_usd * 16800) / 500) * 500);
          if (tierIdr < basePrice) {
            return {
              unitPrice: tierIdr,
              activeTier: tier,
              discountPerUnit: basePrice - tierIdr,
            };
          }
        }
      }
    }

    return {
      unitPrice: basePrice,
      activeTier: foundTier,
      discountPerUnit: 0,
    };
  }, [product, quantity]);

  const totalCalculatedAmount = unitPrice * quantity;

  // Request QRIS charge when entering checkout step
  const handleProceedToCheckout = () => {
    if (!product) return;
    setStep("checkout");

    const targetAmount = totalCalculatedAmount;

    if (!dynamicQr || dynamicQr.grossAmount !== targetAmount || dynamicQr.isTest) {
      setIsLoadingQr(true);
      fetch("/api/octane/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          grossAmount: targetAmount,
          quantity: quantity,
          isTest: false,
          email: userEmail.trim() || undefined,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            setDynamicQr({
              qrUrl: data.qrUrl,
              qrString: data.qrString,
              qrDataUrl: data.qrDataUrl,
              orderId: data.orderId,
              grossAmount: data.grossAmount || targetAmount,
              isDynamic: true,
              isTest: false,
            });
          } else {
            setDynamicQr({
              isDynamic: false,
              message: data?.message,
              grossAmount: targetAmount,
            });
          }
        })
        .catch(() => {
          setDynamicQr({ isDynamic: false, grossAmount: targetAmount });
        })
        .finally(() => {
          setIsLoadingQr(false);
        });
    }
  };

  const handleTestOneRupiah = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsLoadingQr(true);
    setActivationUrl(null);
    setActivationUrls([]);
    fetch("/api/octane/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        grossAmount: 1,
        quantity: quantity,
        isTest: true,
        email: userEmail.trim() || undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setDynamicQr({
            qrUrl: data.qrUrl,
            qrString: data.qrString,
            qrDataUrl: data.qrDataUrl,
            orderId: data.orderId,
            grossAmount: 1,
            isDynamic: true,
            isTest: true,
          });
        } else {
          setDynamicQr({
            isDynamic: false,
            message: data?.message || "Midtrans Server Key belum diatur",
          });
        }
      })
      .catch(() => { })
      .finally(() => setIsLoadingQr(false));
  };

  const handleRevertToNormalPrice = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsLoadingQr(true);
    setActivationUrl(null);
    setActivationUrls([]);
    const targetAmount = totalCalculatedAmount;
    fetch("/api/octane/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        grossAmount: targetAmount,
        quantity: quantity,
        isTest: false,
        email: userEmail.trim() || undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setDynamicQr({
            qrUrl: data.qrUrl,
            qrString: data.qrString,
            qrDataUrl: data.qrDataUrl,
            orderId: data.orderId,
            grossAmount: data.grossAmount || targetAmount,
            isDynamic: true,
            isTest: false,
          });
        }
      })
      .catch(() => { })
      .finally(() => setIsLoadingQr(false));
  };

  // Real-time EventSource Stream: 0 Polling, 0 Spam, Instant Webhook Push
  useEffect(() => {
    if (!dynamicQr?.orderId || step === "success" || !isOpen) return;

    let isMounted = true;
    const streamUrl = `/api/octane/payment-stream/${dynamicQr.orderId}?productId=${product?.id || ""}&quantity=${quantity}`;
    const es = new EventSource(streamUrl);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.isSettled && isMounted) {
          setActivationUrl(data.activationUrl || null);
          const urls = Array.isArray(data.activationUrls) && data.activationUrls.length > 0
            ? data.activationUrls
            : (data.activationUrl ? [data.activationUrl] : []);
          setActivationUrls(urls);
          setFulfillmentMeta({
            allDelivered: data.allDelivered,
            pendingCount: data.pendingCount,
            deliveredCount: data.deliveredCount,
            message: data.message,
          });
          setStep("success");
          es.close();
        }
      } catch { }
    };

    es.onerror = () => {
      // Graceful fallback check after 4s if SSE drops
      setTimeout(() => {
        if (!isMounted) return;
        fetch(`/api/octane/payment-status/${dynamicQr.orderId}?productId=${product?.id || ""}&quantity=${quantity}`)
          .then((r) => r.json())
          .then((d) => {
            if (d && d.isSettled && isMounted) {
              setActivationUrl(d.activationUrl || null);
              const urls = Array.isArray(d.activationUrls) && d.activationUrls.length > 0
                ? d.activationUrls
                : (d.activationUrl ? [d.activationUrl] : []);
              setActivationUrls(urls);
              setFulfillmentMeta({
                allDelivered: d.allDelivered,
                pendingCount: d.pendingCount,
                deliveredCount: d.deliveredCount,
                message: d.message,
              });
              setStep("success");
            }
          })
          .catch(() => { });
      }, 4000);
      es.close();
    };

    return () => {
      isMounted = false;
      es.close();
    };
  }, [dynamicQr?.orderId, step, isOpen, product, quantity]);

  const parsedContent = useMemo(() => {
    if (!product) return { cleanText: "", links: [] as Array<{ label: string; url: string }> };

    let raw = product.description.trim();
    raw = raw.replace(/[━─=\-]{4,}/g, "");
    raw = raw.replace(/🛍️\s*PRODUCT INFORMATION/gi, "");

    const foundLinks: Array<{ label: string; url: string }> = [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let match;
    while ((match = urlRegex.exec(raw)) !== null) {
      const url = match[1].replace(/[),.]+$/, "");
      if (foundLinks.some((l) => l.url === url)) continue;

      const lower = url.toLowerCase();
      let label = "";

      if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
        label = lang === "id" ? "▶ Video Panduan (YouTube)" : "▶ Video Guide (YouTube)";
      } else if (lower.includes("dev-api.cc") || lower.includes("otp") || lower.includes("sms")) {
        label = lang === "id" ? "🔑 Ambil Kode OTP (dev-api.cc)" : "🔑 Get OTP Code (dev-api.cc)";
      } else if (
        lower.includes("tmail.pk") ||
        lower.includes("dongvanfb") ||
        lower.includes("hitools.pro") ||
        lower.includes("read_mail") ||
        lower.includes("read-hotmail") ||
        lower.includes("tempmail")
      ) {
        label = lang === "id" ? "✉️ Akses Temp Mail / Kotak Masuk" : "✉️ Access Temp Mailbox";
      } else if (lower.includes("telegra.ph")) {
        label = lang === "id" ? "📄 Panduan Langkah (Telegra.ph)" : "📄 Step Guide (Telegra.ph)";
      } else if (lower.includes("miraiapi.com")) {
        if (lower.includes("redeem")) {
          label = lang === "id" ? "⚡ Redeem Token (Mirai API)" : "⚡ Redeem Token (Mirai)";
        } else if (lower.includes("config")) {
          label = lang === "id" ? "⚙️ Panduan Config (Mirai)" : "⚙️ Config Guide (Mirai)";
        } else {
          label = lang === "id" ? "📖 Dokumentasi Mirai API" : "📖 Mirai API Docs";
        }
      } else if (lower.includes("google.com/document")) {
        label = lang === "id" ? "📝 Panduan Setup (Google Doc)" : "📝 Setup Guide (Google Doc)";
      } else if (lower.includes("docs.")) {
        label = lang === "id" ? "📚 Dokumentasi Resmi" : "📚 Official Docs";
      } else if (lower.includes("github.com")) {
        label = lang === "id" ? "🐙 Repositori GitHub" : "🐙 GitHub Repo";
      } else {
        try {
          const domain = new URL(url).hostname.replace(/^www\./, "");
          label = lang === "id" ? `↗ Buka ${domain}` : `↗ Open ${domain}`;
        } catch {
          label = lang === "id" ? "↗ Dokumentasi & Panduan" : "↗ Documentation & Guide";
        }
      }

      foundLinks.push({ label, url });
    }

    // Ensure link labels are 100% unique so buttons never duplicate
    const labelCounts = new Map<string, number>();
    const uniqueLinks = foundLinks.map((item) => {
      const count = labelCounts.get(item.label) || 0;
      labelCounts.set(item.label, count + 1);
      if (count > 0) {
        return {
          ...item,
          label: `${item.label} (${count + 1})`,
        };
      }
      return item;
    });

    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("http"))
      .map((l) => {
        if (/^otp code from here\s*:?$/i.test(l)) {
          return lang === "id"
            ? "🔑 Kode OTP: Akses langsung via tombol 'Ambil Kode OTP' di bawah."
            : "🔑 OTP Code: Access directly via the button below.";
        }
        if (/^how to use\s*:?$/i.test(l)) {
          return lang === "id"
            ? "▶ Video Panduan: Tonton langkah lengkap via tombol video di bawah."
            : "▶ Video Guide: Watch complete walkthrough via button below.";
        }
        return l;
      });

    return {
      cleanText: lines.join("\n"),
      links: uniqueLinks,
    };
  }, [product, lang]);

  if (!product) return null;

  const deliveryLabel = product.requires_email
    ? t.deliveryTypes.custom_email
    : product.delivery_type === "custom_email"
      ? t.deliveryTypes.custom_email
      : t.deliveryTypes.instant;

  const currentGrossAmount = dynamicQr?.grossAmount ?? totalCalculatedAmount;
  const displayFormattedPrice = dynamicQr?.isTest
    ? "Rp 1 (Tes)"
    : new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(currentGrossAmount);

  // WhatsApp manual inquiry link
  const waInquiryMessage = encodeURIComponent(
    lang === "id"
      ? `Halo Admin Octane (Hafidz Prasetya),\nSaya ingin menanyakan produk:\n• Nama: ${product.name}\n• ID: #${product.id}\n• Jumlah: ${quantity} unit\n• Total: Rp ${totalCalculatedAmount.toLocaleString("id-ID")}\nMohon info detailnya. Terima kasih!`
      : `Hello Octane Support,\nI have a question about:\n• Product: ${product.name}\n• Quantity: ${quantity}\nThank you!`
  );
  const waInquiryLink = `https://wa.me/6281325081046?text=${waInquiryMessage}`;

  // WhatsApp success claim link
  const waSuccessMessage = encodeURIComponent(
    lang === "id"
      ? `Halo Admin Octane (Hafidz),\nSaya sudah melunasi pesanan:\n• Order ID: #${dynamicQr?.orderId || "OCT-ORDER"}\n• Produk: ${product.name}\n• Jumlah: ${quantity} unit\n• Total: ${displayFormattedPrice}\n${fulfillmentMeta?.pendingCount && fulfillmentMeta.pendingCount > 0 ? `• Status: ${fulfillmentMeta.deliveredCount || 0} akun sudah diterima di layar, mohon serah terima sisa ${fulfillmentMeta.pendingCount} akun lagi.\n` : ""}Mohon konfirmasinya. Terima kasih!`
      : `Hello Octane Support,\nOrder #${dynamicQr?.orderId} for ${quantity}x ${product.name} has been paid.`
  );
  const waSuccessLink = `https://wa.me/6281325081046?text=${waSuccessMessage}`;

  const isGemini = product.name.toLowerCase().includes("gemini");
  const isUsingDynamicMidtrans = Boolean(dynamicQr && dynamicQr.isDynamic);
  const activeQrSrc = localQrDataUrl || dynamicQr?.qrDataUrl || dynamicQr?.qrUrl || "/qris-pempek-wong-kito.png";

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `Octane: ${product.name} (Qty: ${quantity}x, Total: Rp ${totalCalculatedAmount.toLocaleString("id-ID")}, ${product.duration_label})`
    );
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyNominal = () => {
    navigator.clipboard.writeText(String(currentGrossAmount));
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2000);
  };

  const getProductShareUrl = () => {
    if (typeof window === "undefined") return `https://octane.web.id/?p=${product.id}`;
    return `${window.location.origin}/?p=${encodeURIComponent(product.id)}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getProductShareUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === "checkout"
          ? (lang === "id" ? "Pembayaran QRIS Dinamis" : "Dynamic QRIS Payment")
          : step === "success"
            ? (lang === "id" ? "Aktivasi Produk Berhasil" : "Product Activation Ready")
            : product.name
      }
      description={
        step === "checkout"
          ? `${product.name} (${quantity} unit) · ${displayFormattedPrice}`
          : step === "success"
            ? `Order ID: ${dynamicQr?.orderId || "OCT-PAID"} · ${quantity} Akun Lunas`
            : `${t.categoryLabel}: ${localizeCategory(product.category, lang)} · ${t.idLabel}: #${product.id}`
      }
      className="max-w-2xl"
    >
      <div className="space-y-6 pt-1">
        {/* ===================================================================
            STEP 1: PRODUCT DETAIL & QUANTITY SELECTOR
        =================================================================== */}
        {step === "detail" && (
          <div className="space-y-6">
            {/* Top Product Hero & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              {/* Product Thumbnail */}
              <div className="sm:col-span-5 aspect-video sm:aspect-square w-full rounded-xl overflow-hidden bg-muted/40 border border-border/40 relative">
                <img
                  src={product.display_image || createBrandVectorBadge(product.name, product.category)}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = createBrandVectorBadge(product.name, product.category);
                  }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <div className="bg-background/95 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-foreground">
                    {localizeDuration(product.duration_label, lang)}
                  </div>
                  {isGemini && (
                    <span className="bg-primary text-primary-foreground font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                      🔥 {lang === "id" ? "BEST SELLER" : "HOT"}
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {isVerifyingStock && liveStock === null ? (
                      <div className="h-5 w-20 rounded-full bg-muted/60 animate-pulse" />
                    ) : (
                      <Badge
                        variant={currentInStock ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {currentInStock
                          ? `${tCat.ready} (${currentStock})`
                          : tCat.outOfStock}
                      </Badge>
                    )}
                    {product.price_usd && (
                      <span className="text-xs font-mono text-muted-foreground">
                        ${product.price_usd} USD / unit
                      </span>
                    )}
                  </div>

                  <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-primary">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(totalCalculatedAmount)}
                    {quantity > 1 && (
                      <span className="text-xs font-normal text-muted-foreground ml-2">
                        (@ Rp {unitPrice.toLocaleString("id-ID")})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.priceNote}
                  </p>
                </div>

                {/* 3-Specs Grid */}
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-2.5 rounded-lg bg-muted/30 p-2.5 border border-border/30 text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground mr-1.5">{t.warranty}:</span>
                      <span className="font-semibold">{localizeWarranty(product.warranty_label, lang)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-lg bg-muted/30 p-2.5 border border-border/30 text-foreground">
                    <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="truncate">
                      <span className="text-muted-foreground mr-1.5">{t.delivery}:</span>
                      <span className="font-medium">{deliveryLabel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-lg bg-muted/30 p-2.5 border border-border/30 text-foreground">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground mr-1.5">{t.duration}:</span>
                      <span className="font-semibold">{localizeDuration(product.duration_label, lang)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector Box (Supports 1, 5, 10, etc.) */}
            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-foreground block">
                    {lang === "id" ? "Jumlah Pembelian (Quantity)" : "Purchase Quantity"}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {isVerifyingStock && liveStock === null ? (
                      <span className="inline-block h-3.5 w-28 bg-muted/60 rounded animate-pulse" />
                    ) : (
                      lang === "id"
                        ? `Stok tersedia: ${currentStock} akun`
                        : `Available stock: ${currentStock} accounts`
                    )}
                  </span>
                </div>

                {/* Stepper (- / +) */}
                <div className="flex items-center gap-1.5 bg-muted/60 border border-border/60 rounded-full p-1 shadow-xs">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Kurangi jumlah"
                    className="h-8 w-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, currentStock)}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(Math.max(1, val), currentStock || 99));
                    }}
                    aria-label="Jumlah item"
                    className="w-12 text-center text-sm font-bold font-mono bg-transparent text-foreground focus:outline-none"
                  />

                  <button
                    type="button"
                    disabled={quantity >= currentStock}
                    onClick={() => setQuantity((q) => Math.min(currentStock || 99, q + 1))}
                    aria-label="Tambah jumlah"
                    className="h-8 w-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick quantity shortcuts */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[1, 5, 10, 20, 50].map((qty) => {
                  if (qty > currentStock) return null;
                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setQuantity(qty)}
                      className={`px-3 py-1 rounded-full text-xs font-mono font-medium border transition-colors cursor-pointer ${quantity === qty
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                        }`}
                    >
                      {qty}x
                    </button>
                  );
                })}
                {currentStock > 1 && (
                  <button
                    type="button"
                    onClick={() => setQuantity(currentStock)}
                    className="px-3 py-1 rounded-full text-xs font-mono font-medium border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  >
                    {lang === "id" ? `Semua (${currentStock})` : `Max (${currentStock})`}
                  </button>
                )}
              </div>

              {/* Wholesale Active Banner */}
              {activeTier && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg font-medium border border-emerald-500/20">
                  <Sparkles className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {lang === "id"
                      ? `Harga Grosir Aktif! Hemat Rp ${(discountPerUnit * quantity).toLocaleString("id-ID")} untuk pesanan ${quantity} akun.`
                      : `Wholesale Active! You save Rp ${(discountPerUnit * quantity).toLocaleString("id-ID")} on ${quantity} accounts.`}
                  </span>
                </div>
              )}
            </div>

            {/* Email activation field if required */}
            {product.requires_email && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{lang === "id" ? "Email Akun Anda untuk Aktivasi (Wajib)" : "Activation Email (Required)"}</span>
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="contoh: nama@gmail.com"
                  className="w-full h-10 px-3.5 rounded-lg border border-border/60 bg-card text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <p className="text-[11px] text-muted-foreground">
                  {lang === "id"
                    ? "Undangan aktivasi resmi akan dikirimkan ke email ini setelah pembayaran."
                    : "Official activation invite will be bound to this email after payment."}
                </p>
              </div>
            )}

            {/* Description & Guide */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {t.descriptionTitle}
              </h4>
              <div className="rounded-xl bg-muted/20 p-4 border border-border/30 text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans max-h-36 overflow-y-auto">
                {parsedContent.cleanText}
              </div>

              {parsedContent.links.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {parsedContent.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions: Checkout Button with Quantity & Total Price */}
            <div className="space-y-3 pt-3 border-t border-border/40">
              <Button
                onClick={handleProceedToCheckout}
                disabled={!currentInStock || (product.requires_email && !userEmail.includes("@"))}
                className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>
                  {currentInStock
                    ? (lang === "id"
                      ? `Lanjut Pembayaran — Rp ${totalCalculatedAmount.toLocaleString("id-ID")} (${quantity} Akun)`
                      : `Proceed to Payment — Rp ${totalCalculatedAmount.toLocaleString("id-ID")} (${quantity} Items)`)
                    : tCat.outOfStock}
                </span>
              </Button>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 hover:text-foreground text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">{lang === "id" ? "Link Tersalin!" : "Link Copied!"}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5 text-primary" />
                        <span className="text-foreground">{lang === "id" ? "Salin Link Produk" : "Copy Product Link"}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 hover:text-foreground text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{t.copySummary}</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={waInquiryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground text-[11px] inline-flex items-center gap-1 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{lang === "id" ? "Tanya via WA" : "Inquire via WhatsApp"}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 2: CHECKOUT VIEW (Scan QRIS with Auto-Amount Locked for N units)
        =================================================================== */}
        {step === "checkout" && (
          <div className="space-y-4">
            {/* Top Navigation & Status */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("detail")}
                className="inline-flex items-center gap-1.5 py-1 px-2 -ml-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{lang === "id" ? "Ubah Pesanan" : "Edit Order"}</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{lang === "id" ? "Menunggu Pembayaran" : "Awaiting Payment"}</span>
              </div>
            </div>

            {/* Order Summary Strip */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/50">
              <div className="min-w-0 pr-3">
                <h4 className="font-semibold text-foreground text-sm truncate">{product.name}</h4>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-muted/80 text-[10px] font-mono text-muted-foreground">
                    {quantity} Akun
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-muted/80 text-[10px] font-mono text-muted-foreground">
                    {product.duration_label}
                  </span>
                  {dynamicQr?.isTest && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-medium">
                      Uji Coba Rp 1
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-muted-foreground">Total Tagihan</div>
                <div className="text-base sm:text-lg font-bold font-mono text-primary flex items-center gap-1 justify-end">
                  <span>{displayFormattedPrice}</span>
                  <button
                    type="button"
                    onClick={handleCopyNominal}
                    title="Salin Angka Nominal"
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {copiedNominal ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Card Container */}
            <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 flex flex-col items-center justify-center shadow-xs">
              <div className="relative bg-white rounded-2xl p-3.5 shadow-sm border border-zinc-200 w-56 sm:w-60 aspect-square flex flex-col items-center justify-center">
                {isLoadingQr ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-zinc-700 text-xs font-medium">
                    <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                    <span>Membuat QRIS Dinamis...</span>
                  </div>
                ) : (
                  <img
                    src={activeQrSrc}
                    alt="QRIS Pembayaran"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="text-center mt-2.5 space-y-1">
                <div className="text-xs font-semibold text-foreground tracking-wide">
                  {isUsingDynamicMidtrans ? "QRIS DINAMIS MIDTRANS" : "PEMPEK 'ASLI' WONG KITO"}
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {isUsingDynamicMidtrans ? `Order ID: ${dynamicQr?.orderId}` : "NMID: ID1025384010373"}
                </div>
                <p className="text-[10px] text-muted-foreground/80 max-w-[280px] mx-auto text-center leading-tight">
                  {lang === "id"
                    ? "Merchant Terdaftar BI: Pempek 'Asli' Wong Kito (Unit Usaha Resmi Octane Store)."
                    : "Registered BI Merchant: Pempek 'Asli' Wong Kito (Official Octane Unit)."}
                </p>
              </div>

              {/* Action buttons under QR */}
              <div className="flex items-center gap-2 mt-3.5">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs h-8 px-3.5 cursor-pointer"
                >
                  <a href={activeQrSrc} download={`QRIS-Octane-${dynamicQr?.orderId || "Order"}.png`}>
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    <span>Unduh QRIS</span>
                  </a>
                </Button>

                {typeof window !== "undefined" && window.location.search.includes("dev=true") && (
                  dynamicQr?.isTest ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRevertToNormalPrice}
                      className="rounded-full text-xs h-8 px-3 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                      title="Kembalikan ke nominal pesanan asli"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      <span>Kembali Normal</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleTestOneRupiah}
                      className="rounded-full text-xs h-8 px-3 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer font-mono"
                      title="Mode Pengembang: Test Scan Rp 1"
                    >
                      <span>Dev: Rp 1</span>
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Payment Steps Guidance */}
            <div className="rounded-xl bg-muted/40 p-3.5 space-y-2 border border-border/40 text-xs text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{lang === "id" ? "Panduan Pembayaran Instan" : "Instant Payment Guide"}</span>
              </div>
              <div className="space-y-1 pl-1">
                <p>1. {lang === "id" ? <>Buka <strong>m-Banking</strong> atau <strong>E-Wallet</strong> favorit Anda.</> : <>Open your preferred <strong>m-Banking</strong> or <strong>E-Wallet</strong> app.</>}</p>
                <p>2. {lang === "id" ? "Scan barcode QRIS di atas (nominal langsung terisi otomatis)." : "Scan the QRIS code above (amount is pre-filled automatically)."}</p>
                <p>3. {lang === "id" ? `Masukkan PIN Anda. Begitu pembayaran sukses, layar ini seketika menyerahkan ${quantity > 1 ? `${quantity} detail akun / lisensi resmi` : "detail akun / lisensi resmi"} Anda secara instan.` : `Enter your PIN. Once payment is confirmed, this screen will instantly deliver your ${quantity > 1 ? `${quantity} account credentials / official licenses` : "official account / license credentials"}.`}</p>
              </div>
            </div>

            {/* WhatsApp Assistance */}
            <div className="text-center pt-0.5 text-xs text-muted-foreground">
              <span>Butuh bantuan pembayaran? </span>
              <a
                href={waInquiryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle className="h-3 w-3 inline" />
                <span>Bantuan Admin WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 3: SUCCESS VIEW (Instant License Delivery for 1 or Many Links)
        =================================================================== */}
        {step === "success" && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 sm:p-7 text-center space-y-5">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-9 w-9 text-emerald-500" />
            </div>

            <div>
              <h3 className="text-2xl font-bold font-display text-foreground">
                {lang === "id" ? "Pembayaran Berhasil! (Lunas)" : "Payment Received!"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Order ID: {dynamicQr?.orderId || "OCT-PAID"} · {quantity} Akun Lunas
              </p>
            </div>

            {fulfillmentMeta && fulfillmentMeta.pendingCount && fulfillmentMeta.pendingCount > 0 ? (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-left text-xs space-y-1.5">
                <div className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>
                    {lang === "id"
                      ? `${fulfillmentMeta.deliveredCount || 0} Akun Aktif Langsung! Sisa ${fulfillmentMeta.pendingCount} akun siap diserahkan Admin.`
                      : `${fulfillmentMeta.deliveredCount || 0} Account(s) Ready! Remaining ${fulfillmentMeta.pendingCount} being allocated by Admin.`}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {lang === "id"
                    ? "Pembayaran Anda telah lunas 100%. Anda dapat langsung menggunakan akun di atas. Untuk serah terima sisa akun, klik tombol WhatsApp di bawah."
                    : "Payment received in full. You can use the active account above right now. For the remaining accounts, click WhatsApp below."}
                </p>
              </div>
            ) : null}

            {/* Activation Links Box (Supports 1 or Multiple Accounts) */}
            <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 text-left space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-foreground uppercase tracking-wider">
                  {lang === "id"
                    ? `Tautan Aktivasi (${activationUrls.length || quantity} Akun Siap Pakai):`
                    : `Activation Links (${activationUrls.length || quantity} Accounts Ready):`}
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  {activationUrls.length || quantity}x LISENSI RESMI
                </span>
              </div>

              {/* List of Links */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(activationUrls.length > 0 ? activationUrls : [activationUrl || "https://serviceactivation.google.com/subscription/new/OCTANE-ACTIVE"]).map((url, idx) => (
                  <div key={idx} className="rounded-lg bg-muted/60 p-2.5 flex items-center justify-between gap-2 border border-border/40 text-xs font-mono">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-muted-foreground font-bold flex-shrink-0">#{idx + 1}</span>
                      <span className="text-primary truncate">{url}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {url.startsWith("http") && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Buka Link Ini"
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(url);
                          setCopiedIndex(idx);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                        title={url.startsWith("http") ? "Salin Link Ini" : "Salin Kredensial Ini"}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {lang === "id"
                  ? "Buka atau bagikan tautan aktivasi di atas ke masing-masing pengguna/email."
                  : "Open or share the activation links above to each respective user/email."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              {activationUrls.length <= 1 && (activationUrls[0] || activationUrl || "").startsWith("http") ? (
                <Button
                  asChild
                  className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-sm cursor-pointer"
                >
                  <a
                    href={activationUrls[0] || activationUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{lang === "id" ? "Buka Link Aktivasi Sekarang" : "Open Activation Link"}</span>
                  </a>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const text = (activationUrls.length > 0 ? activationUrls : [activationUrl || ""]).map((u, i) => `#${i + 1}: ${u}`).join("\n");
                    navigator.clipboard.writeText(text);
                    setCopiedAll(true);
                    setTimeout(() => setCopiedAll(false), 2000);
                  }}
                  className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {copiedAll ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{lang === "id" ? "Semua Berhasil Tersalin!" : "All Copied!"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>{lang === "id" ? "Salin Data Akun / Lisensi" : "Copy Account / License Data"}</span>
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Support footer */}
            <div className="pt-2 text-xs text-muted-foreground border-t border-border/40 flex items-center justify-between">
              <span>{lang === "id" ? (fulfillmentMeta && fulfillmentMeta.pendingCount && fulfillmentMeta.pendingCount > 0 ? "Klaim sisa akun ke Admin:" : "Ada pertanyaan aktivasi?") : "Need activation help?"}</span>
              <a
                href={waSuccessLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1.5"
              >
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                <span>{lang === "id" ? (fulfillmentMeta && fulfillmentMeta.pendingCount && fulfillmentMeta.pendingCount > 0 ? `Klaim Sisa ${fulfillmentMeta.pendingCount} Akun via WhatsApp` : "Bantuan Admin WhatsApp") : "WhatsApp Support"}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
