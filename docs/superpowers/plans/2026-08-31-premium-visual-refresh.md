# LuxeLife Premium Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the LuxeLife storefront and admin dashboard a "Whisper Lift" elevation/hover language (soft diffused shadow + slight lift on hover, replacing flat background-swap hovers) without changing any size, spacing, breakpoint, or color value.

**Architecture:** A small set of new/edited CSS rules in `frontend/src/tailwind.css` (`@layer components`) provide the shared elevation language. Two shared classes (`.product-card`, `.input-minimal`, `.admin-input`) already exist and are used by exactly one consumer each, so editing their CSS rules directly upgrades those pages with **zero JSX changes**. Everywhere else, new utility classes (`card-lift`, `btn-lift`, `btn-lift-secondary`, `field-glow`) are appended to existing `className` strings alongside the current Tailwind utilities — additive edits, not rewrites, so no existing size/color/layout utility is ever removed or reordered.

**Tech Stack:** Vite + React 19 + TypeScript + Tailwind CSS v4 (via `@tailwindcss/vite`, config in `frontend/tailwind.config.ts`). No component library (no shadcn/ui) — styling is plain Tailwind utility classes plus a handful of shared classes in `frontend/src/tailwind.css`.

## Global Constraints

- Do not change any color value in `frontend/tailwind.config.ts` or `DESIGN.md` (including the intentional `primary-container: '#000000'`).
- Do not change any font size, line-height, letter-spacing, spacing/gap value, breakpoint, or container width.
- Do not change component/page DOM structure, routes, or business logic — only `className` strings and CSS rules (one exception: a single new `<div className="section-divider" />` inserted in Task 2, which adds no size/spacing since it sits inside the existing gap).
- Verify every task with `npm run build` (runs `tsc -b && vite build`) from `frontend/`, run from the `frontend` directory.
- List rule (established during planning, applies to every task): a **static, non-clickable container** (page-level panel, sticky order-summary sidebar, stat tile, filter/status pill, table/list row that already uses a tint-hover) does **not** get `card-lift` — lift is reserved for elements that read as a single clickable "card" (a product tile, a related-item tile, a standalone info tile). This keeps the diff to genuinely interactive elements instead of sprinkling shadows everywhere.

---

### Task 1: Shared elevation CSS layer

**Files:**
- Modify: `frontend/src/tailwind.css:32-53` (product card block), `frontend/src/tailwind.css:55-61` (image-zoom-hover), `frontend/src/tailwind.css:63-73` (gallery-main-image is further down; see exact line numbers below — re-check after edits), `frontend/src/tailwind.css:75-94` (input-minimal / input-field), `frontend/src/tailwind.css:118-120` (admin-input), plus new rules appended before the closing `@layer components` brace.

**Interfaces:**
- Produces: CSS classes `card-lift`, `btn-lift`, `btn-lift-secondary`, `field-glow`, `section-divider` — consumed by Tasks 2–9 as appended `className` strings (e.g. `className="... existing-utilities card-lift"`).
- Produces: upgraded `.product-card`, `.image-zoom-hover`, `.gallery-main-image`, `.input-minimal`, `.admin-input` rules — consumed automatically by `ShopAllPage.tsx`, `HomePage.tsx`, `ProductDetailPage.tsx`, `CheckoutPage.tsx`, `AdminProductFormPage.tsx` with no JSX changes.

- [ ] **Step 1: Replace the `.product-card` / `.product-image` block**

In `frontend/src/tailwind.css`, replace this block (the dead `.product-card-hover` rule plus the live `.product-card`/`.product-image` rules):

```css
  .product-card-hover:hover {
    background-color: #e8d1c5;
    transition: background-color 0.3s ease;
  }

  .product-card {
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .product-card:hover {
    @apply bg-soft-blush;
  }

  .product-image {
    transition: transform 0.5s ease;
  }

  .product-card:hover .product-image {
    transform: scale(1.03);
  }
```

