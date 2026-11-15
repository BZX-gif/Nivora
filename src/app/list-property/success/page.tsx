"use client";

import { CheckCircle2, Clock, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useUserListings } from "@/lib/store";
import { ButtonLink, StatusBadge } from "@/components/ui/primitives";

function SuccessInner() {
  const params = useSearchParams();
  const id = params.get("id");
  const { listings } = useUserListings();
  const listing = listings.find((l) => l.id === id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:py-24">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mist">
        <CheckCircle2 className="h-8 w-8 text-bronze" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-serif text-4xl text-ink">Listing submitted</h1>
      {listing && (
        <p className="mt-3 text-[15px] text-stone2">
          “{listing.title}” — {listing.locality}, {listing.city}
        </p>
      )}
      <div className="mt-6 flex justify-center">
        <StatusBadge status="Pending Moderation" />
      </div>

      <div className="mt-8 rounded-3xl border border-line bg-mist p-6 text-left">
        <h2 className="flex items-center gap-2 font-medium text-ink">
          <Clock className="h-5 w-5 text-bronze" aria-hidden="true" /> What happens next?
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-stone2">
          <li>In this demo, your listing is saved locally as <strong className="text-ink">Pending Moderation</strong> — it is not published to a real marketplace.</li>
          <li>In production, a moderator reviews the listing for completeness and policy compliance. NIVORA does not verify legal ownership.</li>
          <li>Once approved, the listing becomes <strong className="text-ink">Published</strong> and visible to visitors.</li>
          <li>You can track its status anytime from your dashboard.</li>
        </ol>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/dashboard/listings" size="lg">
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Go to my listings
        </ButtonLink>
        {listing && (
          <Link
            href={`/property/${listing.id}`}
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-line bg-white px-7 text-base font-medium text-ink transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <Eye className="h-4 w-4" aria-hidden="true" /> Preview listing
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ListingSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-24 text-center text-stone2">Loading…</div>}>
      <SuccessInner />
    </Suspense>
  );
}
