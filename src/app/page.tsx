import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Handshake, Search, ShieldCheck } from "lucide-react";
import { PropertyCard, SafeImage } from "@/components/property/PropertyCard";
import { SearchBar } from "@/components/search/SearchBar";
import { DEMO_LOCALITY_META, DEMO_PROPERTIES } from "@/data/demo-properties";
import { ButtonLink, DemoBadge, Reveal, SectionHeading } from "@/components/ui/primitives";
import type { PropertyCategory } from "@/types/property";

export const metadata: Metadata = {
  title: "NIVORA — Find your place.",
  description:
    "Discover properties, explore neighbourhoods, and connect directly with the people advertising them.",
};

const CATEGORY_IMAGES: Record<PropertyCategory, string> = {
  Apartment: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop",
  "Independent House": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop",
  Villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=900&auto=format&fit=crop",
  "Plot / Land": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=900&auto=format&fit=crop",
  Commercial: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=900&auto=format&fit=crop",
};

const CATEGORIES: PropertyCategory[] = ["Apartment", "Independent House", "Villa", "Plot / Land", "Commercial"];

export default function HomePage() {
  const featured = DEMO_PROPERTIES.filter((p) => p.featured).slice(0, 3);
  const popularLocalities = [
    "Vaishali Nagar",
    "Mansarovar",
    "Malviya Nagar",
    "Jagatpura",
    "C-Scheme",
    "Ajmer Road",
    "Tonk Road",
    "Bani Park",
  ];

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="border-b border-line bg-mist">
        <div className="mx-auto max-w-shell px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-14 lg:pt-24">
          {/*
            Text and photograph form one band: both columns start on the same top
            edge, and the trust row is anchored to the photograph's baseline via
            mt-auto, so the composition closes on a single line.
          */}
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
            <div className="flex flex-col">
              <Reveal>
                <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-stone2">
                  <span className="h-1.5 w-1.5 rounded-full bg-bronze" aria-hidden="true" />
                  Jaipur demo marketplace
                </p>
                <h1 className="mt-6 text-balance font-serif text-[40px] leading-[1.06] tracking-tight text-ink sm:text-[52px] lg:text-[56px] xl:text-[64px]">
                  Find a place that feels like yours.
                </h1>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone2">
                  Discover properties, explore neighbourhoods, and connect directly with
                  the people advertising them.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="mt-7">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone2">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-bronze" aria-hidden="true" />
                    Advertiser types clearly labelled
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Handshake className="h-4 w-4 text-bronze" aria-hidden="true" />
                    Contact advertisers directly
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift sm:aspect-[16/10] lg:aspect-auto lg:h-[420px]">
                <SafeImage
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop"
                  alt="A beautiful home at dusk in Jaipur"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Below lg the card sits under the photo; on desktop it rests on the
                  photo's lower-left corner so it never covers the subject. */}
              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-card sm:justify-start sm:gap-6 sm:px-5 lg:absolute lg:-bottom-6 lg:left-8 lg:mt-0 lg:shadow-lift">
                <div>
                  <p className="font-serif text-xl leading-none text-ink">{DEMO_PROPERTIES.length}</p>
                  <p className="mt-1 text-[11px] text-muted">Demo properties</p>
                </div>
                <div className="h-8 w-px bg-line" aria-hidden="true" />
                <div>
                  <p className="font-serif text-xl leading-none text-ink">{Object.keys(DEMO_LOCALITY_META).length}</p>
                  <p className="mt-1 text-[11px] text-muted">Localities</p>
                </div>
                <div className="h-8 w-px bg-line" aria-hidden="true" />
                <div>
                  <p className="font-serif text-xl leading-none text-ink">Jaipur</p>
                  <p className="mt-1 text-[11px] text-muted">Demo market</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 lg:mt-12">
              <SearchBar />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="mx-auto max-w-shell px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="featured-heading">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured"
              title="Spaces worth discovering."
              message="A small selection of demo properties across Jaipur — illustrative only, not real inventory."
            />
            <ButtonLink href="/explore" variant="outline">
              View all properties <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <PropertyCard property={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="border-y border-line bg-mist" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-shell px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Browse by type"
              title="Every kind of place."
              message="Apartments, houses, villas, plots and commercial spaces — filter by the kind of place you need."
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-5">
            {CATEGORIES.map((cat, i) => {
              const count = DEMO_PROPERTIES.filter((p) => p.category === cat).length;
              return (
                <Reveal key={cat} delay={i * 0.06}>
                  <Link
                    href={`/explore?category=${encodeURIComponent(cat)}`}
                    className="group relative block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                    aria-label={`Explore ${cat} properties`}
                  >
                    <div className="relative aspect-[3/4] bg-mist">
                      <SafeImage
                        src={CATEGORY_IMAGES[cat]}
                        alt={`${cat} in Jaipur`}
                        sizes="(max-width: 1024px) 50vw, 20vw"
                        className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" aria-hidden="true" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="font-serif text-lg leading-tight text-white">{cat}</p>
                        <p className="mt-0.5 text-xs text-white/75">{count} demo {count === 1 ? "listing" : "listings"}</p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Locations ---------- */}
      <section className="mx-auto max-w-shell px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="locations-heading">
        <Reveal>
          <SectionHeading
            eyebrow="Neighbourhoods"
            title="Find your next address."
            message="Explore demo properties by locality. Marker locations are illustrative, not exact addresses."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularLocalities.map((loc, i) => {
            const count = DEMO_PROPERTIES.filter((p) => p.locality === loc).length;
            return (
              <Reveal key={loc} delay={i * 0.05}>
                <Link
                  href={`/explore?locality=${encodeURIComponent(loc)}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <div>
                    <p className="font-serif text-xl text-ink">{loc}</p>
                    <p className="mt-1 text-sm text-stone2">{DEMO_LOCALITY_META[loc].blurb}</p>
                    <p className="mt-2 text-xs font-medium text-muted">{count} demo {count === 1 ? "property" : "properties"}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-stone2 transition group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------- Buy / Rent ---------- */}
      <section className="border-y border-line bg-mist" aria-labelledby="buy-rent-heading">
        <div className="mx-auto max-w-shell px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Start here"
              title="Buying or renting?"
              message="Two simple paths. Both lead to the same honest marketplace — you always see who is advertising and at what advertised price."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="group relative overflow-hidden rounded-3xl">
                <div className="relative aspect-[16/10] bg-mist">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop"
                    alt="A home for sale"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" aria-hidden="true" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <h3 className="font-serif text-3xl text-white">Buy a property</h3>
                  <p className="mt-2 max-w-sm text-[15px] text-white/80">
                    Compare advertised prices across localities and contact the advertiser directly.
                  </p>
                  <ButtonLink href="/buy" variant="light" className="mt-5">
                    Browse properties for sale <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="group relative overflow-hidden rounded-3xl">
                <div className="relative aspect-[16/10] bg-mist">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop"
                    alt="An apartment available for rent"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" aria-hidden="true" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <h3 className="font-serif text-3xl text-white">Rent a property</h3>
                  <p className="mt-2 max-w-sm text-[15px] text-white/80">
                    Filter by budget, furnishing and locality — then reach out to the advertiser.
                  </p>
                  <ButtonLink href="/rent" variant="light" className="mt-5">
                    Browse properties for rent <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="mx-auto max-w-shell px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="how-heading">
        <Reveal>
          <SectionHeading
            eyebrow="How NIVORA works"
            title="Simple, transparent, direct."
            message="NIVORA connects people. It does not sell, own or guarantee the properties advertised on it."
          />
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            {
              icon: Search,
              step: "01",
              title: "Discover",
              text: "Search by locality, type and budget. Use filters and the map to compare demo properties side by side.",
            },
            {
              icon: Building2,
              step: "02",
              title: "Understand",
              text: "Every listing shows its advertised price, advertiser type and details. No hidden charges, no misleading badges.",
            },
            {
              icon: Handshake,
              step: "03",
              title: "Connect",
              text: "Contact the advertiser directly through NIVORA. Meet, inspect and verify documents yourself before any decision.",
            },
          ].map((s, i) => (
            <Reveal key={s.step} delay={i * 0.08}>
              <div className="border-t-2 border-ink pt-6">
                <div className="flex items-center justify-between">
                  <s.icon className="h-7 w-7 text-bronze" aria-hidden="true" />
                  <span className="font-serif text-4xl text-line">{s.step}</span>
                </div>
                <h3 className="mt-4 font-serif text-2xl text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone2">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-line bg-mist p-6 sm:flex-row sm:items-center sm:p-8">
            <ShieldCheck className="h-8 w-8 shrink-0 text-bronze" aria-hidden="true" />
            <div>
              <p className="font-medium text-ink">Our transparency promise</p>
              <p className="mt-1 text-[15px] leading-relaxed text-stone2">
                We never claim a property is “verified” or “guaranteed”. If a phone number
                is verified, we say exactly that — phone verification only. Ownership and
                legality are always for you to confirm.
              </p>
            </div>
            <DemoBadge className="shrink-0 sm:ml-auto" />
          </div>
        </Reveal>
      </section>

      {/* ---------- Advertise CTA ---------- */}
      <section className="bg-coal text-white" aria-labelledby="advertise-heading">
        <div className="mx-auto flex max-w-shell flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:py-24">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">For owners, brokers & builders</p>
              <h2 id="advertise-heading" className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                Have a property to list?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Connect with people looking for their next place. Our guided listing
                wizard takes a few minutes — no technical experience needed.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href="/list-property" size="lg" variant="light">
                List your property <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/about" variant="ghostlight" size="lg">
                How listing works
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
