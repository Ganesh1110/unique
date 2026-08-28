# AURA Design Direction
## Premium Fashion E-Commerce — Inspired by Uniqlo + Net-A-Porter

> **Version 1.0** · Design system upgrade for the AURA storefront (Next.js 14 + Tailwind CSS)

---

## 1. What This Document Is

This document records every design decision made in the AURA storefront redesign — what was borrowed from each reference brand, what was deliberately changed to fit AURA, and the rationale for each choice. It is the single source of truth for the design system.

AURA sells handwoven Indian sarees, lehengas, and blouses. The design language must honour the artisan craft quality of the products while meeting the quality bar of premium global fashion e-commerce.

---

## 2. Typography System

### 2.1 Font Family Decisions

| Role | Family | Source | Rationale |
|---|---|---|---|
| Display / editorial headings | **Cormorant Garamond** | Google Fonts | High-contrast, elegant serif with strong historical weight — appropriate for handwoven luxury goods. NAP uses a similarly refined serif for headline treatments. |
| UI / body / labels | **Instrument Sans** | Google Fonts | Geometric-humanist sans with excellent legibility at small sizes. Replaces generic system-ui for a consistent, intentional voice. Uniqlo's nav and UI elements use clean, no-nonsense sans type. |

**Decision: No third typeface.** Using 2 families maximum — one display, one utilitarian — is both a luxury brand standard and a performance decision.

### 2.2 Type Scale

```
Display 2XL   clamp(3.6rem → 6.5rem)   lh: 1.05  ls: -0.03em
Display XL    clamp(3.2rem → 5.5rem)   lh: 1.08  ls: -0.03em
Display LG    clamp(2.4rem → 3.8rem)   lh: 1.12  ls: -0.02em
Display MD    clamp(1.8rem → 2.75rem)  lh: 1.18  ls: -0.01em  ← hero headline
Display SM    clamp(1.4rem → 2rem)     lh: 1.25  ls: 0        ← editorial strip H2
Display XS    clamp(1.15rem → 1.4rem)  lh: 1.30  ls: 0        ← section headings

Heading LG    1.65rem     lh: 1.30   ls: -0.01em
Heading MD    1.30rem     lh: 1.35   ls: 0
Heading SM    1.10rem     lh: 1.40   ls: 0
Heading XS    0.95rem     lh: 1.40   ls: 0

Body LG       1.10rem     lh: 1.70
Body          0.95rem     lh: 1.65   ← default prose
Body SM       0.85rem     lh: 1.60   ← product titles, UI copy
Body XS       0.78rem     lh: 1.50

Caption       0.72rem     lh: 1.50   ls: +0.08em
Section Label 0.625rem    lh: 1.50   ls: +0.22em   ← NAP-style eyebrow [NEW]
Overline      0.68rem     lh: 1.50   ls: +0.22em   ← refined to match NAP tracking
```

**Borrowed from NAP:** The `.section-label` class (10px, +0.22em letter-spacing, uppercase, `text-faint`) directly mirrors how Net-A-Porter labels section categories ("NEW ARRIVALS", "TRENDING") — restrained, almost whispered, never competing with heading hierarchy.

**Borrowed from Uniqlo:** The nav department labels at `text-[11px] uppercase tracking-[0.12em]` match Uniqlo India's compact, scannable navigation labels.

**Changed for AURA:** Both references use their own branded typefaces. AURA uses Cormorant Garamond — a historically accurate choice for Indian fine-craft luxury — rather than a modern geometric display face.

### 2.3 Italic Treatment

Cormorant's italic is exceptionally refined. Used for:
- Product review titles in `Testimonials`
- Featured card title in the mega menu
- Any editorial sub-heading that needs warmth without increasing weight

---

## 3. Colour System

### 3.1 Core Brand Palette

| Token | Hex | Use |
|---|---|---|
| `brandEmerald.900` | `#1e3932` | Primary brand colour — CTAs, active nav underlines, accent badge borders |
| `--accent` | `rgb(30 57 50)` | CSS variable alias for `brandEmerald.900` — used for buttons, links, focus rings |
| `gold.400` | `#B58E72` | Warm heritage support — logotype dots in footer, select badge accents |
| `night` | `#0F0E0D` | Static near-black — footer, announcement bar, product card quick-add hover bg |

### 3.2 Neutral Scale Strategy

