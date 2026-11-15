"use client";

import { Inbox } from "lucide-react";
import Link from "next/link";
import { useEnquiries } from "@/lib/store";
import { ButtonLink, EmptyState } from "@/components/ui/primitives";

const DEMO_RECEIVED = [
  {
    id: "demo-rec-1",
    propertyTitle: "Sunlit 3BHK apartment with balcony in Vaishali Nagar",
    from: "Aarav S. (demo)",
    message: "Hi, is this still available? We would like to visit this weekend.",
    when: "2 days ago",
  },
  {
    id: "demo-rec-2",
    propertyTitle: "2BHK apartment for rent in Mansarovar",
    from: "Meera J. (demo)",
    message: "Hello, what is the maintenance charge and is parking included?",
    when: "5 days ago",
  },
];

export default function EnquiriesPage() {
  const { enquiries } = useEnquiries();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">Enquiries</h1>
      <p className="mt-2 text-[15px] text-stone2">
        Enquiries you sent from property pages, plus labelled demo samples of enquiries
        received on your listings. Nothing is delivered to real people in this demo.
      </p>

      <section aria-labelledby="sent-heading" className="mt-10">
        <h2 id="sent-heading" className="font-serif text-2xl text-ink">Enquiries you sent</h2>
        <div className="mt-5">
          {enquiries.length === 0 ? (
            <EmptyState
              title="No enquiries sent yet"
              message="Open any property and use “Send enquiry” to contact the advertiser (demo)."
              action={<ButtonLink href="/explore">Explore properties</ButtonLink>}
            />
          ) : (
            <ul className="space-y-4">
              {enquiries.map((e) => (
                <li key={e.id} className="rounded-2xl border border-line bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink">{e.propertyTitle}</p>
                      <p className="mt-0.5 text-sm text-muted">
                        To: {e.propertyTitle ? "Advertiser" : ""} · {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className="rounded-full bg-mist px-3 py-1 text-[11px] font-semibold text-stone2">{e.status}</span>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-stone2">“{e.message}”</p>
                  <p className="mt-2 text-xs text-muted">From {e.name} · {e.contact}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="received-heading" className="mt-12">
        <h2 id="received-heading" className="font-serif text-2xl text-ink">Enquiries on your listings</h2>
        <p className="mt-1 text-sm text-muted">Demo samples — labelled, not real.</p>
        <ul className="mt-5 space-y-4">
          {DEMO_RECEIVED.map((e) => (
            <li key={e.id} className="rounded-2xl border border-dashed border-bronze/50 bg-mist/60 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{e.propertyTitle}</p>
                  <p className="mt-0.5 text-sm text-muted">From {e.from} · {e.when}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-bronzedark">
                  <Inbox className="h-3.5 w-3.5" aria-hidden="true" /> Demo sample
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-stone2">“{e.message}”</p>
              <Link
                href="/dashboard/listings"
                className="mt-3 inline-block text-sm font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded"
              >
                View your listings
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
