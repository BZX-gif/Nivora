import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "NIVORA terms of service — draft for review before production launch.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bronze">Legal</p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Terms of service</h1>
      <p className="mt-4 rounded-2xl border border-dashed border-bronze/50 bg-mist px-5 py-4 text-sm leading-relaxed text-stone2">
        <strong className="text-ink">Draft — review before production launch.</strong> These terms
        are carefully written draft content for the NIVORA demonstration. They do not
        constitute legal advice and must be reviewed by qualified counsel before any
        production launch.
      </p>

      <div className="mt-10 space-y-8 text-[16px] leading-relaxed text-stone2">
        <section>
          <h2 className="font-serif text-2xl text-ink">1. The platform</h2>
          <p className="mt-2">
            NIVORA is a connection platform. It helps people discover properties, compare
            advertised prices, and contact advertisers. NIVORA does not itself sell, own,
            legally verify or guarantee the properties advertised on it, and is not a party
            to any transaction between users.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-ink">2. Advertised information</h2>
          <p className="mt-2">
            Prices, descriptions, photographs and availability are provided by advertisers.
            They may change or expire without notice. Always inspect the property, meet the
            advertiser, and verify ownership and documents yourself before any transaction.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-ink">3. Listings and moderation</h2>
          <p className="mt-2">
            Listings may be reviewed before publication and may be rejected, expired or
            marked unavailable. Moderation checks completeness and policy compliance; it is
            not a verification of legal ownership or title.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-ink">4. Acceptable use</h2>
          <p className="mt-2">
            You agree not to post false or misleading listings, misuse contact details,
            scrape the platform, or use NIVORA for unlawful purposes. We may suspend
            accounts that violate these terms.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-ink">5. Demonstration data</h2>
          <p className="mt-2">
            This build is a demonstration. All properties, prices, locations and contact
            details are illustrative and fictional. No real inventory is listed and no
            enquiry is delivered to a real person.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-ink">6. Contact</h2>
          <p className="mt-2">
            Questions about these terms can be sent via the Contact page. This draft will be
            replaced with final, counsel-reviewed terms before production launch.
          </p>
        </section>
      </div>
    </article>
  );
}
