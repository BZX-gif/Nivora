# NIVORA — User Flows

## 1. Buy / Rent discovery
Home hero search (Buy/Rent toggle, locality, type, budget) → `/buy` or `/rent` with query
params → Discovery: text search + filter drawer (type, budget, beds/baths, furnishing,
advertiser type, area, availability) + sort (recent, price ↑↓) + list/map toggle.
Map markers sync with cards (hover highlights, click flies + opens preview).
Empty state offers "Clear all filters". Cards → `/property/[id]`.

## 2. Property details
Gallery (thumbs, swipe, lightbox, keyboard) → specs, amenities, location map →
advertiser card (type, phone-verification-only label) → Save / Reveal phone (demo text,
never dialled) / WhatsApp (demo modal) / Send enquiry (validated modal, saved locally) /
Report listing. Similar listings below.

## 3. List your property (wizard)
8 steps: Purpose → Type → Location → Details → Price → Photos (upload, preview, reorder,
remove, type/size validation, progress) → Advertiser details → Preview.
Draft auto-saves to `localStorage`. Submit → status **Pending Moderation** → success page
explains the moderation flow → dashboard tracks status. Owner can mark unavailable,
expire, renew, delete, preview.

## 4. Accounts (demo)
Sign up / sign in with any email (local session only). Email containing "admin" → admin
role. Account page: profile, saved count, enquiries, sign out, clear demo data.
Dashboard: overview counts (real local counts only — no fabricated analytics), listings,
enquiries (sent + labelled demo samples received).

## 5. Admin & moderation (demo)
`/admin` requires admin role (demo gate; production must enforce server-side).
Moderation queue (user submissions + labelled demo samples) with Approve/Reject,
reports list, advertisers list, activity counts.

## 6. Saved properties
Heart on any card/detail toggles favourite (localStorage). `/saved` lists them; mobile
bottom nav gives one-tap access.
