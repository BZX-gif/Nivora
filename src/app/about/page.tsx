import type { Metadata } from "next";
import { Logo, LogoSymbol } from "@/components/brand/Logo";
import { ButtonLink, Reveal, SectionHeading } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "About NIVORA",
  description: "NIVORA is a real-estate marketplace connecting people looking to buy or rent with owners, brokers, agencies and builders. An initiative by HYB.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <Reveal>
        <div className="flex items-center gap-4">
          <LogoSymbol className="h-12 w-12 text-ink" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bronze">About</p>
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">Find your place.</h1>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-10 space-y-6 text-[17px] leading-relaxed text-stone2">
          <p>
            NIVORA is a real-estate marketplace that connects people looking to buy or rent
            properties with the owners, independent brokers, agencies and builders who
            advertise them. Our job is simple: help you discover properties, compare
            advertised prices, understand neighbourhoods, and contact advertisers directly.
          </p>
          <p>
            We believe finding a place should feel calm and clear — not rushed, not
            cluttered, and never misleading. That is why every listing on NIVORA shows its
            advertised price and advertiser type, and why we never use badges or claims we
            cannot support.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 rounded-3xl border border-line bg-mist p-6 sm:p-8">
          <SectionHeading eyebrow="What we do" title="A connection platform" />
          <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-stone2">
            <li><strong className="text-ink">We connect.</strong> Buyers, renters, owners, brokers, agencies and builders meet on one marketplace.</li>
            <li><strong className="text-ink">We do not sell or own.</strong> NIVORA does not itself sell, own, legally verify or guarantee any advertised property.</li>
            <li><strong className="text-ink">We stay transparent.</strong> If a phone number is verified, we say “phone verified” — nothing more. Ownership and legality are always for you to confirm.</li>
            <li><strong className="text-ink">We let listings expire.</strong> Advertisers control availability, and users can report suspicious listings.</li>
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-12 rounded-3xl bg-coal p-6 text-white sm:p-8">
          <Logo theme="light" href={undefined} />
          <p className="mt-5 text-[15px] leading-relaxed text-white/70">
            NIVORA is an initiative by <strong className="text-white">HYB</strong>. It has its
            own independent identity, product and design — built to feel premium, dependable
            and effortless for everyone, from first-time buyers to experienced builders.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70">
            This build is a demonstration for the Jaipur market. All properties, prices and
            contact details are illustrative and fictional.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/explore" className="bg-white text-ink hover:bg-mist">Explore properties</ButtonLink>
            <ButtonLink href="/list-property" variant="ghost" className="text-white hover:bg-white/10">List your property</ButtonLink>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
