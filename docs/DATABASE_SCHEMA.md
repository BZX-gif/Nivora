# NIVORA — Database Schema (production target)

The demo build stores data in the browser (`localStorage`) and reads listings from
`src/data/demo-properties.ts`. The schema below is the production target (PostgreSQL).
No production database is connected in this build.

## Tables

### users
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| email | citext unique | |
| password_hash | text | never store plaintext |
| name | text | |
| role | enum(user, admin) | |
| phone | text nullable | |
| phone_verified_at | timestamptz nullable | phone verification only |
| created_at | timestamptz | |

### advertisers
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| type | enum(owner, broker, agency, builder) | |
| business_name | text | |
| whatsapp | text nullable | |
| created_at | timestamptz | |

### listings
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| advertiser_id | uuid FK → advertisers | |
| title | text | |
| listing_type | enum(buy, rent) | |
| category | enum(apartment, house, villa, plot, commercial) | |
| price | numeric(12,2) | advertised price; monthly for rent |
| negotiable | boolean | |
| maintenance | numeric nullable | monthly |
| city | text | |
| locality | text | |
| address | text | approximate |
| landmark | text nullable | |
| lat / lng | double precision | illustrative until geocoded |
| bedrooms / bathrooms | smallint nullable | |
| area_sqft | numeric | |
| furnishing | enum(unfurnished, semi, full) nullable | |
| description | text | |
| status | enum(draft, pending, published, rejected, expired, unavailable) | |
| expires_at | timestamptz nullable | listings must be able to expire |
| created_at / updated_at | timestamptz | |

### listing_images
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| listing_id | uuid FK → listings | |
| url | text | managed object storage (signed URLs) |
| position | smallint | cover = 0 |
| created_at | timestamptz | |

### amenities + listing_amenities (many-to-many)
### favourites (user_id, listing_id, created_at)
### enquiries (id, listing_id, sender_user_id nullable, name, contact, message, status, created_at)
### reports (id, listing_id, reporter_user_id nullable, reason, details, status, created_at)
### moderation_events (id, listing_id, moderator_id, action, note, created_at)

## Indexes

- `listings(status, listing_type, city, locality)` for discovery.
- `listings(price)`, `listings(area_sqft)` for range filters.
- GIN trigram on `title`, `locality` for text search.
- PostGIS `geography(Point)` on listings for map radius search (optional phase 2).

## Rules

- Authorization enforced server-side (RLS / API checks). Frontend role checks are UX only.
- Images in managed storage; never hotlink.
- Soft-delete listings; keep moderation audit trail.
