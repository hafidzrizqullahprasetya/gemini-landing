# DESIGN.md — Octane (octane.web.id)

## 1. Identity & Purpose

- **Brand:** OCTANE
- **Domain:** `octane.web.id`
- **Core Concept:** "Bahan Bakar Produktivitas Digital" — analogi oktan tinggi (high-octane fuel) sebagai pendorong kecepatan workflow untuk developer, kreator, data scientist, dan pelajar.
- **Model:** Digital products marketplace & catalog powered by VenteBot Reseller API v1.2.0.
- **Offering:** 100+ varian software & accounts: AI Model (Gemini 18M, Claude 50M API, ChatGPT Plus K12), Developer Stack (Supabase, Railway, Linear, PostHog, JetBrains), Design Tools (CapCut 1600 Credit, Canva, Figma 2yr, Framer), dan Edu/Streaming.
- **Positioning vs Kompetitor (prastyaneki.biz.id):**
  - **Palet Warna Unik:** Octane menggunakan *High-Octane Flame* (`#ea580c` / `#ff6600`) berpadu dengan *Pitch Carbon Slate* (`#090a0f`), kontras dengan palet tanah/terracotta lembut milik Prastyaneki.
  - **Keunggulan Kompetitif:** Sinkronisasi API real-time (stok detik ini), 100+ varian terlengkap (termasuk developer token API), aktivasi cepat 2–5 menit, serta kelengkapan kredensial 2FA secret terverifikasi.

## 2. Visual Dials (Antislop Specification)

- **ENERGY:** 3 (High-performance, athletic precision, sharp contrast).
- **RHYTHM:** 3 (Struktur naratif mengalir: Hero -> Flash Drops Carousel -> Keunggulan Kompetitif -> Live Catalog Grid -> Panduan Transaksi -> Kebijakan Garansi -> FAQ -> Footer).
- **MOTION:** 1 (Subtle interactive states, instantaneous transition, zero endless looping pulses).

## 3. Design System & Palette

- **Mode Terang (Light):**
  - Background: Crisp Ice Slate (`hsl(210 20% 98%)` / `#f8fafc`)
  - Foreground: Deep Charcoal Obsidian (`hsl(222 47% 11%)` / `#090d16`) — 16.5:1 contrast.
  - Card: Pure White (`#ffffff`) with hairline border (`#cbd5e1`).
  - Primary Accent: High-Octane Flame (`hsl(21 90% 48%)` / `#ea580c`) — 4.9:1 contrast.
- **Mode Gelap (Dark):**
  - Background: Pitch Stealth Carbon (`hsl(230 25% 6%)` / `#090a0f`)
  - Foreground: Crisp Pure White (`hsl(210 20% 98%)` / `#f8fafc`) — 16.8:1 contrast.
  - Card: Deep Carbon Slate (`hsl(232 20% 9%)` / `#11131a`) with hairline border (`#232733`).
  - Primary Accent: Vivid Electric Flame (`hsl(24 100% 50%)` / `#ff6600`) — 6.5:1 contrast.
- **Typography:**
  - Headings: `Manrope` / `DM Sans`
  - Body: `DM Sans`
  - Numbers, Specs & Badges: `DM Mono`

## 4. Antislop & Humanizer Rules

- **Zero Generic AI Gradients:** Menolak gradien ungu-biru; memakai aksen High-Octane Flame tunggal yang terarah.
- **Zero Decorative Emojis di UI Text:** Ikon menggunakan SVG konsisten via `lucide-react`.
- **Zero Fake Status Dots:** Indikator stok berbasis data riil API per detik.
- **No Em Dashes:** Menggunakan titik dua, kurung, atau titik.
- **Accessible & Responsive:** Target sentuh 44x44px, dialog modal closable via Escape, kontras WCAG AA di kedua tema.
