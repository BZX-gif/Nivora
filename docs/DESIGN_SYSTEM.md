# NIVORA — Design System

## Brand mark

An original geometric symbol: the letter **N** whose diagonal rises into a **roofline**,
forming a doorway in the negative space. No house/pin clipart. Inline SVG component
(`src/components/brand/Logo.tsx`) using `currentColor`, plus static assets in
`public/brand/` (logo, symbol, wordmark, white variant, favicon, app icon).

## Colour tokens (Tailwind `tailwind.config.ts`)

| Token | Value | Use |
|---|---|---|
| `paper` | `#FFFFFF` | Primary background |
| `mist` | `#F7F7F5` | Secondary background |
| `ink` | `#151515` | Primary text / primary buttons |
| `stone2` | `#707070` | Secondary text |
| `muted` | `#999999` | Tertiary text |
| `line` | `#EAEAE7` | Borders |
| `coal` | `#171717` | Dark surfaces (footer, CTA) |
| `bronze` | `#A58A68` | Sparing accent (eyebrows, icons) |
| `bronzedark` | `#8A7154` | Bronze hover |

No blue/purple gradients, no neon, no glassmorphism beyond subtle backdrop blur on nav/cards.

## Typography

- **Interface:** Inter Variable (self-hosted via Fontsource — no Google Fonts dependency).
- **Editorial headlines:** Fraunces Variable (serif) for hero, section titles, prices.
- Scale: hero 42–64px serif, section titles 30–36px serif, body 15–17px Inter.

## Shape, spacing, elevation

- Radius: cards 16–24px (`rounded-2xl/3xl`), buttons/pills fully rounded.
- Shadows: `shadow-card` (subtle), `shadow-lift` (hover), `shadow-pop` (modals/drawers).
- Max content width: 80rem (`max-w-shell`). Generous whitespace; photography leads.

## Components

`Button` / `ButtonLink` (primary, outline, ghost, dark, bronze), `Badge`, `DemoBadge`,
`StatusBadge`, `CardSkeleton`, `EmptyState`, `SectionHeading`, `Reveal` (scroll entrance),
`Modal` (accessible, Escape to close), `PropertyCard`, `PropertyGallery` + lightbox,
`SearchBar`, `FilterDrawer`, `PropertyMap`, `ListingWizard`, `Logo`.

## Motion

Framer Motion, transform/opacity only, 0.18–0.6s, custom ease `cubic-bezier(0.22,1,0.36,1)`.
Card hover: image scale 1.03 + lift. `prefers-reduced-motion` disables animation globally.
60fps target; no layout-thrashing animations.

## Accessibility

Semantic HTML, skip link, visible focus rings everywhere, labelled form controls,
`aria-pressed`/`aria-selected`/`aria-current` where relevant, alt text on all images,
keyboard-operable gallery/lightbox/drawers/modals, contrast-checked neutrals on white.
