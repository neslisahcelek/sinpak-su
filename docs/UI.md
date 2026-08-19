# Sinpak Su – UI/UX Source of Truth

> **Status**: Draft · last updated 2026-08-18
> **Scope**: Customer-facing website only (admin UI is out of scope).
> **Language**: Turkish (`lang="tr"` already set in root layout).

---

## 1. Design Goals

| Goal | How it manifests |
|---|---|
| Fast ordering | Product → Cart → Checkout in as few taps as possible |
| Trust | Clear prices, transparent fees (₺0 delivery), no hidden steps |
| Mobile-first | Designed for one-handed phone use; desktop is an enhancement |
| Clarity | Every screen has one obvious primary action |
| Accessibility | WCAG 2.1 AA minimum |

---

## 2. Brand Personality

**Clean · Trustworthy · Friendly · Local**

The tone is a reliable neighbourhood shop, not a tech startup. Typography and colour should feel fresh and readable, not corporate or trendy.

---

## 3. Color Palette

All colours are defined as CSS custom properties in `globals.css` and used via Tailwind.

### Core

| Token | Hex | Tailwind equivalent | Usage |
|---|---|---|---|
| `--color-brand` | `#0369a1` | sky-700 | Primary actions, links, focus rings |
| `--color-brand-hover` | `#075985` | sky-800 | Hover / pressed state |
| `--color-brand-light` | `#e0f2fe` | sky-100 | Badge backgrounds, highlights |
| `--color-surface` | `#f8fafc` | slate-50 | Page background (already set) |
| `--color-surface-card` | `#ffffff` | white | Product cards, modal surfaces |
| `--color-border` | `#e2e8f0` | slate-200 | Dividers, card borders |
| `--color-text-primary` | `#0f172a` | slate-950 | Headings, prices |
| `--color-text-secondary` | `#475569` | slate-600 | Descriptions, labels |
| `--color-text-muted` | `#94a3b8` | slate-400 | Placeholders, disabled |

### Semantic

| Token | Hex | Tailwind equivalent | Usage |
|---|---|---|---|
| `--color-success` | `#16a34a` | green-600 | Order confirmed, stock OK |
| `--color-warning` | `#d97706` | amber-600 | Deposit notice, low stock |
| `--color-error` | `#dc2626` | red-600 | Form errors, out of stock |

> All Tailwind classes used in components must map to these tokens. Do not reach for arbitrary colour shades.

---

## 4. Typography

Use the system font stack — do not introduce web font dependencies at this stage.

```
font-family: ui-sans-serif, system-ui, -apple-system, Arial, sans-serif;
```

### Scale (Tailwind classes)

| Role | Class | Size / Weight |
|---|---|---|
| Page heading | `text-3xl font-semibold tracking-tight` | 30 px / 600 |
| Section heading | `text-xl font-semibold` | 20 px / 600 |
| Card heading (product name) | `text-base font-medium` | 16 px / 500 |
| Price (primary) | `text-2xl font-bold` | 24 px / 700 |
| Price (secondary / per-unit) | `text-sm text-slate-500` | 14 px / 400 |
| Body text | `text-base` | 16 px / 400 |
| Label / caption | `text-sm` | 14 px / 400 |
| Micro / badge | `text-xs font-medium` | 12 px / 500 |

**Rules:**
- Price is always the largest text element on a product card after the product name.
- Never shrink price below `text-lg`.
- Line heights: headings `leading-tight`, body `leading-relaxed`.

---

## 5. Spacing and Sizing

Based on Tailwind's 4 px base unit.

| Usage | Tailwind |
|---|---|
| Page horizontal padding (mobile) | `px-4` (16 px) |
| Page horizontal padding (desktop) | `px-6` (24 px) |
| Max content width | `max-w-5xl mx-auto` |
| Card inner padding | `p-4` |
| Section vertical gap | `py-8` |
| Stack gap between elements | `gap-3` or `gap-4` |
| Product grid gap | `gap-4` |

---

## 6. Border Radius and Surfaces

| Element | Class |
|---|---|
| Cards | `rounded-xl` |
| Buttons | `rounded-lg` |
| Inputs | `rounded-lg` |
| Badges / pills | `rounded-full` |
| Modals / drawers | `rounded-t-2xl` (bottom sheet on mobile) |

