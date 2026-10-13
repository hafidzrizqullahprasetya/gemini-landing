import { useState, useMemo, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { EnrichedProduct } from "@/services/venteApi";
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
  QrCode,
  CreditCard,
  Mail,
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
  const [userEmail, setUserEmail] = useState("");

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [copiedActivation, setCopiedActivation] = useState(false);

  const [liveStock, setLiveStock] = useState<{ stock: number; inStock: boolean } | null>(null);
  const [isVerifyingStock, setIsVerifyingStock] = useState(false);

  // Midtrans Dynamic QR state
  const [dynamicQr, setDynamicQr] = useState<DynamicQrData | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [activationUrl, setActivationUrl] = useState<string | null>(null);

  const t = translations[lang].modal;
  const tCat = translations[lang].catalog;

  // Reset states when modal is opened or product changes
  useEffect(() => {
    if (!product || !isOpen) {
      setStep("detail");
      setLiveStock(null);
      setDynamicQr(null);
      setActivationUrl(null);
      setUserEmail("");
      return;
    }

    setStep("detail");
    setActivationUrl(null);

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

  // Request QRIS charge when entering checkout step
  const handleProceedToCheckout = () => {
    if (!product) return;
    setStep("checkout");

    if (!dynamicQr || dynamicQr.grossAmount !== product.price_idr || dynamicQr.isTest) {
      setIsLoadingQr(true);
      fetch("/api/octane/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          grossAmount: product.price_idr,
          isTest: false,
          email: userEmail.trim() || undefined,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.qrUrl) {
            setDynamicQr({
              qrUrl: data.qrUrl,
              qrString: data.qrString,
              orderId: data.orderId,
              grossAmount: data.grossAmount,
              isDynamic: true,
              isTest: false,
            });
          } else {
            setDynamicQr({
              isDynamic: false,
              message: data?.message,
            });
          }
        })
        .catch(() => {
          setDynamicQr({ isDynamic: false });
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
    fetch("/api/octane/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        grossAmount: 1,
        isTest: true,
        email: userEmail.trim() || undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.qrUrl) {
          setDynamicQr({
            qrUrl: data.qrUrl,
            qrString: data.qrString,
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

  // Real-time EventSource Stream: 0 Polling, 0 Spam, Instant Webhook Push
  useEffect(() => {
    if (!dynamicQr?.orderId || step === "success" || !isOpen) return;

    let isMounted = true;
    const streamUrl = `/api/octane/payment-stream/${dynamicQr.orderId}?productId=${product?.id || ""}`;
    const es = new EventSource(streamUrl);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.isSettled && isMounted) {
          setActivationUrl(data.activationUrl || null);
          setStep("success");
          es.close();
        }
      } catch { }
    };

    es.onerror = () => {
      // Graceful fallback check after 4s if SSE drops
      setTimeout(() => {
        if (!isMounted) return;
        fetch(`/api/octane/payment-status/${dynamicQr.orderId}?productId=${product?.id || ""}`)
          .then((r) => r.json())
          .then((d) => {
            if (d && d.isSettled && isMounted) {
              setActivationUrl(d.activationUrl || null);
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
  }, [dynamicQr?.orderId, step, isOpen, product]);

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
      let label = lang === "id" ? "Dokumentasi & Panduan" : "Documentation & Guide";
      if (url.includes("google.com/document")) label = lang === "id" ? "Panduan Setup (Google Doc)" : "Setup Guide (Google Doc)";
      else if (url.includes("miraiapi")) label = lang === "id" ? "Portal Aktivasi API" : "API Activation Portal";
      else if (url.includes("docs")) label = lang === "id" ? "Dokumentasi Resmi" : "Official Docs";

      if (!foundLinks.some((l) => l.url === url)) {
        foundLinks.push({ label, url });
      }
    }

    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("http"));

    return {
      cleanText: lines.join("\n"),
      links: foundLinks,
    };
  }, [product, lang]);

  if (!product) return null;

  const currentStock = liveStock !== null ? liveStock.stock : product.stock;
  const currentInStock = liveStock !== null ? liveStock.inStock : product.is_in_stock;

  const deliveryLabel = product.requires_email
    ? t.deliveryTypes.custom_email
    : product.delivery_type === "custom_email"
      ? t.deliveryTypes.custom_email
      : t.deliveryTypes.instant;

  const currentGrossAmount = dynamicQr?.grossAmount ?? product.price_idr;
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
      ? `Halo Admin Octane (Hafidz Prasetya),\nSaya ingin menanyakan produk:\n• Nama: ${product.name}\n• ID: #${product.id}\n• Harga: ${product.formatted_price}\nMohon info detailnya. Terima kasih!`
      : `Hello Octane Support,\nI have a question about:\n• Product: ${product.name}\n• ID: #${product.id}\nThank you!`
  );
  const waInquiryLink = `https://wa.me/6281325081046?text=${waInquiryMessage}`;

  const isGemini = product.name.toLowerCase().includes("gemini");
  const isUsingDynamicMidtrans = Boolean(dynamicQr && dynamicQr.isDynamic && dynamicQr.qrUrl);
  const activeQrSrc = isUsingDynamicMidtrans
    ? dynamicQr!.qrUrl!
    : "/qris-pempek-wong-kito.png";

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `Octane: ${product.name} (ID: #${product.id}, ${product.formatted_price}, ${product.duration_label})`
    );
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyNominal = () => {
    navigator.clipboard.writeText(String(currentGrossAmount));
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2000);
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
          ? `${product.name} · ${displayFormattedPrice}`
          : step === "success"
            ? `Order ID: ${dynamicQr?.orderId || "OCT-PAID"} · Lunas`
            : `${t.categoryLabel}: ${localizeCategory(product.category, lang)} · ${t.idLabel}: #${product.id}`
      }
      className="max-w-2xl"
    >
      <div className="space-y-6 pt-1">
        {/* ===================================================================
            STEP 1: PRODUCT DETAIL VIEW (Clear overview before payment)
        =================================================================== */}
        {step === "detail" && (
          <div className="space-y-6">
            {/* Top Product Hero & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              {/* Product Thumbnail */}
              <div className="sm:col-span-5 aspect-video sm:aspect-square w-full rounded-xl overflow-hidden bg-muted/40 border border-border/40 relative">
                <img
                  src={product.display_image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <div className="bg-background/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-foreground">
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
                    <Badge
                      variant={currentInStock ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {currentInStock
                        ? `${tCat.ready} (${currentStock})`
                        : tCat.outOfStock}
                    </Badge>
                    {product.price_usd && (
                      <span className="text-xs font-mono text-muted-foreground">
                        ${product.price_usd} USD
                      </span>
                    )}
                    {isVerifyingStock && (
                      <span className="text-[10px] font-mono text-muted-foreground animate-pulse">
                        Live Sync...
                      </span>
                    )}
                  </div>

                  <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-primary">
                    {product.formatted_price}
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

            {/* Wholesale Tiers (if available) */}
            {product.price_tiers && product.price_tiers.length > 0 && (
              <div className="rounded-xl border border-border/40 p-4 bg-muted/20">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground mb-2.5">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>{t.wholesaleTitle}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {product.price_tiers.map(
                    (
                      tier: { min_qty: number; max_qty: number; price_usd: number },
                      idx: number
                    ) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-card p-2.5 text-center border border-border/40"
                      >
                        <p className="text-muted-foreground text-[11px]">
                          Qty {tier.min_qty}–{tier.max_qty}
                        </p>
                        <p className="font-bold text-primary mt-0.5">
                          ${tier.price_usd} USD
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Description & Guide */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {t.descriptionTitle}
              </h4>
              <div className="rounded-xl bg-muted/20 p-4 border border-border/30 text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans max-h-40 overflow-y-auto">
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

            {/* Bottom Actions: Clear Checkout Button */}
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
                      ? `Lanjut Pembayaran — ${product.formatted_price}`
                      : `Proceed to Payment — ${product.formatted_price}`)
                    : tCat.outOfStock}
                </span>
              </Button>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
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
                <a
                  href={waInquiryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground text-[11px] inline-flex items-center gap-1 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{lang === "id" ? "Tanya via WhatsApp" : "Inquire via WhatsApp"}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 2: CHECKOUT VIEW (Scan QRIS with Auto-Amount Locked)
        =================================================================== */}
        {step === "checkout" && (
          <div className="space-y-5">
            {/* Back to detail button */}
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setStep("detail")}
                className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{lang === "id" ? "Kembali ke Detail Produk" : "Back to Details"}</span>
              </button>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{lang === "id" ? "Menunggu Pembayaran..." : "Awaiting Payment..."}</span>
              </div>
            </div>

            {/* QRIS Card Box */}
            <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                {/* QR Code Graphic */}
                <div className="w-52 sm:w-56 flex-shrink-0 rounded-xl overflow-hidden border border-border/50 bg-white p-2.5 shadow-xs relative">
                  {isLoadingQr && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center text-xs font-mono text-zinc-700 gap-1.5">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                      <span>Membuat QRIS...</span>
                    </div>
                  )}
                  <img
                    src={activeQrSrc}
                    alt="QRIS Pembayaran"
                    className="w-full h-auto object-contain"
                  />
                  <div className="text-center pt-2 pb-0.5">
                    <span className="text-[10px] font-mono text-zinc-700 font-bold block">
                      {isUsingDynamicMidtrans
                        ? "QRIS DINAMIS MIDTRANS"
                        : "PEMPEK 'ASLI' WONG KITO"}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 block">
                      {isUsingDynamicMidtrans
                        ? `ORDER: ${dynamicQr?.orderId}`
                        : "NMID: ID1025384010373"}
                    </span>
                  </div>
                </div>

                {/* Instructions & Amount */}
                <div className="flex-1 space-y-3.5 text-center sm:text-left">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-muted-foreground block">
                      {lang === "id" ? "Nominal Terkunci Otomatis di HP:" : "Exact Amount Locked in App:"}
                    </span>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-primary">
                        {displayFormattedPrice}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyNominal}
                        title="Salin Angka Nominal"
                        className="p-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-mono transition-colors cursor-pointer"
                      >
                        {copiedNominal ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                    <p className="flex items-start gap-2 justify-center sm:justify-start">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>
                        {lang === "id"
                          ? "Buka m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, OVO, Dana, ShopeePay)."
                          : "Open your bank or e-wallet app and scan the QR code above."}
                      </span>
                    </p>
                    <p className="flex items-start gap-2 justify-center sm:justify-start">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>
                        {lang === "id"
                          ? "Nominal akan langsung terisi otomatis. Masukkan PIN Anda untuk menyelesaikan pembayaran."
                          : "Amount is auto-locked. Just enter your PIN to confirm payment."}
                      </span>
                    </p>
                    <p className="flex items-start gap-2 justify-center sm:justify-start text-foreground font-medium bg-muted/40 p-2 rounded-lg">
                      <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        {lang === "id"
                          ? "Layar ini akan otomatis berganti ke halaman link aktivasi setelah pembayaran selesai."
                          : "This screen will automatically switch to your activation link once paid."}
                      </span>
                    </p>
                  </div>

                  {/* Helpers: Download & Test Rp 1 */}
                  <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs font-mono"
                    >
                      <a href={activeQrSrc} download={`QRIS-Octane-${dynamicQr?.orderId || "Order"}.png`}>
                        <Download className="h-3.5 w-3.5 mr-1" />
                        <span>Download QRIS</span>
                      </a>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleTestOneRupiah}
                      className="rounded-full text-xs font-mono text-muted-foreground hover:text-foreground"
                      title="Tes scan nominal Rp 1 untuk verifikasi mutasi rekening"
                    >
                      <Sparkles className="h-3 w-3 mr-1 text-primary" />
                      <span>Tes Scan Rp 1</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Support Link */}
            <div className="text-center pt-1 text-xs text-muted-foreground">
              <span>{lang === "id" ? "Mengalami kendala scan?" : "Having scan issues?"} </span>
              <a
                href={waInquiryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                {lang === "id" ? "Bantuan Admin WhatsApp" : "WhatsApp Support"}
              </a>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 3: SUCCESS VIEW (Instant License & Link Delivery)
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
                Order ID: {dynamicQr?.orderId || "OCT-PAID"} · {displayFormattedPrice}
              </p>
            </div>

            {/* Activation Link Box */}
            <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 text-left space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-foreground uppercase tracking-wider">
                  {lang === "id" ? "Tautan Aktivasi Akun Anda:" : "Your Account Activation Link:"}
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  SIAP DIAKTIVASI
                </span>
              </div>

              <div className="rounded-lg bg-muted/60 p-3 font-mono text-xs text-primary break-all border border-border/40 select-all">
                {activationUrl || "https://serviceactivation.google.com/subscription/new/OCTANE-ACTIVE"}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {lang === "id"
                  ? "Klik tombol di bawah untuk langsung membuka tautan aktivasi resmi ke email/akun Google kamu."
                  : "Click the button below to directly open your official activation page."}
              </p>
            </div>

            {/* Buttons: Direct Open & Copy */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button
                asChild
                className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-sm cursor-pointer"
              >
                <a
                  href={activationUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>{lang === "id" ? "Buka Link Aktivasi Sekarang" : "Open Activation Link"}</span>
                </a>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (activationUrl) {
                    navigator.clipboard.writeText(activationUrl);
                    setCopiedActivation(true);
                    setTimeout(() => setCopiedActivation(false), 2000);
                  }
                }}
                className="h-12 px-6 rounded-full font-mono text-xs cursor-pointer"
              >
                {copiedActivation ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500 mr-1.5" />
                    <span className="text-emerald-500">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </Button>
            </div>

            {/* Support footer */}
            <div className="pt-2 text-xs text-muted-foreground border-t border-border/40 flex items-center justify-between">
              <span>{lang === "id" ? "Ada pertanyaan aktivasi?" : "Need activation help?"}</span>
              <a
                href={waInquiryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Bantuan WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
