import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { EnrichedProduct } from "@/services/venteApi";
import {
  ShieldCheck,
  Zap,
  Clock,
  Send,
  MessageCircle,
  Copy,
  Check,
  Layers,
} from "lucide-react";
import { useState } from "react";

interface ProductModalProps {
  product: EnrichedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const cleanDesc = product.description.trim();

  const waMessage = encodeURIComponent(
    `Halo Admin Octane (octane.web.id), saya ingin memesan:\n` +
    `• Produk: ${product.name}\n` +
    `• ID Produk: #${product.id}\n` +
    `• Harga: ${product.formatted_price} ($${product.price_usd} USD)\n` +
    `• Durasi: ${product.duration_label}\n` +
    `Mohon kirimkan detail pembayaran QRIS / Bank. Terima kasih!`,
  );

  const waLink = `https://wa.me/6285179927909?text=${waMessage}`;
  const tgLink = `https://t.me/VenteTelegramBot?start=order_${product.id}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(
      `Produk: ${product.name} (ID: #${product.id}, Harga: ${product.formatted_price})`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      description={`Kategori: ${product.category} · ID: #${product.id}`}
      className="max-w-2xl"
    >
      <div className="space-y-6 pt-2">
        {/* Image and quick specs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6 aspect-video sm:aspect-square w-full rounded-lg overflow-hidden bg-muted hairline-border relative">
            <img
              src={product.display_image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-background/90 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-foreground">
              {product.duration_label}
            </div>
          </div>

          <div className="sm:col-span-6 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={product.is_in_stock ? "default" : "secondary"}
                  className="text-xs"
                >
                  {product.is_in_stock
                    ? `Stok Tersedia (${product.stock})`
                    : "Stok Habis"}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  ${product.price_usd} USD
                </span>
              </div>

              <div className="text-2xl font-bold font-mono text-primary">
                {product.formatted_price}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Harga final sudah termasuk kurs konversi & biaya aktivasi.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="rounded-lg bg-muted/40 p-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="font-medium">{product.warranty_label}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Pengiriman: Tipe {product.delivery_type.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Masa Aktif: {product.duration_label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Tiers if available */}
        {product.price_tiers && product.price_tiers.length > 0 && (
          <div className="rounded-lg border hairline-border p-3.5 bg-card/40">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground mb-2">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>Grosir & Tier Pembelian</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              {product.price_tiers.map((tier: { min_qty: number; max_qty: number; price_usd: number }, idx: number) => (
                <div
                  key={idx}
                  className="rounded bg-muted/60 p-2 text-center border hairline-border/50"
                >
                  <p className="text-muted-foreground text-[11px]">
                    Qty {tier.min_qty} - {tier.max_qty}
                  </p>
                  <p className="font-bold text-primary mt-0.5">
                    ${tier.price_usd} USD
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Deskripsi & Format Akun
          </h4>
          <div className="rounded-lg bg-muted/30 p-4 border hairline-border text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans">
            {cleanDesc}
          </div>
        </div>

        {/* Order CTAs */}
        <div className="space-y-3 pt-2 border-t hairline-border">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button
              asChild
              className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Pesan Cepat via WhatsApp</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="flex-1 h-11 border-border text-foreground hover:bg-muted font-medium"
            >
              <a
                href={tgLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4 text-sky-500" />
                <span>Order via Telegram Bot</span>
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-1.5 hover:text-foreground text-[11px] font-mono transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Tersalin ke clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Ringkasan Produk</span>
                </>
              )}
            </button>
            <span className="font-mono text-[11px]">Metode: QRIS / Transfer BCA / Mandiri</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