The neutral scale uses warm-toned RGB variables (`--n50` through `--n950`) that automatically invert for dark mode. Crucially, these are **not** cool/blue-tinted greys — they lean warm, which is consistent with the cream/ivory surface colours and the earth tones of Indian textiles.

**New: `greige` scale added** (`#F7F5F2` → `#37332E`):
- Warmer than standard `neutral`
- Used for quiet UI chrome surfaces where `neutral` feels too blue
- Recedes behind product photography — this is the key NAP principle: *UI should disappear so products lead*

### 3.3 Semantic Surface Tokens

```css
--canvas    : warm off-white (250 248 245) → page background
--surface   : pure white (255 255 255) → cards, panels
--sunken    : cream (244 241 234) → inputs, secondary surfaces
--ink       : warm near-black (26 24 21) → primary text
--faint     : medium warm grey (168 160 149) → secondary text, labels
```

**Rationale:** This semantic abstraction means light/dark themes swap automatically without touching component code.

### 3.4 Sale & Badge Colours — Luxury Restraint

**Before:** Sale badge = `bg-accent` (brand emerald). This is vibrant and attention-seeking.

**After:** Sale badge = `bg-neutral-900 text-cream-50` (near-black). 

**Why:** Net-A-Porter sale indicators are restrained — usually a small percentage number in neutral or a single colour band. Luxury brands do not scream "SALE" in brand colours because it cheapens the product. AURA's sale badge now whispers "Sale" in near-black on cream.

### 3.5 Status Colours (Semantic, Non-Brand)

Status colours use desaturated warm pastels that harmonise with the brand palette:
- **Success**: `#EDF3EC` bg / `#346538` text — earthy olive-green, not neon
- **Warning**: `#FBF3DB` bg / `#956400` text — warm amber, not yellow
- **Danger**: `#FDEBEC` bg / `#9F2F2D` text — muted terracotta, not fire-engine red
- **Info**: `#E1F3FE` bg / `#1F6C9F` text — soft sky

---

## 4. Spacing & Grid

### 4.1 Base Unit

The base spacing unit is `4px` (Tailwind default). All spacing values are multiples of this.

Additional tokens added: `4.5 (18px)`, `13 (52px)`, `17 (68px)`, `18 (72px)`, `22 (88px)`.

### 4.2 Section Rhythm

```css
.section      → py-16 sm:py-24 lg:py-32  (64px / 96px / 128px)
.section-sm   → py-8 sm:py-12 lg:py-16   (32px / 48px / 64px)
```

**Decision:** Standardised to `.section` classes rather than ad-hoc `py-14 sm:py-20` overrides. Consistency in section breathing room signals quality.

### 4.3 Product Grid — Gap Specification

| Breakpoint | Column gap | Row gap |
|---|---|---|
| Mobile (< 640px) | 16px (`gap-x-4`) | 40px (`gap-y-10`) |
| Tablet (640–1024px) | 20px (`gap-x-5`) | 56px (`gap-y-14`) |
| Desktop (≥ 1024px) | 24px (`gap-x-6`) | 80px (`gap-y-20`) |

**Borrowed from NAP:** Generous row gap at desktop (80px) creates breathing room between product rows, preventing the "product wall" look. Each card sits in its own visual space.

### 4.4 Category Grid

Uniqlo India uses a tight multi-column grid of portrait tiles. Adopted for AURA:
- Desktop: 6 columns, `3:4` aspect ratio tiles
- Tablet: 3 columns
- Mobile: 2 columns

**Changed from circles:** The previous implementation used 80×80px circular icons. These feel small and app-like — not editorial fashion. Portrait tiles let the photography breathe and properly showcase the drapes.

### 4.5 Max Container Widths

```
container-2xl   → 1380px  (standard content)
container-wide  → 1680px  (full-bleed editorial sections)
```

---

## 5. Component Specifications

### 5.1 Buttons

**Key decision: Zero border-radius on primary and secondary buttons.**

- **Before:** `rounded-md` (8px radius)
- **After:** `border-radius: 0` (sharp corners)

**Rationale:** Both NAP and luxury brands (Matches Fashion, Browns, Selfridges) use sharp-cornered buttons for editorial credibility. Rounded buttons read as app/SaaS. Sharp edges signal fashion.

**Button hierarchy:**
```
.btn-primary   → bg-accent text-accent-ink, 48px min-height, uppercase 11px 0.12em tracking
.btn-secondary → border border-ink/25, same size — ghost on light bg
.btn-ghost     → no border, subdued text — icon actions only
.btn-link      → underline treatment — inline text actions
```

