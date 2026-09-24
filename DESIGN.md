# DESIGN.md — Octane AI (Gemini Pro Landing)

## 1. Identity & Purpose
* **Brand:** Octane AI
* **Domain:** octane.web.id
* **Offering:** Layanan aktivasi resmi Google One AI Premium (Gemini Advanced 1.5 Pro + 2TB Storage) 18 bulan seharga Rp 30.000.
* **Target Audience:** Developer, mahasiswa teknik, kreator konten, dan tech-savvy users di Indonesia yang membutuhkan kapasitas AI dan cloud storage besar tanpa beban langganan bulanan.

## 2. Visual Dials (Antislop Specification)
* **ENERGY:** 2 (Balanced, confident, clear focal hierarchy)
* **RHYTHM:** 2 (Structured sections with distinct content compositions)
* **MOTION:** 1 (Subtle hover feedback, instantaneous state changes, zero endless loops or distracting pulses)

## 3. Design System & Palette
* **Canvas:** Pure Pitch Black (`#000000`)
* **Surfaces:** Matte Dark Neutral (`#0d0e12`, `#121318`) with subtle border (`rgba(255, 255, 255, 0.08)`)
* **Single Primary Accent:** Vivid Electric Blue (`#0091ff`) used exclusively on key conversion points (Primary CTA button, key metric highlights).
* **Secondary Brand Hue:** Google AI Gradient subtle text clip (`#8fb9ff` to `#1d6dff` to `#00bdf6`) applied sparingly to the core headline keywords.
* **Typography:** Figtree (Google Fonts) — geometric readability with high structural clarity.
* **Text Contrast:**
  * Headings & Primary Text: `#ffffff` (21:1 contrast against `#000000`)
  * Secondary Text: `#d4d4d4` / `#a3a3a3` (minimum 7:1 contrast, exceeds WCAG AAA)
  * Muted Footnotes: `#888888` (minimum 4.6:1 contrast, exceeds WCAG AA)

## 4. Antislop Guardrails & Decisions (R-31)
* **No Em Dash (R-02):** Replaced with colons, parentheses, or clean punctuation.
* **No Fake Terminal Window (R-05):** Replaced with concrete factual comparisons (token capacity in real-world equivalents: PDF pages, lines of code, video length).
* **No Decorative Emojis (R-04):** UI text uses semantic copy and clean SVG glyphs.
* **No Redundant Eyebrow (R-09):** The H1 headline directly leads the narrative without artificial pill badges above it.
* **Dose Cap on Glassmorphism (R-10):** Backdrop blur restricted to the top floating navigation bar only. Cards use solid matte surfaces.
* **Transparent Pricing & Guarantees (C-5, R-36):** No fictional user counts or fake reviews. Clear refund & activation guarantee.
