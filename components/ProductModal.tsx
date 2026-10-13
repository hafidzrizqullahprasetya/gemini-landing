import { useState, useMemo } from "react";
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
} from "lucide-react";

interface ProductModalProps {
  product: EnrichedProduct | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  lang = "id",
}: ProductModalProps) {
  const [copied, setCopied] = useState(false);
  const t = translations[lang].modal;

  const parsedContent = useMemo(() => {
    if (!product) return { cleanText: "", links: [] as Array<{ label: string; url: string }> };

    let raw = product.description.trim();
    // Strip decorative divider lines
    raw = raw.replace(/[━─=\-]{4,}/g, "");
    raw = raw.replace(/🛍️\s*PRODUCT INFORMATION/gi, "");

    // Extract links
    const foundLinks: Array<{ label: string; url: string }> = [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let match;
    while ((match = urlRegex.exec(raw)) !== null) {
      const url = match[1].replace(/[),.]+$/, "");
      let label = "Dokumentasi & Panduan";
      if (url.includes("google.com/document")) label = "Panduan Setup (Google Doc)";
      else if (url.includes("miraiapi")) label = "Portal Aktivasi API";
      else if (url.includes("docs")) label = "Dokumentasi Resmi";

      if (!foundLinks.some((l) => l.url === url)) {
        foundLinks.push({ label, url });
      }
    }

    // Clean lines
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("http"));

    return {
      cleanText: lines.join("\n"),
      links: foundLinks,
    };
  }, [product]);

  if (!product) return null;

  const deliveryLabel = product.requires_email
    ? t.deliveryTypes.custom_email
    : product.delivery_type === "custom_email"
      ? t.deliveryTypes.custom_email
      : t.deliveryTypes.instant;

  const waMessage = encodeURIComponent(
    lang === "id"
      ? `Halo Admin Octane (Hafidz Prasetya),\n` +
      `Saya ingin memesan produk:\n` +
      `• Nama: ${product.name}\n` +
      `• ID Produk: #${product.id}\n` +
      `• Harga: ${product.formatted_price}${product.price_usd ? ` ($${product.price_usd} USD)` : ""}\n` +
      `• Durasi: ${product.duration_label}\n\n` +
      `Mohon kirimkan detail pembayaran QRIS / Bank. Terima kasih!`
      : `Hello Octane Support,\n` +
      `I would like to order:\n` +
      `• Product: ${product.name}\n` +
      `• Product ID: #${product.id}\n` +
      `• Price: ${product.formatted_price}${product.price_usd ? ` ($${product.price_usd} USD)` : ""}\n` +
      `• Duration: ${product.duration_label}\n\n` +
      `Please provide the payment instructions. Thank you!`
  );

  const waLink = `https://wa.me/6281325081046?text=${waMessage}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(
      `Octane: ${product.name} (ID: #${product.id}, ${product.formatted_price}, ${product.duration_label})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <div className="absolute top-2.5 left-2.5 bg-background/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-foreground">
              {localizeDuration(product.duration_label, lang)}
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={product.is_in_stock ? "default" : "secondary"}
                  className="text-xs"
                >
                  {product.is_in_stock
                    ? `${t.deliveryTypes.instant ? "Ready" : "In Stock"} (${product.stock})`
                    : "Out of Stock"}
                </Badge>
                {product.price_usd && (
                  <span className="text-xs font-mono text-muted-foreground">
                    ${product.price_usd} USD
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
          <div className="rounded-xl bg-muted/20 p-4 border border-border/30 text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans max-h-48 overflow-y-auto">
            {parsedContent.cleanText}
          </div>

          {/* Extracted Guide Links */}
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

        {/* Order CTAs */}
        <div className="space-y-3 pt-3 border-t border-border/40">
          <Button
            asChild
            className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm cursor-pointer"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{t.orderWhatsapp}</span>
            </a>
          </Button>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-1.5 hover:text-foreground text-[11px] font-mono transition-colors cursor-pointer"
            >
              {copied ? (
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
            <span className="font-mono text-[11px]">{t.paymentMethods}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