with:

```css
  .product-card {
    box-shadow: 0 1px 2px rgba(45, 20, 21, 0.03);
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
  }

  .product-card:hover {
    box-shadow:
      0 14px 28px -8px rgba(69, 40, 41, 0.12),
      0 2px 6px rgba(69, 40, 41, 0.05);
    transform: translateY(-3px);
  }

  .product-image {
    transition: transform 0.5s ease;
  }

  .product-card:hover .product-image {
    transform: scale(1.05);
  }
```

(`.product-card-hover` had zero consumers anywhere in `frontend/src` — confirmed via grep — so it is deleted outright rather than upgraded. The blush background-swap on hover is replaced with the shadow+lift language the user selected; the image zoom is standardized from `1.03` to `1.05` to match every other hover-zoom in the app.)

- [ ] **Step 2: Standardize `.image-zoom-hover` and `.gallery-main-image` transition duration to 0.5s**

Replace:

```css
  .image-zoom-hover img {
    transition: transform 0.7s ease;
  }

  .image-zoom-hover:hover img {
    transform: scale(1.05);
  }
```

with:

```css
  .image-zoom-hover img {
    transition: transform 0.5s ease;
  }

  .image-zoom-hover:hover img {
    transform: scale(1.05);
  }
```

Replace:

```css
  .gallery-main-image {
    transition: transform 0.3s ease;
  }

  .gallery-main-image:hover {
    transform: scale(1.05);
  }
```

with:

```css
  .gallery-main-image {
    transition: transform 0.5s ease;
  }

  .gallery-main-image:hover {
    transform: scale(1.05);
  }
```

- [ ] **Step 3: Remove the dead `.input-field` rule and add a focus glow to `.input-minimal`**

Replace:

```css
  .input-minimal {
    @apply border-0 border-b border-outline-variant bg-transparent px-0 shadow-none;
    border-radius: 0;
    transition: border-color 0.3s ease;
  }

  .input-minimal:focus {
    @apply border-b-primary-container outline-none shadow-none;
  }

  .input-field {
    border-bottom: 1px solid rgba(45, 20, 21, 0.15);
    transition: border-color 0.3s ease;
  }

  .input-field:focus {
    outline: none;
    border-bottom-color: #2d1415;
    box-shadow: none;
  }
```

with:

```css
  .input-minimal {
    @apply border-0 border-b border-outline-variant bg-transparent px-0 shadow-none;
    border-radius: 0;
    transition:
      border-color 0.25s ease,
      box-shadow 0.25s ease;
  }

  .input-minimal:focus {
    @apply border-b-primary-container outline-none;
    box-shadow: 0 1px 0 0 rgba(45, 20, 21, 0.15);
  }
```

(`.input-field` had zero consumers anywhere in `frontend/src` — confirmed via grep — so it is deleted outright.)

- [ ] **Step 4: Add a focus glow to `.admin-input`**

Replace:

```css
  .admin-input {
    @apply w-full border-b border-outline/30 bg-transparent py-2 font-body-md text-primary focus:border-primary focus:ring-0 focus:outline-none;
  }
```

with:

```css
  .admin-input {
    @apply w-full border-b border-outline/30 bg-transparent py-2 font-body-md text-primary focus:border-primary focus:ring-0 focus:outline-none;
    transition:
      border-color 0.25s ease,
      box-shadow 0.25s ease;
  }

  .admin-input:focus {
    box-shadow: 0 1px 0 0 rgba(45, 20, 21, 0.15);
  }
```

- [ ] **Step 5: Add the new shared elevation/interaction classes**

Add these new rules inside `@layer components`, directly after the `.admin-input:focus` rule added in Step 4 (before the closing `@layer components` brace, still above the `@layer utilities` block):

