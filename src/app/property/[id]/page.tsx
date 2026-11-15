import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, Check, MapPin, Maximize, ShieldCheck } from "lucide-react";
import { DEMO_PROPERTIES } from "@/data/demo-properties";
import { formatArea, formatPrice, pricePerSqft, timeAgo } from "@/lib/format";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyCard } from "@/components/property/PropertyCard";
import { DemoBadge, SectionHeading } from "@/components/ui/primitives";
import { ContactActions, ReportListing } from "@/components/property/ContactActions";
import { UserPropertyPreview } from "@/components/property/UserPropertyPreview";
import { SinglePropertyMap } from "@/components/maps/SinglePropertyMap";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return DEMO_PROPERTIES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = DEMO_PROPERTIES.find((x) => x.id === params.id);
  if (!p) return { title: "Property not found" };
  return {
    title: `${p.title} — ${formatPrice(p.price, p.listingType)}`,
    description: `${p.title} in ${p.locality}, ${p.city}. Advertised price ${formatPrice(p.price, p.listingType)}. Demo listing on NIVORA.`,
    openGraph: {
      title: p.title,
      description: `${p.locality}, ${p.city} — advertised at ${formatPrice(p.price, p.listingType)} (demo listing).`,
      images: [p.images[0]],
    },
  };
}

export default function PropertyDetailPage({ params }: PageProps) {
  /* User-submitted listings live in localStorage — render a client preview. */
  if (params.id.startsWith("user-")) {
    return <UserPropertyPreview id={params.id} />;
  }
  const p = DEMO_PROPERTIES.find((x) => x.id === params.id);
  if (!p) notFound();

  const similar = DEMO_PROPERTIES.filter(
    (x) => x.id !== p.id && (x.category === p.category || x.locality === p.locality)
  ).slice(0, 3);

  const specs: { label: string; value: string }[] = [
    { label: "Property type", value: p.category },
    { label: "Listing", value: p.listingType === "buy" ? "For sale" : "For rent" },
    { label: "Advertised price", value: formatPrice(p.price, p.listingType) },
    ...(p.listingType === "buy"
      ? [{ label: "Price per sq.ft.", value: `₹${pricePerSqft(p.price, p.areaSqft)}` }]
      : []),
    ...(p.bedrooms != null ? [{ label: "Bedrooms", value: String(p.bedrooms) }] : []),
    ...(p.bathrooms != null ? [{ label: "Bathrooms", value: String(p.bathrooms) }] : []),
    { label: "Area", value: formatArea(p.areaSqft) },
    ...(p.furnishing ? [{ label: "Furnishing", value: p.furnishing }] : []),
    ...(p.negotiable != null ? [{ label: "Negotiable", value: p.negotiable ? "Yes" : "No" }] : []),
    ...(p.maintenance ? [{ label: "Maintenance", value: `${formatPrice(p.maintenance, "buy")}/mo` }] : []),
    { label: "Listed", value: timeAgo(p.listedDaysAgo) },
  ];

  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link
        href={p.listingType === "buy" ? "/buy" : "/rent"}
        className="inline-flex items-center gap-2 text-sm font-medium text-stone2 transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-full"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to results
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
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
            {p.landmark && <span className="text-muted">· {p.landmark}</span>}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {formatPrice(p.price, p.listingType)}
          </p>
          <p className="mt-1 text-sm text-muted">Advertised price · {timeAgo(p.listedDaysAgo)}</p>
        </div>
      </div>

      <div className="mt-6">
        <PropertyGallery images={p.images} title={p.title} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Main column */}
        <div className="min-w-0">
          {/* Quick facts */}
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

          {/* Description */}
          <section aria-labelledby="desc-heading" className="mt-10">
            <h2 id="desc-heading" className="font-serif text-2xl text-ink">About this property</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-stone2">{p.description}</p>
          </section>

          {/* Amenities */}
          <section aria-labelledby="amen-heading" className="mt-10">
            <h2 id="amen-heading" className="font-serif text-2xl text-ink">Amenities</h2>
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

          {/* Specifications */}
          <section aria-labelledby="spec-heading" className="mt-10">
            <h2 id="spec-heading" className="font-serif text-2xl text-ink">Specifications</h2>
            <dl className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
              {specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <dt className="text-sm text-muted">{s.label}</dt>
                  <dd className="text-sm font-medium text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Location */}
          <section aria-labelledby="loc-heading" className="mt-10">
            <h2 id="loc-heading" className="font-serif text-2xl text-ink">Location</h2>
            <p className="mt-2 text-sm text-stone2">
              {p.locality}, {p.city}. The marker shows an illustrative demo location — not the exact address.
            </p>
            <div className="relative mt-4 h-80 overflow-hidden rounded-3xl border border-line">
              <SinglePropertyMap property={p} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
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
              {p.advertiser.phoneVerified
                ? "Phone number verified (phone verification only — not property or ownership verification)."
                : "Phone number not verified. Treat contact with care."}
            </div>
            <ContactActions property={p} />
            <p className="mt-4 text-center text-xs leading-relaxed text-muted">
              Demo contact details — they do not belong to real people.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-mist p-6">
            <h3 className="font-medium text-ink">Stay safe</h3>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-stone2">
              <li>· Meet the advertiser and inspect the property in person.</li>
              <li>· Verify ownership and documents yourself before paying.</li>
              <li>· Never pay in advance for a property you have not seen.</li>
            </ul>
            <ReportListing title={p.title} />
          </div>
        </aside>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-16" aria-labelledby="similar-heading">
          <SectionHeading eyebrow="Keep exploring" title="Similar demo properties" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <PropertyCard key={s.id} property={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