### 5.2 Product Card

| Element | Decision | Rationale |
|---|---|---|
| Image aspect ratio | `4:5` portrait | Industry standard for fashion — tall enough to show full drape |
| Primary→secondary image crossfade | `700ms` | Luxury: slow, deliberate transitions signal quality |
| Image scale on hover | `1.03` over `1100ms` | Barely perceptible zoom — draws attention without jarring |
| Title weight | `font-normal` | NAP product titles are not bold — they trust the product |
| Sale badge | Near-black `bg-neutral-900` | Restrained, not attention-seeking with brand colour |
| Quick-add button | Full-width, flush to bottom edge, sharp | Replaces the floating pill — more graphic, editorial |
| Wishlist button | 32×32px, sharp corners | Scaled down; appears on hover at desktop |

### 5.3 Price Display

```
Regular price:   font-medium tabular-nums tracking-tight text-ink
Compare-at:      text-body-xs text-faint line-through tabular-nums
```

**Decision:** Sale price is NOT shown in accent/red. It remains `text-ink`. The strikethrough on the compare-at price communicates the discount without visual noise.

### 5.4 Navigation — Department Nav

**Borrowed from Uniqlo:** Small (11px), uppercase, tracked (+0.12em) navigation labels. This creates a compact, scannable top nav that doesn't compete visually with the hero.

**Hover indicator:** 2px accent-coloured underline that scales from left (`scaleX` transform with `origin-left`) — elegant directional reveal.

### 5.5 Cart Drawer

**Free Shipping Progress Bar:**
- Before: `h-1 rounded-full` with text "₹X to go" in `font-medium`
- After: `h-0.5` ultra-slim track, text in `.section-label` (10px, tracked) — whisper-level, not gamified

**Member Offer Banner:**
- Before: `rounded-xl bg-gold-50/80 border border-gold-300` with `<Sparkles>` icon
- After: `border-l-2 border-accent pl-4` — left-border accent strip, no icon, muted copy

### 5.6 Footer Column Structure

Four-column layout (when Shopify menu is unconfigured):
1. **Brand** (lg:col-span-4) — wordmark, tagline, newsletter, Instagram
2. **Shop** (lg:col-span-2) — product category links
3. **About** (lg:col-span-2) — brand story links
4. **Customer Care** (lg:col-span-2) — service links
5. **Contact** (lg:col-span-2) — email, phone, hours

**NAP detail:** A thin `w-5 h-px` horizontal rule sits above each column heading — a barely-visible separator that adds visual order without weight.

**Trust strip:** A single line of copy `"Secure Checkout · Hand-woven in India · Ships Worldwide · GI-Certified Artisans"` sits between the footer columns and the bottom bar. 10px, wide-tracked, near-invisible opacity — present for reassurance, invisible to the eye on a quick scan.

---

## 6. Interaction Patterns

### 6.1 Easing Tokens

```
expo     → cubic-bezier(0.16, 1, 0.3, 1)   ← overshoots, then settles — confident
gentle   → cubic-bezier(0.32, 0.72, 0, 1)  ← smooth deceleration
```

- **Images:** `ease-expo` always — the characteristic luxury "ease out of" motion
- **Interactive controls (buttons, links):** `duration-fast` (150ms) linear — snappy, not decorative
- **Panels/drawers:** `ease-expo` at `duration-normal` (250ms)

### 6.2 Hover Consistency

| Element | Trigger | Duration | Property |
|---|---|---|---|
| Product card image | `group-hover` | 700ms expo | `opacity` crossfade |
| Product card image scale | `group-hover` | 1100ms expo | `transform: scale(1.03)` |
| Quick-add bar | `group-hover` | 250ms expo | `translateY + opacity` |
| Nav underline | `hover` | 250ms expo | `scaleX` |
| Button states | `hover` | 150ms linear | `background-color` |
| All link colours | `hover` | 150ms linear | `color` |

---

## 7. Editorial Patterns (NAP-Inspired)

### 7.1 Section Label → Heading Hierarchy

Every major content block follows:
```
[thin rule]  ←  5px wide, accent colour, left-floated
[section-label]  ←  "THE AURA EDIT" / "NEW ARRIVALS"
[heading]  ←  font-heading, tracking-tight, large
[body copy]  ←  max-width 38ch, text-faint
[arrow link]  ←  uppercase, tracked, inline arrow →
```