```css
  .card-lift {
    box-shadow: 0 1px 2px rgba(45, 20, 21, 0.03);
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
  }

  .card-lift:hover {
    box-shadow:
      0 14px 28px -8px rgba(69, 40, 41, 0.12),
      0 2px 6px rgba(69, 40, 41, 0.05);
    transform: translateY(-3px);
  }

  .btn-lift {
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease,
      background-color 0.3s ease,
      opacity 0.3s ease;
  }

  .btn-lift:hover {
    box-shadow: 0 8px 20px -6px rgba(69, 40, 41, 0.35);
    transform: translateY(-1px);
  }

  .btn-lift-secondary {
    transition:
      border-color 0.3s ease,
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .btn-lift-secondary:hover {
    transform: translateY(-1px);
  }

  .field-glow {
    transition:
      border-color 0.25s ease,
      box-shadow 0.25s ease;
  }

  .field-glow:focus {
    box-shadow: 0 1px 0 0 rgba(45, 20, 21, 0.15);
  }

  .section-divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(45, 20, 21, 0.12) 20%,
      rgba(45, 20, 21, 0.12) 80%,
      transparent
    );
  }
```

- [ ] **Step 6: Verify the build**

Run (from `frontend/`): `npm run build`
Expected: exits 0, no TypeScript or build errors (this task only touches CSS, so this mainly confirms nothing else broke).

- [ ] **Step 7: Manual visual check**

Run `npm run dev` from `frontend/`, open the Shop All page, the Checkout page, and (after logging into `/admin`) the Add Product form.
Expected: product cards on Shop All now lift with a soft shadow on hover (no more flat blush-background swap); Checkout's bottom-border inputs show a faint glow line under the border on focus instead of an abrupt snap; the admin product form's inputs show the same glow on focus. No layout shift.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/tailwind.css
git commit -m "style: add Whisper Lift elevation classes and upgrade shared card/input CSS"
```

---

### Task 2: HomePage

**Files:**
- Modify: `frontend/src/pages/HomePage.tsx:26,29,34,39-41,47,49,61,72,83`

**Interfaces:**
- Consumes: `card-lift`, `btn-lift`, `btn-lift-secondary`, `section-divider` from Task 1.

- [ ] **Step 1: Add lift to the two hero buttons**

Replace:

```tsx
                <Link to="/shop" className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:opacity-90 transition-opacity text-center">
                  Shop Collection
                </Link>
                <Link to="/shop" className="minimal-border text-primary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-surface-variant transition-colors text-center">
                  Explore Categories
                </Link>
```

with:

```tsx
                <Link to="/shop" className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:opacity-90 transition-opacity btn-lift text-center">
                  Shop Collection
                </Link>
                <Link to="/shop" className="minimal-border text-primary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-surface-variant transition-colors btn-lift-secondary text-center">
                  Explore Categories
                </Link>
```

- [ ] **Step 2: Add lift to the four category tiles**

Replace (fashion tile — also fixes the duration to match Task 1's Step 2 standardization):

```tsx
            <Link to="/shop?category=fashion" className="md:col-span-2 md:row-span-2 relative group overflow-hidden minimal-border rounded image-zoom-hover block">
              <LazyImage
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
```

with:

```tsx
            <Link to="/shop?category=fashion" className="md:col-span-2 md:row-span-2 relative group overflow-hidden minimal-border rounded image-zoom-hover card-lift block">
              <LazyImage
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
```

Replace:

```tsx
            <Link to="/shop?category=home-lifestyle" className="md:col-span-2 relative group overflow-hidden minimal-border rounded image-zoom-hover block bg-warm-ivory">
```

with:

```tsx
            <Link to="/shop?category=home-lifestyle" className="md:col-span-2 relative group overflow-hidden minimal-border rounded image-zoom-hover card-lift block bg-warm-ivory">
```

Replace:

```tsx
            <Link to="/shop?category=gadgets" className="relative group overflow-hidden minimal-border rounded image-zoom-hover block">
