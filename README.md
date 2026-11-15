# NIVORA — Find your place.

A premium real-estate discovery and listing marketplace (demo build for the Jaipur market).
An initiative by HYB.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # TypeScript check
```

## Demo mode

- **22 fictional Jaipur listings** (`src/data/demo-properties.ts`) — all labelled "Demo
  listing" in the UI. No real inventory, no real contact details.
- **Sign-in:** any email works (local session only). Include the word `admin` in the email
  to preview the admin & moderation area (`/admin`).
- **Favourites, enquiries, submitted listings, drafts** persist in your browser
  (`localStorage`) — clear them from the Account page.
- **Map:** Leaflet + OpenStreetMap (keyless, attributed). Markers are illustrative
  locations, not exact addresses.
- **Photos:** Unsplash CDN with a branded fallback if a photo fails to load.

## What works

Search, filters, sorting, list↔map sync, favourites, property galleries with lightbox,
8-step listing wizard with photo upload + draft saving, advertiser dashboard with listing
status management, enquiries, admin moderation queue, responsive mobile nav, toasts,
skeletons, empty states, SEO metadata, sitemap and robots.

## Docs

- `docs/PRODUCT_BLUEPRINT.md` — positioning, journeys, trust rules
- `docs/DESIGN_SYSTEM.md` — brand, tokens, components, motion, accessibility
- `docs/DATABASE_SCHEMA.md` — production PostgreSQL target
- `docs/USER_FLOWS.md` — step-by-step flows
- `docs/TECHNICAL_ARCHITECTURE.md` — stack, structure, production checklist

## Brand

Original geometric mark: an **N** whose diagonal rises into a **roofline**, forming a
doorway in negative space. Assets in `public/brand/`, reusable component in
`src/components/brand/Logo.tsx`.
