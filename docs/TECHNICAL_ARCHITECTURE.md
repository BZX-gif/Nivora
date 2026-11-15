# NIVORA — Technical Architecture

## Stack

- **Next.js 14 (App Router) + TypeScript** — server components for content pages,
  client components for interactive islands.
- **Tailwind CSS 3** — design tokens in `tailwind.config.ts` (colours, fonts, shadows).
- **Framer Motion** — entrance, drawer, modal, menu animations (transform/opacity only).
- **Leaflet + OpenStreetMap** — demo map, dynamically imported (`ssr: false`) so map
  code never ships on non-map pages. Custom price-label markers, popups, fly-to sync.
- **Lucide** — icons. **Fontsource variable fonts** — self-hosted Inter + Fraunces
  (no Google Fonts runtime/build dependency).

## Structure

```
src/
  app/            routes (21 pages) + layout, sitemap, robots
  components/
    brand/        Logo (inline SVG symbol + wordmark)
    layout/       Navbar (sticky + mobile bottom nav), Footer
    property/     PropertyCard, PropertyGallery, ContactActions, UserPropertyPreview
    search/       SearchBar, FilterDrawer, Discovery (search/filter/sort/map sync)
    maps/         PropertyMap (Leaflet), SinglePropertyMap
    forms/        ListingWizard (8 steps)
    ui/           Button, Badge, Modal, Skeleton, Reveal, EmptyState…
  data/           demo-properties.ts (22 fictional Jaipur listings)
  lib/            store.tsx (favourites/session/listings/enquiries/toasts),
                  filters.ts, format.ts (INR lakh/crore formatting)
  types/          property.ts (typed models)
public/brand/     logo SVG assets (logo, symbol, wordmark, white, favicon, app icon)
docs/             blueprint, design system, schema, flows, architecture
```

## Data & state (demo mode)

- Listings: `DEMO_PROPERTIES` (centralized; replace with DB queries in production).
- Favourites, session, user listings, enquiries, draft, status overrides: `localStorage`
  via `src/lib/store.tsx` providers. Nothing leaves the browser.
- Filters/sort run client-side over the demo set (`applyFilters` / `applySort`).

## Server/client boundaries

- Server: homepage, property detail (SSG + metadata), static pages.
- Client: Discovery, map, gallery, wizard, dashboards, auth, admin.
- Event handlers are never passed from server to client components (detail map uses a
  client wrapper, `SinglePropertyMap`).

## Performance & SEO

- `next/image` with remote Unsplash CDN + branded fallback; lazy loading; responsive sizes.
- Dynamic map import; code-split routes; self-hosted fonts.
- Metadata, Open Graph, sitemap, robots, per-property metadata.

## Environment variables

None required for the demo. Production will need (documented, never hardcoded):
`DATABASE_URL`, `NEXTAUTH_SECRET` (or equivalent), `NEXT_PUBLIC_MAP_TILE_URL`,
`IMAGE_STORAGE_BUCKET`, `NEXT_PUBLIC_SITE_URL`. The demo map uses keyless OpenStreetMap
tiles with attribution; a keyed provider can be swapped in `PropertyMap`.

## Production checklist (before launch)

1. Replace demo data with database queries + server-side auth/authorization.
2. Managed image storage with signed uploads; server-side validation.
3. Real enquiry delivery, moderation workflow, report handling.
4. Counsel review of Privacy/Terms drafts.
5. Set `metadataBase` / sitemap domain to the real site URL.