```

with:

```tsx
            <Link to="/shop?category=gadgets" className="relative group overflow-hidden minimal-border rounded image-zoom-hover card-lift block">
```

Replace:

```tsx
            <Link to="/shop?category=gifts" className="relative group overflow-hidden minimal-border rounded image-zoom-hover block bg-surface-container">
```

with:

```tsx
            <Link to="/shop?category=gifts" className="relative group overflow-hidden minimal-border rounded image-zoom-hover card-lift block bg-surface-container">
```

- [ ] **Step 3: Insert a section divider between the hero and the category grid**

Replace:

```tsx
          <div className="absolute top-0 right-0 w-1/3 h-full bg-soft-blush opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/4 rounded-full pointer-events-none" />
        </section>

        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
```

with:

```tsx
          <div className="absolute top-0 right-0 w-1/3 h-full bg-soft-blush opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/4 rounded-full pointer-events-none" />
        </section>

        <div className="section-divider max-w-container-max mx-auto" />

        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
```

- [ ] **Step 4: Standardize the category tile gradient-overlay opacity**

The fashion tile and gifts tile both overlay bottom-left text on an image via a `from-primary/NN to-transparent` gradient, but use different opacities (`/80` vs `/60`). Standardize both to `/70`. (The gadgets tile's `bg-black/20` wash is a different overlay technique, not just a different opacity — leave it as-is; unifying the technique itself is a bigger visual change than the opacity consistency this step targets.)

Replace:

```tsx
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
```

with:

```tsx
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
```

Replace:

```tsx
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
```

with:

```tsx
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
```

- [ ] **Step 5: Verify the build**

Run (from `frontend/`): `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 6: Manual visual check**

Run `npm run dev`, open `/`.
Expected: both hero buttons lift with a shadow on hover; the four category tiles lift with a shadow on hover in addition to their existing image zoom; a faint fading hairline appears between the hero and "Curated for Your Lifestyle" section; the fashion and gifts tile overlays now match in strength.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/pages/HomePage.tsx
git commit -m "style: apply Whisper Lift hovers, a section divider, and consistent overlay opacity to HomePage"
```

---

### Task 3: ProductDetailPage

**Files:**
- Modify: `frontend/src/pages/ProductDetailPage.tsx:137,141,144,176`

**Interfaces:**
- Consumes: `card-lift`, `btn-lift`, `btn-lift-secondary` from Task 1.

- [ ] **Step 1: Add lift to the Add to Cart, Buy Now, and Wishlist buttons**

Replace:

```tsx
              <button type="button" onClick={handleAddToCart} disabled={!product.inStock} className="w-full h-14 bg-primary-container text-white font-label-caps text-label-caps hover:bg-tertiary transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                Add to Cart
              </button>
              <div className="flex gap-4">
                <button type="button" onClick={handleBuyNow} disabled={!product.inStock} className="flex-1 h-14 border border-primary/20 text-primary bg-transparent font-label-caps text-label-caps hover:bg-surface-bright transition-colors flex items-center justify-center disabled:opacity-50">
                  Buy Now
                </button>
                <button type="button" aria-label="Add to Wishlist" className="w-14 h-14 border border-primary/20 text-primary bg-transparent hover:bg-surface-bright transition-colors flex items-center justify-center focus:outline-none">
                  <span className="material-symbols-outlined">favorite_border</span>
                </button>
              </div>
```

with:

```tsx
              <button type="button" onClick={handleAddToCart} disabled={!product.inStock} className="w-full h-14 bg-primary-container text-white font-label-caps text-label-caps hover:bg-tertiary transition-colors btn-lift flex items-center justify-center gap-2 disabled:opacity-50">
                Add to Cart
              </button>
              <div className="flex gap-4">
                <button type="button" onClick={handleBuyNow} disabled={!product.inStock} className="flex-1 h-14 border border-primary/20 text-primary bg-transparent font-label-caps text-label-caps hover:bg-surface-bright transition-colors btn-lift-secondary flex items-center justify-center disabled:opacity-50">
                  Buy Now
                </button>
                <button type="button" aria-label="Add to Wishlist" className="w-14 h-14 border border-primary/20 text-primary bg-transparent hover:bg-surface-bright transition-colors btn-lift-secondary flex items-center justify-center focus:outline-none">
                  <span className="material-symbols-outlined">favorite_border</span>
                </button>
              </div>
