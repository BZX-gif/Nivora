import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/buy", label: "Buy properties" },
      { href: "/rent", label: "Rent properties" },
      { href: "/explore", label: "Explore the map" },
      { href: "/saved", label: "Saved properties" },
    ],
  },
  {
    title: "Advertise",
    links: [
      { href: "/list-property", label: "List your property" },
      { href: "/dashboard", label: "Advertiser dashboard" },
      { href: "/dashboard/listings", label: "My listings" },
      { href: "/dashboard/enquiries", label: "Enquiries" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About NIVORA" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-coal text-white">
      <div className="mx-auto max-w-shell px-4 pb-28 pt-16 sm:px-6 lg:px-8 lg:pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo theme="light" />
            <p className="mt-5 max-w-xs font-serif text-xl leading-snug text-white/85">
              Find a place that feels like yours.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              NIVORA connects people looking to buy or rent with the owners, brokers,
              agencies and builders advertising properties.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-white/40">
              An initiative by HYB
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[15px] text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h4 className="text-sm font-semibold">What NIVORA does — and does not do</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                NIVORA is a connection platform. It does not sell, own, legally verify or
                guarantee the properties advertised on it. Advertised prices are provided
                by advertisers. Always meet the advertiser, inspect the property and
                verify documents yourself before any transaction.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h4 className="text-sm font-semibold">Demo notice</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                This is a demonstration build. All properties, prices, locations and
                contact details shown are illustrative and fictional. No real inventory
                is listed, and no enquiry is delivered to a real person.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-3 text-xs text-white/40 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} NIVORA. All rights reserved.</p>
            <p>Find your place. — Jaipur demo market</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
