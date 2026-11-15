"use client";

import Link from "next/link";
import { ArrowLeft, Bath, BedDouble, Check, MapPin, Maximize, ShieldCheck } from "lucide-react";
import { useUserListings } from "@/lib/store";
import { formatArea, formatPrice, timeAgo } from "@/lib/format";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { DemoBadge, StatusBadge } from "@/components/ui/primitives";

/**
 * Preview of a user-submitted (localStorage) listing.
 * Demo listings are rendered by the server page; user listings resolve here.
 */
export function UserPropertyPreview({ id }: { id: string }) {
  const { listings } = useUserListings();
  const p = listings.find((l) => l.id === id);

  if (!p) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-ink">Listing not found</h1>
        <p className="mt-3 text-stone2">
          This listing was submitted on this device but could not be found. It may have been cleared.
        </p>
        <Link href="/dashboard/listings" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-white">
          Go to my listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link href="/dashboard/listings" className="inline-flex items-center gap-2 text-sm font-medium text-stone2 transition hover:text-ink rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to my listings
      </Link>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-800">
        <strong>Your listing preview.</strong> This is how visitors will see it once published. It is currently{" "}
        <StatusBadge status={p.status} /> and is not visible in public search.
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              {p.listingType === "buy" ? "For sale" : "For rent"}
            </span>
            <span className="rounded-full bg-mist px-3 py-1 text-[11px] font-medium text-ink">{p.category}</span>
            <DemoBadge />
          </div>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">{p.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-[15px] text-stone2">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {p.address}, {p.locality}, {p.city}
          </p>
        </div>
        <p className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {formatPrice(p.price, p.listingType)}
        </p>
      </div>

      <div className="mt-6">
        {p.images.length > 0 ? (
          <PropertyGallery images={p.images} title={p.title} />
        ) : (
          <div className="flex aspect-[16/10] items-center justify-center rounded-3xl bg-mist text-stone2">
            No photographs added
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-x-8 gap-y-3 rounded-2xl border border-line bg-white p-5">
            {p.bedrooms != null && (
              <span className="inline-flex items-center gap-2 text-[15px] text-ink">
                <BedDouble className="h-5 w-5 text-bronze" aria-hidden="true" /> {p.bedrooms} bedrooms
              </span>
            )}
            {p.bathrooms != null && (
              <span className="inline-flex items-center gap-2 text-[15px] text-ink">
                <Bath className="h-5 w-5 text-bronze" aria-hidden="true" /> {p.bathrooms} bathrooms
              </span>
            )}
            <span className="inline-flex items-center gap-2 text-[15px] text-ink">
              <Maximize className="h-5 w-5 text-bronze" aria-hidden="true" /> {formatArea(p.areaSqft)}
            </span>
            {p.furnishing && <span className="text-[15px] text-stone2">{p.furnishing}</span>}
          </div>

          <section aria-labelledby="desc" className="mt-10">
            <h2 id="desc" className="font-serif text-2xl text-ink">About this property</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-stone2">{p.description}</p>
          </section>

          {p.amenities.length > 0 && (
            <section aria-labelledby="amen" className="mt-10">
              <h2 id="amen" className="font-serif text-2xl text-ink">Amenities</h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {p.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2.5 text-[15px] text-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist">
                      <Check className="h-3.5 w-3.5 text-bronze" aria-hidden="true" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-lg text-white">
                {p.advertiser.name.charAt(0)}
              </span>
              <div>
                <p className="font-semibold text-ink">{p.advertiser.name}</p>
                <p className="text-sm text-stone2">{p.advertiser.type} · Member since {p.advertiser.memberSince}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-mist px-4 py-3 text-sm text-stone2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-bronze" aria-hidden="true" />
              Phone not verified yet. NIVORA does not verify ownership or legality.
            </div>
            <p className="mt-4 text-sm text-stone2">
              Phone (demo): <span className="font-medium text-ink">{p.advertiser.phone}</span>
            </p>
            <p className="mt-2 text-xs text-muted">{timeAgo(p.listedDaysAgo)} · Demo listing</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