```

- [ ] **Step 2: Add lift to the related-product cards**

Replace:

```tsx
              <div key={item.name} className="group bg-white p-4 border border-outline-variant/15 hover:border-primary/30 transition-all cursor-pointer">
```

with:

```tsx
              <div key={item.name} className="group bg-white p-4 border border-outline-variant/15 hover:border-primary/30 transition-all card-lift cursor-pointer">
```

- [ ] **Step 3: Verify the build**

Run (from `frontend/`): `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 4: Manual visual check**

Run `npm run dev`, open any product detail page (e.g. `/products/<slug>` for a slug from `frontend/src/data/products.ts`).
Expected: Add to Cart / Buy Now / Wishlist buttons lift with a shadow on hover; each "You May Also Like" tile lifts with a shadow on hover in addition to the existing border-color change.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/ProductDetailPage.tsx
git commit -m "style: apply Whisper Lift hovers to ProductDetailPage buttons and related items"
```

---

### Task 4: CartPage

**Files:**
- Modify: `frontend/src/pages/CartPage.tsx:29,78`

**Interfaces:**
- Consumes: `card-lift`, `btn-lift` from Task 1.

- [ ] **Step 1: Replace the flat blush-background hover on cart line items with card-lift**

Replace:

```tsx
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-surface-container-lowest p-6 rounded-lg border border-outline/15 group hover:bg-[#E8D1C5] transition-colors duration-500">
```

with:

```tsx
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-surface-container-lowest p-6 rounded-lg border border-outline/15 group card-lift">
```

- [ ] **Step 2: Add lift to the Proceed to Checkout button**

Replace:

```tsx
              <Link to="/checkout" className="block w-full bg-[#452829] text-white font-label-caps text-label-caps tracking-[0.1em] py-4 rounded hover:bg-[#3b2d25] transition-colors mb-6 uppercase text-center">
                Proceed to Checkout
              </Link>
```

with:

```tsx
              <Link to="/checkout" className="block w-full bg-[#452829] text-white font-label-caps text-label-caps tracking-[0.1em] py-4 rounded hover:bg-[#3b2d25] transition-colors btn-lift mb-6 uppercase text-center">
                Proceed to Checkout
              </Link>
```

- [ ] **Step 3: Verify the build**

Run (from `frontend/`): `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 4: Manual visual check**

Run `npm run dev`, add an item to the cart, open `/cart`.
Expected: each cart line item lifts with a shadow on hover (no more flat blush background swap); the "Proceed to Checkout" button lifts with a shadow on hover.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/CartPage.tsx
git commit -m "style: apply Whisper Lift hovers to CartPage items and checkout CTA"
```

---

### Task 5: CheckoutPage

**Files:**
- Modify: `frontend/src/pages/CheckoutPage.tsx:238`

**Interfaces:**
- Consumes: `btn-lift` from Task 1. (Checkout's inputs already use `.input-minimal`, upgraded with zero JSX changes in Task 1.)

- [ ] **Step 1: Add lift to the Place Order button**

Replace:

```tsx
                    <button type="submit" disabled={submitting || items.length === 0} className="w-full bg-primary-container text-on-primary font-label-caps text-label-caps tracking-[0.1em] py-4 rounded hover:bg-tertiary transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
```

with:

```tsx
                    <button type="submit" disabled={submitting || items.length === 0} className="w-full bg-primary-container text-on-primary font-label-caps text-label-caps tracking-[0.1em] py-4 rounded hover:bg-tertiary transition-colors duration-300 btn-lift flex items-center justify-center gap-2 disabled:opacity-50">
```

- [ ] **Step 2: Verify the build**

Run (from `frontend/`): `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 3: Manual visual check**

Run `npm run dev`, add an item to the cart, open `/checkout`.
Expected: all form field bottom-borders show a faint glow line on focus (from Task 1); the "Place Order" button lifts with a shadow on hover.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/CheckoutPage.tsx
git commit -m "style: apply Whisper Lift hover to CheckoutPage's Place Order button"
```

---

### Task 6: ContactPage

**Files:**
- Modify: `frontend/src/pages/ContactPage.tsx:54,59,66,70,75,78,86,94`

**Interfaces:**
- Consumes: `field-glow`, `btn-lift`, `card-lift` from Task 1.

- [ ] **Step 1: Add field-glow to the five form fields**

Replace:

```tsx
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md" id="name" placeholder="Enter your name" type="text" {...register('name')} />
```

with:

```tsx
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md field-glow" id="name" placeholder="Enter your name" type="text" {...register('name')} />
```

Replace:

```tsx
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md" id="email" placeholder="Enter your email" type="email" {...register('email')} />
```

with:

```tsx
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md field-glow" id="email" placeholder="Enter your email" type="email" {...register('email')} />
```

Replace:

```tsx
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md" id="phone" placeholder="Optional" type="tel" {...register('phone')} />
```

with:

```tsx
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md field-glow" id="phone" placeholder="Optional" type="tel" {...register('phone')} />
```

Replace:

```tsx
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md" id="subject" placeholder="How can we help?" type="text" {...register('subject')} />
```

with:

```tsx
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md field-glow" id="subject" placeholder="How can we help?" type="text" {...register('subject')} />
```

Replace:

```tsx
                  <textarea className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md resize-none" id="message" placeholder="Type your message here..." rows={4} {...register('message')} />
```

with:

```tsx
                  <textarea className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md field-glow resize-none" id="message" placeholder="Type your message here..." rows={4} {...register('message')} />
```

- [ ] **Step 2: Add lift to the Send Inquiry button**

Replace:

```tsx
                <button className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-tertiary transition-colors w-full md:w-auto mt-4" type="submit">
```

with:

```tsx
                <button className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-tertiary transition-colors btn-lift w-full md:w-auto mt-4" type="submit">
```

- [ ] **Step 3: Replace the flat background-swap hover on the two info cards with card-lift**

Replace:

```tsx
                <div className="bg-surface p-8 rounded border border-outline/15 hover:bg-surface-container transition-colors">
                  <div className="flex items-center space-x-4 mb-4 text-primary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                    <h3 className="font-headline-md text-headline-md">Direct Line</h3>
                  </div>
                  <p className="font-body-md text-secondary mb-2">Speak with a concierge specialist.</p>
                  <a className="font-body-lg text-body-lg text-primary font-medium hover:underline" href="tel:+971526572012">+971 52 657 2012</a>
                </div>
                <div className="bg-surface p-8 rounded border border-outline/15 hover:bg-surface-container transition-colors">
                  <div className="flex items-center space-x-4 mb-4 text-primary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                    <h3 className="font-headline-md text-headline-md">WhatsApp</h3>
                  </div>
                  <p className="font-body-md text-secondary mb-2">Instant messaging for quick queries.</p>
                  <a className="font-body-lg text-body-lg text-primary font-medium hover:underline" href="https://wa.me/971526572012">+971 52 657 2012</a>
                </div>
```

with:

```tsx
                <div className="bg-surface p-8 rounded border border-outline/15 card-lift">
                  <div className="flex items-center space-x-4 mb-4 text-primary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                    <h3 className="font-headline-md text-headline-md">Direct Line</h3>
                  </div>
                  <p className="font-body-md text-secondary mb-2">Speak with a concierge specialist.</p>
                  <a className="font-body-lg text-body-lg text-primary font-medium hover:underline" href="tel:+971526572012">+971 52 657 2012</a>
                </div>
                <div className="bg-surface p-8 rounded border border-outline/15 card-lift">
                  <div className="flex items-center space-x-4 mb-4 text-primary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                    <h3 className="font-headline-md text-headline-md">WhatsApp</h3>
                  </div>
                  <p className="font-body-md text-secondary mb-2">Instant messaging for quick queries.</p>
                  <a className="font-body-lg text-body-lg text-primary font-medium hover:underline" href="https://wa.me/971526572012">+971 52 657 2012</a>
                </div>
```

- [ ] **Step 4: Verify the build**

Run (from `frontend/`): `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 5: Manual visual check**

Run `npm run dev`, open `/contact`.
Expected: all five form fields show a faint glow line on focus; "Send Inquiry" lifts with a shadow on hover; the Direct Line and WhatsApp tiles lift with a shadow on hover (no more flat background swap).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/ContactPage.tsx
git commit -m "style: apply Whisper Lift hovers and focus glow to ContactPage"
```

---

### Task 7: FAQPage

**Files:**
- Modify: `frontend/src/pages/FAQPage.tsx:112`

**Interfaces:**
- Consumes: `btn-lift` from Task 1.

- [ ] **Step 1: Add lift to the Contact Us CTA button**

Replace:

```tsx
              <Link to="/contact" className="bg-primary text-on-primary font-label-caps text-label-caps tracking-[0.1em] px-8 py-4 rounded hover:bg-primary-container transition-colors whitespace-nowrap">
                CONTACT US
              </Link>
```

with:

```tsx
              <Link to="/contact" className="bg-primary text-on-primary font-label-caps text-label-caps tracking-[0.1em] px-8 py-4 rounded hover:bg-primary-container transition-colors btn-lift whitespace-nowrap">
                CONTACT US
              </Link>
```

- [ ] **Step 2: Verify the build**

Run (from `frontend/`): `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 3: Manual visual check**

Run `npm run dev`, open `/faq`, scroll to the bottom "Still need help?" box.
Expected: the "CONTACT US" button lifts with a shadow on hover.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/FAQPage.tsx
git commit -m "style: apply Whisper Lift hover to FAQPage's Contact Us button"
```

---

### Task 8: AdminLoginPage

**Files:**
- Modify: `frontend/src/admin/AdminLoginPage.tsx:47-56,62-71,74-78`

**Interfaces:**
- Consumes: `field-glow`, `btn-lift` from Task 1.

- [ ] **Step 1: Add field-glow to the two inputs**

Replace:

```tsx
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b border-outline/30 bg-transparent py-2 font-body-md focus:border-primary focus:ring-0 focus:outline-none"
              placeholder="Enter admin ID"
              required
              autoComplete="username"
            />
```

with:

```tsx
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b border-outline/30 bg-transparent py-2 font-body-md focus:border-primary focus:ring-0 focus:outline-none field-glow"
              placeholder="Enter admin ID"
              required
              autoComplete="username"
            />
```

Replace:

```tsx
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-outline/30 bg-transparent py-2 font-body-md focus:border-primary focus:ring-0 focus:outline-none"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
```

with:

```tsx
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-outline/30 bg-transparent py-2 font-body-md focus:border-primary focus:ring-0 focus:outline-none field-glow"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
```

- [ ] **Step 2: Add lift to the Sign In button**

Replace:

```tsx
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-4 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
```

with:

```tsx
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-4 rounded hover:opacity-90 transition-opacity btn-lift disabled:opacity-50"
          >
```

- [ ] **Step 3: Verify the build**

Run (from `frontend/`): `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 4: Manual visual check**

Run `npm run dev`, open `/admin/login`.
Expected: both fields show a faint glow line on focus; "Sign In" lifts with a shadow on hover.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/admin/AdminLoginPage.tsx
git commit -m "style: apply Whisper Lift hover and focus glow to AdminLoginPage"
```

---

### Task 9: AdminDashboardPage and AdminProductsPage

**Files:**
- Modify: `frontend/src/admin/AdminDashboardPage.tsx:48-51,55-57`
- Modify: `frontend/src/admin/AdminProductsPage.tsx:30-36`

**Interfaces:**
- Consumes: `btn-lift`, `btn-lift-secondary` from Task 1.

- [ ] **Step 1: Add lift to AdminDashboardPage's two CTA buttons**

Replace:

```tsx
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-5 sm:px-6 py-3 rounded hover:opacity-90 transition-opacity w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
        <Link
          to="/admin/orders"
          className="inline-flex items-center justify-center gap-2 minimal-border text-primary font-label-caps text-label-caps px-5 sm:px-6 py-3 rounded hover:bg-surface-variant transition-colors w-full sm:w-auto"
        >
          View All Orders
        </Link>
```

with:

```tsx
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-5 sm:px-6 py-3 rounded hover:opacity-90 transition-opacity btn-lift w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
        <Link
          to="/admin/orders"
          className="inline-flex items-center justify-center gap-2 minimal-border text-primary font-label-caps text-label-caps px-5 sm:px-6 py-3 rounded hover:bg-surface-variant transition-colors btn-lift-secondary w-full sm:w-auto"
        >
          View All Orders
        </Link>
```

- [ ] **Step 2: Add lift to AdminProductsPage's Add Product button**

Replace:

```tsx
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-5 py-3 rounded hover:opacity-90 w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
```

with:

```tsx
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-5 py-3 rounded hover:opacity-90 btn-lift w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
```

- [ ] **Step 3: Verify the build**

Run (from `frontend/`): `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 4: Manual visual check**

Run `npm run dev`, log into `/admin`, view the Dashboard and the Products page.
Expected: "Add Product" (both pages) and "View All Orders" lift with a shadow on hover.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/admin/AdminDashboardPage.tsx frontend/src/admin/AdminProductsPage.tsx
git commit -m "style: apply Whisper Lift hover to admin dashboard and products CTAs"
```

---

## Pages requiring no changes (confirmed during planning, not tasks)

- **`AboutPage.tsx`** — no button, card, or form-field elements; its only interactive element is a text link with its own DESIGN.md-specified underline hover.
- **`AdminLayout.tsx`** — nav items already follow the DESIGN.md active-state pattern (background fill on active); no card/button/input elements to upgrade.
- **`AdminOrdersPage.tsx`**, **`AdminOrderDetailPage.tsx`** — every candidate element is either a table/list row (already using the correct tint-hover pattern for dense tabular data, not a lift) or a filter/status pill (a different component type than DESIGN.md's primary/secondary buttons).
- **`Header.tsx`**, **`Footer.tsx`**, **`AnnouncementBar.tsx`**, **`Logo.tsx`** — contain only text nav links, which already use the DESIGN.md-specified underline/color hover; no card, button, or input elements in scope for this refresh.
- **`ShopAllPage.tsx`** — its product cards use the shared `.product-card`/`.product-image` classes upgraded in Task 1 with zero JSX changes; its sidebar filter panel and pagination controls are static/non-card elements out of scope per the list rule.
- **Redundant `tracking-[0.1em]` on `label-caps` elements** (e.g. `frontend/src/pages/FAQPage.tsx:67`, `frontend/src/pages/CheckoutPage.tsx:227`) — `text-label-caps` already sets `letter-spacing: 0.1em` via `tailwind.config.ts`, so the explicit `tracking-[0.1em]` alongside it computes to the exact same value. Removing it changes zero pixels on screen, so per YAGNI it's skipped rather than turned into a multi-file cleanup task with no visible outcome.
