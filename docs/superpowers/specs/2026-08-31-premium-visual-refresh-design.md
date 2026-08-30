# LuxeLife Premium Visual Refresh — Design

## Goal

Make the LuxeLife storefront and admin dashboard feel premium through depth, border, hover, and micro-detail treatment — without changing sizes, breakpoints, layout structure, or the existing color palette defined in `DESIGN.md`.

## Background

The frontend (`frontend/`) is a Vite + React + Tailwind app using plain utility classes and a small set of shared component classes in `src/tailwind.css` (`.product-card`, `.minimal-border`, `.input-field`, `.image-zoom-hover`, etc.). There is no shadcn/ui or other component library — styling is either inline Tailwind utilities or these shared classes. Colors and typography are driven by `tailwind.config.ts`, which mirrors the tokens in `DESIGN.md`.

DESIGN.md's stated elevation philosophy is "Tonal Layering" and "Fine Outlines" — explicitly avoiding heavy shadows. During brainstorming, three elevation/hover treatments consistent with that philosophy were mocked up in the visual companion:

- **A — Pure Tonal**: hairline border only, zero shadow, hover = background tint + image scale (spec-literal).
- **B — Whisper Lift**: hairline border at rest; hover adds a soft diffused shadow + 3px lift (**selected**).
- **C — Gallery Frame**: inset "museum mat" padding around imagery, firmer border, no shadow.

The user selected **B — Whisper Lift**: still avoids heavy/hard shadows (stays true to DESIGN.md's spirit), but the soft diffused hover shadow + lift reads as more polished/premium than a flat background-color swap.

## Scope

**In scope:** All customer-facing pages (`HomePage`, `ShopAllPage`, `ProductDetailPage`, `CartPage`, `CheckoutPage`, `AboutPage`, `FAQPage`, `ContactPage`) plus shared layout components (`Header`, `Footer`, `AnnouncementBar`, `Logo`) and all `admin/*` pages.

**Out of scope / explicitly unchanged:**
- Color palette / design tokens in `tailwind.config.ts` and `DESIGN.md` (one exception — see Bug Fix below)
- Font sizes, line-heights, letter-spacing scale
- Spacing scale, breakpoints, container widths
- Component/page layout structure, DOM structure, routes, business logic
- Responsiveness (mobile/tablet/desktop breakpoint behavior)

## Bug Fix

`tailwind.config.ts` defines `'primary-container': '#000000'`. `DESIGN.md`'s color frontmatter specifies `primary-container: '#452829'` (Deep Cocoa). This is a data-entry bug, not an intentional deviation — it currently renders the homepage "Your Lifestyle Deserves Better Choices" band (`bg-primary-container`) as pure black instead of the intended warm cocoa tone. Fix: change the value to `#452829` to match the spec.

## Design

### 1. Shared elevation/interaction classes

Add to `src/tailwind.css` under `@layer components`, implementing the "Whisper Lift" language. These either extend or replace the current equivalents:

- **`.surface-card`** (replaces `.product-card` usage pattern) — white background, `1px solid rgba(45,20,21,.08)` border, `box-shadow: 0 1px 2px rgba(45,20,21,.03)` at rest. On hover: `box-shadow: 0 14px 28px -8px rgba(69,40,41,.12), 0 2px 6px rgba(69,40,41,.05)` and `transform: translateY(-3px)`. Transition on `box-shadow, transform` at `0.3s ease`. Nested product imagery keeps its existing scale-on-hover behavior (see #4).
- **`.btn-primary`** — Deep Cocoa fill, white text, `label-caps` typography, 4px radius (unchanged from DESIGN.md). Hover: replace flat `hover:opacity-90` with a whisper-shadow (`0 8px 20px -6px rgba(69,40,41,.35)`) + `translateY(-1px)`.
- **`.btn-secondary`** — existing 1px border style. Hover: border color deepens to full `primary`, plus the same subtle lift as `.btn-primary` (no shadow, since DESIGN.md secondary buttons are outline-only — lift communicates interactivity without adding weight).
- **`.input-premium`** (refines `.input-field`/`.input-minimal`) — same bottom-border-only minimalist style. Focus transition changes from an abrupt border-color snap to `border-color 0.25s ease, box-shadow 0.25s ease` with a barely-there `box-shadow: 0 1px 0 0 rgba(45,20,21,.15)` glow under the line.
- **`.section-divider`** — new utility: a thin horizontal hairline that fades at both edges (`linear-gradient(90deg, transparent, rgba(45,20,21,.12) 20%, rgba(45,20,21,.12) 80%, transparent)`, `height: 1px`), used between major page sections to reinforce the "editorial story break" rhythm at existing 120px section gaps. Applied only where a section boundary currently has no visual separator and would benefit from one — does not add new spacing.

All of the above are CSS-only additions/edits in `src/tailwind.css`. No new dependencies, no Tailwind config structural changes beyond the one color fix.

### 2. Applying the classes

Sweep every in-scope file and swap:
- `.product-card` + `.product-card-hover` usages → `.surface-card`
- Raw `bg-primary text-on-primary ... hover:opacity-90` button patterns → `.btn-primary`
- Raw `minimal-border ... hover:bg-surface-variant` secondary button patterns → `.btn-secondary`
- `.input-field` / `.input-minimal` / `.admin-input` usages → `.input-premium` (admin gets the same treatment per scope decision)

This is a class-name and CSS-rule change; existing Tailwind sizing/spacing/responsive utility classes on the same elements are left in place untouched.

### 3. Typography & imagery micro-polish

Within the existing type scale (no new font sizes):
- Audit `label-caps` usages for consistent letter-spacing/weight application (some places apply `tracking-[0.1em]` redundantly on top of the class, which already carries `letter-spacing: 0.1em` — dedupe where found).
- Standardize `.image-zoom-hover` / `.gallery-main-image` / inline `group-hover:scale-*` patterns to one consistent scale factor (1.05) and duration (0.5s) — currently these vary (1.03/1.05, 0.5s/0.7s) across `HomePage`, `Header`, product galleries.
- Standardize gradient-overlay opacity on hero/category tiles (`bg-gradient-to-t from-primary/60` vs `/80` vs `bg-black/20`) to a consistent set of 1-2 overlay treatments depending on whether text sits directly on the image.

### 4. Admin dashboard

Same `.surface-card`, `.btn-primary`/`.btn-secondary`, `.input-premium` classes applied to `AdminDashboardPage`, `AdminOrdersPage`, `AdminOrderDetailPage`, `AdminProductsPage`, `AdminProductFormPage`, `AdminLoginPage`, and `AdminLayout` — tables, cards, forms, and buttons get the same elevation language so admin doesn't read as a bolted-on internal tool.

## Testing / Verification

This is a pure visual/CSS change with no logic changes. Verification is manual:
- Run the dev server and visually check each in-scope page (light and, if `darkMode: 'class'` is exercised anywhere, dark) for the new hover/elevation behavior.
- Confirm the `primary-container` fix renders correctly on the homepage promise band.
- Confirm no layout shift, size change, or responsive breakpoint regression versus current behavior (spot-check mobile widths for pages touched).
- No automated test suite exists for visual styling in this repo; none is being added since there's no non-trivial branching logic introduced (pure CSS/class changes).
