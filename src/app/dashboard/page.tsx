"use client";

import { ArrowRight, Building2, Heart, Inbox, PlusCircle } from "lucide-react";
import Link from "next/link";
import { DEMO_PROPERTIES } from "@/data/demo-properties";
import { useEnquiries, useFavourites, useSession, useUserListings } from "@/lib/store";
import { ButtonLink, StatusBadge } from "@/components/ui/primitives";
import { formatPrice } from "@/lib/format";

/** Demo sample listings "owned" by the signed-in user in this demo. */
const DEMO_OWNED_IDS = ["niv-001", "niv-004", "niv-013"];

export default function DashboardOverviewPage() {
  const { user } = useSession();
  const { listings } = useUserListings();
  const { enquiries } = useEnquiries();
  const { ids: favIds } = useFavourites();

  const demoOwned = DEMO_PROPERTIES.filter((p) => DEMO_OWNED_IDS.includes(p.id));
  const myListings = [...listings, ...demoOwned];
  const published = myListings.filter((p) => p.status === "Published").length;
  const pending = myListings.filter((p) => p.status === "Pending Moderation").length;

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">
        {user ? `Hello, ${user.name.split(" ")[0]}` : "Your dashboard"}
      </h1>
      <p className="mt-2 text-[15px] text-stone2">
        {user
          ? "Manage your listings, enquiries and saved properties — all demo data on this device."
          : "Sign in to manage your listings. You can still browse and list properties without signing in."}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Building2, label: "My listings", value: myListings.length, sub: `${published} published · ${pending} pending` },
          { icon: Inbox, label: "Enquiries sent", value: enquiries.length, sub: "Saved on this device (demo)" },
          { icon: Heart, label: "Saved properties", value: favIds.length, sub: "Your favourites" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-5">
            <s.icon className="h-5 w-5 text-bronze" aria-hidden="true" />
            <p className="mt-3 font-serif text-3xl text-ink">{s.value}</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{s.label}</p>
            <p className="text-xs text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/list-property" size="lg">
          <PlusCircle className="h-4 w-4" aria-hidden="true" /> Add a property
        </ButtonLink>
        <ButtonLink href="/dashboard/listings" variant="outline" size="lg">
          Manage listings <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
      </div>

      <section aria-labelledby="recent-heading" className="mt-12">
        <h2 id="recent-heading" className="font-serif text-2xl text-ink">Your listings</h2>
        {myListings.length === 0 ? (
          <p className="mt-3 text-[15px] text-stone2">
            You have no listings yet.{" "}
            <Link href="/list-property" className="font-medium text-ink underline-offset-4 hover:underline">
              List your first property
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white">
            {myListings.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link
                  href={`/property/${p.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{p.title}</p>
                    <p className="text-sm text-muted">
                      {p.locality} · {formatPrice(p.price, p.listingType)}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
