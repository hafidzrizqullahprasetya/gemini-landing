# Octane — Bahan Bakar Produktivitas Digital (octane.web.id)

Platform marketplace & katalog produk digital berkecepatan tinggi untuk developer, kreator, dan pelajar. Terhubung langsung dengan **VenteBot Reseller API v1.2.0**.

---

## Brand & Konsep

- **Nama Brand:** OCTANE
- **Domain:** `octane.web.id`
- **Filosofi:** Bahan bakar oktan tinggi yang menginjeksi performa workflow harian dengan akun AI, developer stack, dan creative suite legal bergaransi.
- **Karakter Visual:** Palet *High-Octane Flame* (`#ea580c` / `#ff6600`) berpadu dengan *Pitch Carbon Slate* (`#090a0f`), berbeda tegas dengan gaya earthy/terracotta kompetitor (`prastyaneki.biz.id`).

---

## Keunggulan Kompetitif vs Kompetitor

1. **Sinkronisasi Stok Real-Time API:** Stok tersaji akurat detik ini langsung dari server (misal: Gemini 790+ ready). Tanpa sistem manual atau penolakan setelah transfer.
2. **Katalog 100+ Varian Komprehensif:** Tidak hanya menjual produk umum, melainkan mencakup Token API Claude/Codex, infrastruktur cloud (Supabase, Railway, Linear, PostHog), hingga suite edukasi dan hiburan.
3. **Kecepatan Aktivasi 2–5 Menit:** Format transaksi otomatis via WhatsApp & Telegram Bot siap kirim tanpa antrean chat manual berjam-jam.
4. **Kejelasan Garansi & Format 2FA:** SLA garansi tertulis per produk (Full Warranty, W25D, W5D). Akun dikirimkan lengkap dengan 2FA secret key dan petunjuk autentikasi.

---

## Arsitektur & Teknologi

- **Frontend:** React 19, TypeScript, Vite 6
- **Styling:** Tailwind CSS v4, shadcn UI components, CSS variables
- **Komponen Inti:**
  - `components/ui/card.tsx`: Kontainer shadcn
  - `components/ui/button.tsx`: Tombol interaktif cva
  - `components/ui/badge.tsx`: Label status produk
  - `components/ui/product-card-3.tsx`: Carousel drop card produk (responsif 1-3 item)
  - `components/ui/product-drop-card.tsx`: Re-export kompatibilitas
  - `components/ui/demo.tsx`: Demo drop card
  - `components/ComparisonSection.tsx`: Tabel keunggulan kompetitif
- **API Reseller:**
  - Endpoint: `/api/reseller/products`
  - Proxy lokal otomatis di Vite dan Nginx ke `https://ventetelegrambotrailway-production.up.railway.app`
  - Fallback lokal: `src/data/initialProducts.json` (105 produk riil)

---

## Perintah Kerja

```bash
# Development
pnpm dev

# Build Produksi
pnpm build

# Preview Hasil Build
pnpm preview
```