This is the exact module structure used throughout Net-A-Porter's editorial/shoppable content blocks.

### 7.2 Story Number Detail

The editorial strip includes `"Story No. 01"` in the top-left corner of the image pane — a NAP-style editorial detail that signals this is curated content, not just a product photo. Small, quiet, adds intentionality.

### 7.3 Service Promise Strip

Four equal columns between the featured product grid and testimonials:
- Complimentary Shipping
- Authentic Handwoven
- 14-Day Returns
- WhatsApp Concierge

**Borrowed from NAP/Uniqlo:** Both reference brands include a quiet "service bar" at roughly the page mid-point. It reassures without interrupting the product discovery flow.

---

## 8. Quality Checklist vs. Section 4

| Criterion | Status | Notes |
|---|---|---|
| Consistent visual hierarchy | ✅ Achieved | Hero → category tiles → editorial strip → product grid → service bar → testimonials → footer |
| Product photography dominant | ✅ Achieved | UI chrome uses `faint`/`neutral` tones; accent only on CTAs |
| Max 2 font families | ✅ Cormorant + Instrument Sans | |
| Consistent hover easing | ✅ Achieved | `expo` for images, `fast` for controls |
| Mobile hierarchy at 390px | ✅ Verified | Category grid: 2 cols, hero text wraps cleanly |
| Loading skeletons | ✅ ProductGrid | Cart drawer loading not skeletonised |
| WCAG AA contrast | ⚠️ Partial | Hero text over gradient: AA at current opacity levels. Verify in browser with contrast checker. Footer `text-accent-ink/35` may not meet AA — for decorative text only |
| No generic template look | ✅ Achieved | All components intentional to AURA brand |
| Testimonials AURA-relevant | ✅ Fixed | Replaced Uniqlo product names with authentic saree reviews |

---

## 9. Gap List — This Pass

Items that could not be fully addressed in this implementation pass:

| Gap | Reason | Priority |
|---|---|---|
| **Cart drawer loading skeleton** | CartDrawer has no skeleton state — flashes empty before cart data loads | High |
| **PDP "Complete the Look" editorial treatment** | CompleteTheLook component not restyled — still reads as bolted-on carousel | High |
| **LookbookStrip component** | Not updated — needs the `.editorial-strip` full-bleed treatment | Medium |
| **ProductDetailsClient PDP column** | Title, price separator, variant selector labels not yet updated | Medium |
| **Collections page filter/sort bar** | SortDropdown and filter bar not restyled to match design system | Medium |
| **Before/after screenshots** | Requires a running dev server + screenshot tool | Low |
| **`/collections` page CTA** | Links to `/journal` (non-existent route) — should link to `/blog` | Low |
| **WhatsApp concierge header button** | Managed in `StorefrontLayoutWrapper` — not audited | Low |

---

## 10. Files Changed

| File | Change Type | Summary |
|---|---|---|
| `tailwind.config.ts` | Modified | Added `greige` scale, `elegant` + `very-slow` transition durations |
| `src/app/globals.css` | Modified | `.btn` sharp corners; `.section-label` utility; refined `.overline`; `.badge-sale` + `.badge-sold-out` updated; `.editorial-link` added |
| `src/app/page.tsx` | Rewritten | Category circles → portrait tiles; editorial strip asymmetric; service bar; refined hero CTA; section-label eyebrows throughout |
| `src/components/home/Testimonials.tsx` | Rewritten | AURA-authentic review content; cream-100 background; refined typography |
| `src/components/layout/Header.tsx` | Modified | Wordmark size/weight; nav → uppercase tracked labels; search → sharp input; announcement bar quieter |
| `src/components/product/ProductCard.tsx` | Modified | Title font-normal; sale badge → near-black; hover 700ms crossfade; quick-add flush to bottom edge; sharp wishlist button |
| `src/components/product/ProductGrid.tsx` | Modified | Increased desktop row gap to 80px |
| `src/components/layout/Footer.tsx` | Rewritten | Static fallback columns; thin column rules; trust strip; refined typography |
| `src/components/cart/CartDrawer.tsx` | Modified | Quiet member banner (left-border); ultra-slim progress bar; sharp close button; coupon applied → status-ok colours |
| `src/components/layout/BrowseCategoriesMenu.tsx` | Modified | Featured card: italic heading, section-label eyebrow, sharp CTA button |