Cards use a subtle shadow instead of a heavy border:

```
shadow-sm border border-slate-200
```

---

## 7. Buttons and Interactive Controls

### Primary button (Add to Cart, Place Order)

```
bg-sky-700 hover:bg-sky-800 active:bg-sky-900
text-white font-semibold text-base
rounded-lg px-5 py-3
min-h-[44px] w-full (mobile) / w-auto (desktop)
transition-colors duration-150
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700
```

### Secondary button (View Details, Cancel)

```
bg-white border border-slate-300 hover:bg-slate-50
text-slate-700 font-medium text-base
rounded-lg px-5 py-3
min-h-[44px]
```

### Destructive button (Remove from Cart)

```
text-red-600 hover:text-red-700
(text button only — no filled background)
```

### Quantity stepper

```
[-] [n] [+]
Each control: min 44×44 px tap target
Font: text-base font-medium
Border: border border-slate-300 rounded-lg
```

**Rules:**
- Every tap target must be at minimum **44×44 px**.
- The primary action on every page is full-width on mobile.
- Disabled state: `opacity-50 cursor-not-allowed`.
- Loading state: spinner inside button; keep width stable (no layout shift).

---

## 8. Header / Navigation

### Structure

```
[Logo / "Sinpak Su"]          [Cart icon + item count badge]
```

- Sticky to top: `sticky top-0 z-50`.
- Height: 56 px (`h-14`).
- Background: `bg-white border-b border-slate-200` (solid background, no backdrop-blur or frosted glass).
- Logo: brand name as text (`text-sky-700 font-bold text-lg`) — no image asset required initially.
- Cart icon: standard shopping cart SVG. Show badge (`bg-sky-700 text-white text-xs rounded-full`) when count > 0.

### Desktop

- Same structure; `max-w-5xl mx-auto px-6` to centre content.
- No hamburger menu needed at this stage.

---

## 9. Product Cards

### Anatomy (top → bottom)

1. **Product image** — `aspect-square` or `aspect-[4/3]`, `object-cover`, `rounded-t-xl`
2. **Card body** (`p-4 flex flex-col gap-2`)
   - Product name (`text-base font-medium text-slate-900`, `line-clamp-2`)
   - Volume / variant label (`text-sm text-slate-500`)
   - **Price** (`text-2xl font-bold text-slate-950`)
   - Deposit notice if applicable (`text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full`)
3. **Add to Cart button** — full-width primary button (`mt-auto`)

### Grid

| Breakpoint | Columns |
|---|---|
| Mobile (< 640 px) | 2 (`grid-cols-2`) |
| Tablet (≥ 640 px) | 2 (larger cards) |
| Desktop (≥ 1024 px) | 3 (`grid-cols-3`) |

### Card States

| State | Treatment |
|---|---|
| In stock | Default |
| Out of stock | Image `grayscale`, button disabled — label "Stokta Yok" |
| In cart | Button label changes to "Sepette (n)" + checkmark icon |

---

## 10. Product Listing / Home Page

### Layout

```
<Header />
<main px-4 py-8>
  <h1>Ürünlerimiz</h1>
  <product grid>
</main>
```

- No hero banner or promotional carousel at this stage.
- Products sorted by: admin-defined display order, then alphabetical fallback.
- No filtering or search required in Phase 3.

### Empty State

```
[icon]
Ürün bulunamadı.
```

Centred inside the grid area.

---

## 11. Product Detail

Route: `/urunler/[slug]` (or equivalent).

### Mobile Layout (stacked)

```
Product image (full width, aspect-[4/3])
Product name (text-2xl font-semibold)
Price (text-3xl font-bold)
Deposit notice (if applicable)
Description (text-base text-slate-600 leading-relaxed)
[Quantity stepper]
[Add to Cart — sticky bottom, full-width primary button]
```

### Desktop Layout

Two-column: image left (60%), details right (40%), `items-start gap-8`.

### Rules

- Price must be visible without scrolling on mobile.
- "Add to Cart" sticky bar: `sticky bottom-0 bg-white border-t border-slate-200 p-4`.

---

## 12. Cart

Rendered as a **bottom sheet on mobile** / **slide-in drawer from the right on desktop**.

### Anatomy

