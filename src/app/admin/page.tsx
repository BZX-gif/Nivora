"use client";

import { Activity, Check, Flag, ShieldCheck, Users, X } from "lucide-react";
import Link from "next/link";
import { DEMO_PROPERTIES } from "@/data/demo-properties";
import { useSession, useToast, useUserListings } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { ButtonLink, StatusBadge } from "@/components/ui/primitives";
import type { Property } from "@/types/property";

/**
 * Demo admin & moderation area.
 * Authorization here is a demo gate (role stored locally). In production,
 * this boundary MUST be enforced server-side — never rely on frontend checks.
 */
const DEMO_PENDING: Property[] = [
  {
    ...DEMO_PROPERTIES[7],
    id: "demo-pending-1",
    title: "3BHK apartment in Vaishali Nagar (awaiting review)",
    status: "Pending Moderation",
  },
  {
    ...DEMO_PROPERTIES[10],
    id: "demo-pending-2",
    title: "Commercial shop in Gandhi Nagar (awaiting review)",
    status: "Pending Moderation",
  },
];

const DEMO_REPORTS = [
  { id: "rep-1", listing: "2BHK apartment for rent in Mansarovar", reason: "Wrong price or details", when: "1 day ago" },
  { id: "rep-2", listing: "Residential plot in Bagru", reason: "Suspicious listing", when: "3 days ago" },
];

const DEMO_USERS = [
  { name: "Ramesh K. (demo)", type: "Owner", listings: 3, since: "2023" },
  { name: "Heritage Estates (demo)", type: "Agency", listings: 5, since: "2021" },
  { name: "Aravalli Buildcon (demo)", type: "Builder / Developer", listings: 4, since: "2020" },
];

export default function AdminPage() {
  const { user } = useSession();
  const toast = useToast();
  const { listings, updateStatus } = useUserListings();

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mist">
          <ShieldCheck className="h-6 w-6 text-bronze" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-serif text-3xl text-ink">Admin access required</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-stone2">
          This area is restricted to administrators. In this demo, sign in with an email
          containing the word <code className="rounded bg-mist px-1.5 py-0.5 text-xs">admin</code> to preview it.
        </p>
        <ButtonLink href="/sign-in" size="lg" className="mt-6">Sign in as demo admin</ButtonLink>
        <p className="mt-6 text-xs leading-relaxed text-muted">
          Production note: authorization must be enforced on the server. Frontend checks alone
          are never sufficient.
        </p>
      </div>
    );
  }

  const userPending = listings.filter((l) => l.status === "Pending Moderation");
  const queue = [...userPending, ...DEMO_PENDING];
  const publishedCount = DEMO_PROPERTIES.filter((p) => p.status === "Published").length + listings.filter((l) => l.status === "Published").length;

  const moderate = (p: Property, approve: boolean) => {
    if (p.id.startsWith("user-")) {
      updateStatus(p.id, approve ? "Published" : "Rejected");
    }
    toast.push(approve ? "Listing approved (demo)" : "Listing rejected (demo)");
  };

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">Admin & moderation</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-stone2">
        Review listings for completeness and policy compliance. Moderation does not verify
        legal ownership — NIVORA never claims to.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Activity, label: "Published listings", value: publishedCount, sub: "Demo + your submissions" },
          { icon: Flag, label: "Open reports", value: DEMO_REPORTS.length, sub: "Demo sample reports" },
          { icon: Users, label: "Advertisers", value: DEMO_USERS.length, sub: "Demo sample accounts" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-5">
            <s.icon className="h-5 w-5 text-bronze" aria-hidden="true" />
            <p className="mt-3 font-serif text-3xl text-ink">{s.value}</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{s.label}</p>
            <p className="text-xs text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      <section aria-labelledby="queue-heading" className="mt-12">
        <h2 id="queue-heading" className="font-serif text-2xl text-ink">Moderation queue</h2>
        {queue.length === 0 ? (
          <p className="mt-3 text-[15px] text-stone2">The queue is clear. New submissions will appear here.</p>
        ) : (
          <ul className="mt-5 space-y-4">
            {queue.map((p) => (
              <li key={p.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{p.title}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {p.locality}, {p.city} · {formatPrice(p.price, p.listingType)} · by {p.advertiser.name} ({p.advertiser.type})
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => moderate(p, true)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-white transition hover:bg-coal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    <Check className="h-4 w-4" aria-hidden="true" /> Approve
                  </button>
                  <button
                    onClick={() => moderate(p, false)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-200 px-4 text-sm font-medium text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  >
                    <X className="h-4 w-4" aria-hidden="true" /> Reject
                  </button>
                  <Link
                    href={`/property/${p.id}`}
                    className="inline-flex h-9 items-center rounded-full border border-line px-4 text-sm font-medium text-ink transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    View listing
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="reports-heading" className="mt-12">
        <h2 id="reports-heading" className="font-serif text-2xl text-ink">Reports</h2>
        <p className="mt-1 text-sm text-muted">Demo sample reports — labelled, not real.</p>
        <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white">
          {DEMO_REPORTS.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-medium text-ink">{r.listing}</p>
                <p className="text-sm text-muted">{r.reason} · {r.when}</p>
              </div>
              <span className="rounded-full bg-mist px-3 py-1 text-[11px] font-semibold text-stone2">Demo sample</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="users-heading" className="mt-12">
        <h2 id="users-heading" className="font-serif text-2xl text-ink">Advertisers</h2>
        <p className="mt-1 text-sm text-muted">Demo sample accounts — labelled, not real.</p>
        <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white">
          {DEMO_USERS.map((u) => (
            <li key={u.name} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-medium text-ink">{u.name}</p>
                <p className="text-sm text-muted">{u.type} · {u.listings} listings · since {u.since}</p>
              </div>
              <span className="rounded-full bg-mist px-3 py-1 text-[11px] font-semibold text-stone2">Demo sample</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
