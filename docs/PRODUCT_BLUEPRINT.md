# NIVORA — Product Blueprint

**Tagline:** Find your place.
**Parent brand:** An initiative by HYB (attributed subtly in footer/About; NIVORA has its own identity).
**Demo market:** Jaipur, Rajasthan, India.

## Positioning

NIVORA is a real-estate marketplace connecting people looking to buy or rent with owners,
independent brokers, agencies, and builders/developers. It helps people discover properties,
compare advertised prices, understand neighbourhoods, and contact advertisers.

NIVORA is a **connection platform**. It does not sell, own, legally verify, or guarantee
the properties advertised on it. This principle is built into the UI: advertiser types are
always shown, prices are labelled "advertised", phone verification is labelled as phone
verification only, and no "verified property" / "guaranteed ownership" claims exist anywhere.

## User journeys

1. **Buy** — search, filter, sort, compare, view details, contact advertiser.
2. **Rent** — same discovery engine, monthly rents, furnishing filters.
3. **Advertise** — 8-step guided listing wizard with draft saving, photo upload, preview.
4. **Manage** — dashboard with listing statuses (Draft, Pending Moderation, Published,
   Rejected, Expired, Unavailable), enquiries, saved properties.

## Pages (21)

Homepage, Buy, Rent, Explore (map), Property details, List your property, Listing preview
(wizard step 8 + `/property/user-*` preview), Listing success, Sign in, Sign up, Account,
Saved, Dashboard, My listings, Enquiries, Admin, About, Contact, Privacy, Terms.

## Demo data honesty

All 22 properties in `src/data/demo-properties.ts` are fictional and labelled "Demo
listing" in the UI. Contact numbers are illustrative (`+91 98290 0000x`) and are never
dialled — the phone is revealed as text with a "do not call" note, WhatsApp opens an
explanatory modal, and enquiries are saved locally with a clear "not delivered" message.
Map markers are illustrative locations, not exact addresses.

## Trust & transparency rules (enforced in UI)

- Advertiser type always visible (Owner / Independent Broker / Agency / Builder).
- Prices labelled "Advertised price".
- Phone verification labelled "phone verification only".
- Report-listing flow on every detail page.
- Listings can expire / be marked unavailable.
- Footer + About explain what NIVORA does and does not verify.
- Legal pages are marked "Draft — review before production launch".