```
Header: "Sepetiniz"                    [✕ close]
────────────────────────────────────────────────
[Item]  Product name + variant
        [-] [2] [+]                 ₺ XX,XX
        [Kaldır]
────────────────────────────────────────────────
Teslimat:                          Ücretsiz
Depozito: (if applicable)          + ₺50,00
────────────────────────────────────────────────
Toplam:                            ₺ XXX,XX
[Siparişi Tamamla — full-width primary button]
```

### Rules

- Line totals are calculated client-side for display; server re-validates on submission.
- Deposit note appears inline next to affected item AND in the summary.
- Empty cart: centred icon + "Sepetiniz boş." + link back to products.

---

## 13. Checkout — Phase 4 Direction

> Do not implement yet.

- Single-page form (no multi-step wizard).
- Fields: ad soyad, telefon, adres (free text), teslimat notu (optional), ödeme yöntemi (radio).
- Payment options: **Kapıda Nakit · Kapıda POS · Banka Havalesi**.
- Order summary visible alongside form on desktop; collapsible on mobile.
- Submit CTA: "Siparişi Ver".
- Guest checkout — no account creation required.

---

## 14. Confirmation — Phase 5 Direction

> Do not implement yet.

- Simple page: order number, summary, delivery info, "Teşekkürler" message.
- Phone contact displayed for follow-up; no email required at this stage.

---

## 15. Mobile-First Responsive Rules

1. Write mobile styles first; use `sm:`, `md:`, `lg:` to progressively enhance.
2. Active breakpoints:

   | Prefix | Min-width | Typical use |
   |---|---|---|
   | `sm` | 640 px | Tablet portrait |
   | `md` | 768 px | Tablet landscape |
   | `lg` | 1024 px | Desktop |

3. The site must be fully usable at **320 px** viewport width.
4. Never rely on hover-only interactions for primary actions.
5. All form inputs: `text-base` minimum (prevents iOS auto-zoom on focus).
6. Sticky bottom bars are acceptable for primary CTAs on mobile.

---

## 16. Accessibility

- **Colour contrast**: all text on white/light backgrounds must meet WCAG 2.1 AA (4.5:1 body, 3:1 large text). Brand blue `#0369a1` on white passes AA.
- **Focus rings**: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700` on every interactive element.
- **Semantic HTML**: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>` (product cards), `<button>`, `<label>`.
- **Images**: `alt` required on all images. Product images: product name. Decorative: `alt=""`.
- **ARIA**: `aria-label` on icon-only buttons (cart, close). `aria-live="polite"` on cart item count.
- **Keyboard**: logical tab order; no keyboard traps inside drawers or sheets.

---

## 17. Loading / Empty / Error States

Every data-driven section must implement all four states:

| State | Treatment |
|---|---|
| **Loading** | Skeleton cards (grey pulse animation matching card dimensions) |
| **Empty** | Centred icon + short Turkish message + action link where appropriate |
| **Error** | Inline message in `text-red-600`; no technical details exposed to user |
| **Success** | Green confirmation or redirect; cart badge update and clear inline feedback upon adding items to cart (no timed toast required) |

---

## 18. UX Principles

1. **One primary action per screen.** Every view has a single most-important action; it is full-width on mobile.
2. **Price is king.** Price is always the largest or second-largest typographic element on a product surface.
3. **No hidden costs.** "Ücretsiz Teslimat" and deposit notices are shown before checkout.
4. **Minimal friction.** Guest checkout; no mandatory account; no newsletter popups.
5. **No dark patterns.** No pre-ticked extras, countdown timers, or fake urgency.
6. **Preserve all states.** Loading, empty, error, success — none may be left unimplemented.
7. **Turkish first.** All user-facing copy is in Turkish.

---

## 19. Phase Boundaries

| Phase | Scope | UI work |
|---|---|---|
| **1** | Domain & data model | Done — no UI |
| **2** | API & server actions | Done — no UI |
| **3** | Header + product listing + product detail + cart | Implement using this document |
| **4** | Checkout form | Use §13 as starting point |
| **5** | Order confirmation | Use §14 as starting point |
| **6** | Admin UI | Separate design document (out of scope here) |

> This document is the single source of truth for all Phase 3–5 UI decisions.  
> Update here before changing any component.
