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
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [activeTab, setActiveTab] = useState<"qris" | "wa">("qris");
  const [liveStock, setLiveStock] = useState<{ stock: number; inStock: boolean } | null>(null);
  const [isVerifyingStock, setIsVerifyingStock] = useState(false);

  // Midtrans Dynamic QR state
  const [dynamicQr, setDynamicQr] = useState<DynamicQrData | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [paymentSettled, setPaymentSettled] = useState(false);
  const [activationUrl, setActivationUrl] = useState<string | null>(null);
  const [copiedActivation, setCopiedActivation] = useState(false);

  const t = translations[lang].modal;
  const tCat = translations[lang].catalog;

  // Real-time stock check upon opening modal
  useEffect(() => {
    if (!product || !isOpen) {
      setLiveStock(null);
      setDynamicQr(null);
      setPaymentSettled(false);
      setActivationUrl(null);
      return;
    }

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

    // Auto-fetch Midtrans Dynamic QRIS
    setIsLoadingQr(true);
    fetch("/api/octane/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        grossAmount: product.price_idr,
        isTest: false,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
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
        }
      })
      .catch(() => {
        if (isMounted) setDynamicQr({ isDynamic: false });
      })
      .finally(() => {
        if (isMounted) setIsLoadingQr(false);
      });

    return () => {
      isMounted = false;
    };
  }, [product, isOpen]);

  // Real-time EventSource Stream: 0 Polling, 0 Request Spam, Instant Push from Midtrans Webhook
  useEffect(() => {
    if (!dynamicQr?.orderId || paymentSettled || !isOpen) return;

    let isMounted = true;
    const streamUrl = `/api/octane/payment-stream/${dynamicQr.orderId}?productId=${product?.id || ""}`;
    const es = new EventSource(streamUrl);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.isSettled && isMounted) {
          setPaymentSettled(true);
          setActivationUrl(data.activationUrl || null);
          es.close();
        }
      } catch { }
    };

    es.onerror = () => {
      // Fallback: 1 single check if stream drops
      setTimeout(() => {
        if (!isMounted || paymentSettled) return;
        fetch(`/api/octane/payment-status/${dynamicQr.orderId}?productId=${product?.id || ""}`)
          .then((r) => r.json())
          .then((d) => {
            if (d && d.isSettled && isMounted) {
              setPaymentSettled(true);
              setActivationUrl(d.activationUrl || null);
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
  }, [dynamicQr?.orderId, paymentSettled, isOpen, product]);
  const handleTestOneRupiah = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsLoadingQr(true);
    setPaymentSettled(false);
    setActivationUrl(null);
    fetch("/api/octane/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        grossAmount: 1,
        isTest: true,
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
  const displayFormattedPrice =
    dynamicQr?.isTest
      ? "Rp 1 (Tes)"
      : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(currentGrossAmount);

  // WhatsApp Messages
  const waQrisConfirmMessage = encodeURIComponent(
    lang === "id"
      ? `Halo Admin Octane (Hafidz Prasetya),\n` +
      `Saya telah melakukan scan & bayar QRIS untuk pesanan:\n` +
      `• Produk: ${product.name}\n` +
      `• ID Produk: #${product.id}\n` +
      `• Order ID: ${dynamicQr?.orderId || "OCT-MANUAL"}\n` +
      `• Total Bayar: ${displayFormattedPrice}\n` +
      `• Durasi: ${product.duration_label}\n\n` +
      `Berikut saya lampirkan bukti transfernya. Mohon segera diproses kredensial akunnya. Terima kasih!`
      : `Hello Octane Support,\n` +
      `I have completed payment via QRIS for:\n` +
      `• Product: ${product.name}\n` +
      `• Product ID: #${product.id}\n` +
      `• Order ID: ${dynamicQr?.orderId || "OCT-MANUAL"}\n` +
      `• Total Amount: ${displayFormattedPrice}\n` +
      `• Duration: ${product.duration_label}\n\n` +
      `Attached is my payment proof. Please activate my account. Thank you!`
  );

  const waDirectMessage = encodeURIComponent(
    lang === "id"
      ? `Halo Admin Octane (Hafidz Prasetya),\n` +
      `Saya ingin memesan produk:\n` +
      `• Nama: ${product.name}\n` +
      `• ID Produk: #${product.id}\n` +
      `• Harga: ${product.formatted_price}${product.price_usd ? ` ($${product.price_usd} USD)` : ""}\n` +
      `• Durasi: ${product.duration_label}\n\n` +
      `Mohon info instruksi pembayarannya. Terima kasih!`
      : `Hello Octane Support,\n` +
      `I would like to order:\n` +
      `• Product: ${product.name}\n` +
      `• Product ID: #${product.id}\n` +
      `• Price: ${product.formatted_price}${product.price_usd ? ` ($${product.price_usd} USD)` : ""}\n` +
      `• Duration: ${product.duration_label}\n\n` +
      `Please provide the payment instructions. Thank you!`
  );

  const waQrisLink = `https://wa.me/6281325081046?text=${waQrisConfirmMessage}`;
  const waDirectLink = `https://wa.me/6281325081046?text=${waDirectMessage}`;

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

  const isGemini = product.name.toLowerCase().includes("gemini");
  const isUsingDynamicMidtrans = Boolean(dynamicQr && dynamicQr.isDynamic && dynamicQr.qrUrl);
  const activeQrSrc = isUsingDynamicMidtrans
    ? dynamicQr!.qrUrl!
    : "/qris-pempek-wong-kito.png";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      description={`${t.categoryLabel}: ${localizeCategory(product.category, lang)} · ${t.idLabel}: #${product.id}`}
      className="max-w-2xl"
    >
      <div className="space-y-6 pt-1">
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

            {/* Quick 3-Specs Grid */}
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

        {/* Payment Mode Selector: QRIS vs WhatsApp */}
        <div className="space-y-3 pt-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {lang === "id" ? "Pilih Jalur Pembayaran" : "Select Payment Method"}
            </h4>
            <div className="flex rounded-full bg-muted/60 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("qris")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${activeTab === "qris"
                  ? "bg-foreground text-background shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                ⚡ QRIS Otomatis
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("wa")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${activeTab === "wa"
                  ? "bg-foreground text-background shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                💬 Chat WhatsApp
              </button>
            </div>
          </div>

          {activeTab === "qris" ? (
            paymentSettled ? (
              /* SUCCESS VIEW: Instant Link Delivery */
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 sm:p-6 text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                    {lang === "id" ? "Pembayaran Berhasil! (Lunas)" : "Payment Successful!"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    Order ID: {dynamicQr?.orderId} · {displayFormattedPrice}
                  </p>
                </div>

                {/* Activation Link Box */}
                <div className="rounded-xl border border-border/70 bg-card p-4 text-left space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-foreground uppercase">
                      {lang === "id" ? "Tautan Aktivasi Akun Anda:" : "Your Account Activation Link:"}
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      SIAP DIAKTIVASI
                    </span>
                  </div>

                  <div className="rounded-lg bg-muted/60 p-2.5 font-mono text-xs text-primary break-all border border-border/40 select-all">
                    {activationUrl || "https://serviceactivation.google.com/subscription/new/OCTANE-ACTIVE"}
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                    {lang === "id"
                      ? "Klik tombol di bawah untuk langsung membuka tautan aktivasi resmi ke email/akun kamu."
                      : "Click the button below to directly redeem your official license to your email."}
                  </p>
                </div>

                {/* Buttons: Direct Link & Copy */}
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

                {/* Optional WhatsApp Support */}
                <div className="pt-2 text-xs text-muted-foreground border-t border-border/40 flex items-center justify-between">
                  <span>Ada pertanyaan aktivasi?</span>
                  <a
                    href={waQrisLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Bantuan WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              /* QRIS Card (Midtrans Dynamic QR with Wong Kito Backup) */
              <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                  {/* QR Code Graphic */}
                  <div className="w-48 sm:w-52 flex-shrink-0 rounded-xl overflow-hidden border border-border/50 bg-white p-2 shadow-xs relative">
                    {isLoadingQr && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center text-xs font-mono text-zinc-600 gap-1.5">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                        <span>Membuat QRIS...</span>
                      </div>
                    )}
                    <img
                      src={activeQrSrc}
                      alt="QRIS Pembayaran"
                      className="w-full h-auto object-contain"
                    />
                    <div className="text-center pt-1.5 pb-0.5">
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
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div>
                      <span className="text-[11px] font-mono uppercase text-muted-foreground block">
                        {isUsingDynamicMidtrans
                          ? "Nominal Terkunci Otomatis di HP Pembeli:"
                          : lang === "id"
                            ? "Nominal Transfer Pas:"
                            : "Exact Amount to Transfer:"}
                      </span>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                        <span className="text-2xl font-bold font-mono text-primary">
                          {displayFormattedPrice}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyNominal}
                          title="Salin Angka Nominal"
                          className="p-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-mono transition-colors cursor-pointer"
                        >
                          {copiedNominal ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1 leading-relaxed">
                      <p className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span>
                          {isUsingDynamicMidtrans
                            ? "Scan langsung: Nominal otomatis muncul di m-Banking/E-Wallet Anda"
                            : "Scan dengan BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay"}
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span>
                          {lang === "id"
                            ? "Setelah bayar, klik konfirmasi di bawah untuk aktivasi instan"
                            : "After paying, click confirm below for instant activation"}
                        </span>
                      </p>
                    </div>

                    {/* Action buttons: Download & Test 1 Rupiah */}
                    <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs font-mono"
                      >
                        <a href={activeQrSrc} download="QRIS-Octane.png">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          <span>Download QRIS</span>
                        </a>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleTestOneRupiah}
                        className="rounded-full text-xs font-mono text-muted-foreground hover:text-foreground"
                        title="Uji coba bayar Rp 1 untuk verifikasi mutasi rekening"
                      >
                        <Sparkles className="h-3 w-3 mr-1 text-primary" />
                        <span>Tes Scan Rp 1</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Confirm via WhatsApp Button */}
                <Button
                  asChild
                  className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm cursor-pointer"
                >
                  <a
                    href={waQrisLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>
                      {lang === "id"
                        ? "Konfirmasi Bukti Transfer via WhatsApp"
                        : "Confirm Payment via WhatsApp"}
                    </span>
                  </a>
                </Button>
              </div>
            )
          ) : (
            /* WhatsApp Direct Mode */
            <div className="space-y-3">
              <Button
                asChild
                className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm cursor-pointer"
              >
                <a
                  href={waDirectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{t.orderWhatsapp}</span>
                </a>
              </Button>
            </div>
          )}

          {/* Bottom helper */}
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
            <span className="font-mono text-[11px]">
              {isUsingDynamicMidtrans
                ? "Sistem: Midtrans Core API Dynamic"
                : "NMID: ID1025384010373 (Wong Kito)"}
            </span>
          </div>
        </div>

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

        {/* Product Description */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {t.descriptionTitle}
          </h4>
          <div className="rounded-xl bg-muted/20 p-4 border border-border/30 text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans max-h-40 overflow-y-auto">
            {parsedContent.cleanText}
          </div>

          {/* Guide Links */}
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
      </div>
    </Modal>
  );
}
