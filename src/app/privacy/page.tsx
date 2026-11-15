import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "NIVORA privacy policy — draft for review before production launch.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bronze">Legal</p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Privacy policy</h1>
      <p className="mt-4 rounded-2xl border border-dashed border-bronze/50 bg-mist px-5 py-4 text-sm leading-relaxed text-stone2">
        <strong className="text-ink">Draft — review before production launch.</strong> This policy is
        carefully written draft content for the NIVORA demonstration. It does not constitute
        legal advice and must be reviewed by qualified counsel before any production launch.
      </p>

      <div className="mt-10 space-y-8 text-[16px] leading-relaxed text-stone2">
        <section>
          <h2 className="font-serif text-2xl text-ink">1. Who we are</h2>
          <p className="mt-2">
            NIVORA (“we”, “us”, “our”) is a real-estate marketplace that connects people
            looking to buy or rent properties with owners, independent brokers, agencies and
            builders advertising them. NIVORA is an initiative by HYB. This demonstration
            build stores data only on your device.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-ink">2. What we collect</h2>
          <p className="mt-2">
            In production, we would collect the information you provide when you create an
            account, list a property, or send an enquiry — such as your name, email, phone
            number, listing details and photographs. In this demo, that information is stored
            locally in your browser (localStorage) and is never transmitted to a server.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-ink">3. How we use it</h2>
          <p className="mt-2">
            We use account and listing information to operate the marketplace: to display
            listings, route enquiries to advertisers, manage moderation, and keep the
            platform safe. We do not sell personal information.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-ink">4. What we do not do</h2>
          <p className="mt-2">
            NIVORA does not sell, own, legally verify or guarantee the properties advertised
            on it. Advertised prices are provided by advertisers. Phone verification, where
            shown, refers only to phone verification — never to property or ownership
            verification.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-ink">5. Your choices</h2>
          <p className="mt-2">
            You can delete your listings, clear saved properties, and remove demo data from
            your account page at any time. In production, you may request access, correction
            or deletion of your personal information by contacting us.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-ink">6. Contact</h2>
          <p className="mt-2">
            For privacy questions, contact us via the Contact page. This draft will be
            replaced with a final, counsel-reviewed policy before production launch.
          </p>
        </section>
      </div>
    </article>
  );
}
