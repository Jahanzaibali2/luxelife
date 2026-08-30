---
name: LuxeLife Editorial System
colors:
  surface: '#fff8f7'
  surface-dim: '#e0d8d7'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2f1'
  surface-container: '#f5eceb'
  surface-container-high: '#efe6e6'
  surface-container-highest: '#e9e1e0'
  on-surface: '#1e1b1b'
  on-surface-variant: '#504444'
  inverse-surface: '#342f2f'
  inverse-on-surface: '#f8efee'
  outline: '#827474'
  outline-variant: '#d4c3c2'
  surface-tint: '#795556'
  primary: '#2d1415'
  on-primary: '#ffffff'
  primary-container: '#452829'
  on-primary-container: '#b78e8e'
  inverse-primary: '#e9bcbc'
  secondary: '#5d5e61'
  on-secondary: '#ffffff'
  secondary-container: '#dfdfe2'
  on-secondary-container: '#616365'
  tertiary: '#251911'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b2d25'
  on-tertiary-container: '#a89489'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdada'
  primary-fixed-dim: '#e9bcbc'
  on-primary-fixed: '#2d1415'
  on-primary-fixed-variant: '#5f3e3f'
  secondary-fixed: '#e2e2e4'
  secondary-fixed-dim: '#c5c6c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#454749'
  tertiary-fixed: '#f5ded2'
  tertiary-fixed-dim: '#d8c2b6'
  on-tertiary-fixed: '#251912'
  on-tertiary-fixed-variant: '#53443b'
  background: '#fff8f7'
  on-background: '#1e1b1b'
  surface-variant: '#e9e1e0'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '600'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The brand personality is rooted in **Modern Minimalism with an Editorial Edge**. Designed specifically for the discerning UAE market, the design system avoids the cluttered, aggressive tactics of traditional marketplaces in favor of a curated, gallery-like experience. 

The aesthetic is characterized by high-contrast typography, generous whitespace, and a sophisticated, "warm-neutral" atmosphere. The goal is to evoke a sense of calm, exclusivity, and quality—reassuring the user that "their lifestyle deserves better choices." Every element feels intentional, balanced, and premium, prioritizing clarity and elegance over decorative ornamentation.

## Colors

The palette is a sophisticated blend of earthy warmth and urban neutrals:

*   **Deep Cocoa (#452829):** The anchor of the brand. Used for primary calls-to-action, high-level headings, and global navigation links to ensure strong legibility and brand recognition.
*   **Charcoal Grey (#57595B):** Used for secondary text, metadata, and iconography. It provides enough contrast for accessibility without the harshness of pure black.
*   **Soft Blush (#E8D1C5):** A delicate accent color. Use this for editorial pull-outs, hover states on buttons, and as a subtle background for category highlights.
*   **Warm Ivory (#F3E8DF):** The primary canvas. This off-white base provides a soft, premium feel that reduces eye strain compared to stark white.
*   **White (#FFFFFF):** Reserved for product cards and form inputs to make them "pop" against the ivory background, creating a natural sense of elevation.

## Typography

The typography system uses **Montserrat** for its geometric, confident authority in headings, paired with **Hanken Grotesk** for a sharp, contemporary body experience.

*   **Editorial Hierarchy:** Large, high-impact headings should be used to frame product stories.
*   **Uppercase Usage:** Limit uppercase to `label-caps`. Use this for navigation items, small eyebrow headers, and category tags to create an organized, architectural feel.
*   **Readability:** Ensure `body-lg` is used for product descriptions to maintain a luxurious, easy-to-read flow.
*   **Contrast:** Pair Deep Cocoa headings with Charcoal Grey body text to establish a clear visual hierarchy.

## Layout & Spacing

The layout follows a **Fluid Grid** model with high-margin "breathing room."

*   **Grid:** A 12-column system for desktop, 6-column for tablet, and 2-column for mobile.
*   **Rhythm:** Use an 8px base unit. Section vertical spacing is intentionally large (120px+) to separate distinct editorial "stories" or product categories.
*   **Product Grids:** Product cards should have generous gutters (24px) to ensure each item is perceived as a standalone piece of art rather than a commodity in a list.
*   **Mobile:** Reduce side margins to 20px but maintain significant vertical spacing between sections to preserve the premium feel.

## Elevation & Depth

This system avoids heavy drop shadows and 3D effects. Depth is achieved through **Tonal Layering** and **Fine Outlines**:

*   **Tonal Layering:** Objects like product cards and cart drawers use White (#FFFFFF) to sit on top of the Warm Ivory (#F3E8DF) page background. This creates a natural, soft elevation without the need for shadows.
*   **Refined Borders:** Use 1px solid lines in Charcoal Grey at 10-15% opacity for subtle containment. Borders should feel like pencil lines—precise and minimal.
*   **Interaction:** On hover, instead of a shadow, use a subtle shift in background color to Soft Blush (#E8D1C5) or a slight scale-up of the product image.

## Shapes

The shape language is **Structured and Softened**.

*   **Corner Radius:** Use the `Soft` (4px) setting for buttons, input fields, and cards. This provides just enough friendliness to feel modern while maintaining the architectural integrity of a luxury brand.
*   **Media:** Product photography should remain sharp (0px) or use the same soft (4px) radius to ensure a consistent, clean-cut look.
*   **Icons:** Use 2px stroke-weight icons with slightly rounded caps to match the typography's weight.

## Components

*   **Buttons:** Primary buttons are Deep Cocoa with White text, using `label-caps` for the label. Secondary buttons use a fine 1px border. There is no rounding beyond 4px; avoid pill shapes.
*   **Product Cards:** White background, minimal borders. The focus is 90% on the imagery. Price and title are aligned left in Charcoal Grey.
*   **Input Fields:** Minimalist design with a bottom-border-only style or a very faint 1px full border. Focus state should change the border color to Deep Cocoa.
*   **Chips/Tags:** Use the Soft Blush background with Deep Cocoa text for "New Arrival" or "Limited Edition" tags.
*   **Navigation:** Top-tier navigation uses `label-caps` with significant letter spacing. The active state is indicated by a simple 1px underline in Deep Cocoa rather than a background change.
*   **Editorial Banners:** Full-width imagery with centered Montserrat typography. Text should be high-contrast (White or Deep Cocoa depending on the image).