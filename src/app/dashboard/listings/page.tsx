"use client";

import { Eye, PauseCircle, PlayCircle, PlusCircle, RefreshCw, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEMO_PROPERTIES } from "@/data/demo-properties";
import { useToast, useUserListings } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { ButtonLink, EmptyState, StatusBadge } from "@/components/ui/primitives";
import type { ListingStatus, Property } from "@/types/property";

const DEMO_OWNED_IDS = ["niv-001", "niv-004", "niv-013"];

type Overrides = Record<string, ListingStatus>;

export default function MyListingsPage() {
  const toast = useToast();
  const { listings, updateStatus, removeListing } = useUserListings();
  const [overrides, setOverrides] = useState<Overrides>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nivora:status-overrides");
      if (raw) setOverrides(JSON.parse(raw) as Overrides);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("nivora:status-overrides", JSON.stringify(overrides));
    } catch {
      /* ignore */
    }
  }, [overrides, ready]);

  const demoOwned = DEMO_PROPERTIES.filter((p) => DEMO_OWNED_IDS.includes(p.id)).map((p) => ({
    ...p,
    status: overrides[p.id] ?? p.status,
  }));

  const all: { property: Property; mine: boolean }[] = [
    ...listings.map((p) => ({ property: p, mine: true })),
    ...demoOwned.map((p) => ({ property: p, mine: false })),
  ];

  const setStatus = (p: Property, mine: boolean, status: ListingStatus) => {
    if (mine) {
      updateStatus(p.id, status);
    } else {
      setOverrides((o) => ({ ...o, [p.id]: status }));
    }
    toast.push(`Listing marked as ${status.toLowerCase()} (demo)`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">My listings</h1>
          <p className="mt-2 text-[15px] text-stone2">
            Manage status, preview and renew your listings. Changes are stored on this device (demo).
          </p>
        </div>
        <ButtonLink href="/list-property">
          <PlusCircle className="h-4 w-4" aria-hidden="true" /> Add property
        </ButtonLink>
      </div>

      <div className="mt-8">
        {all.length === 0 ? (
          <EmptyState
            title="No listings yet"
            message="List your first property with the guided wizard — it takes a few minutes."
            action={<ButtonLink href="/list-property">List your property</ButtonLink>}
          />
        ) : (
          <ul className="space-y-4">
            {all.map(({ property: p, mine }) => (
              <li key={p.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{p.title}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {p.locality}, {p.city} · {formatPrice(p.price, p.listingType)} · {p.category}
                    </p>
                    {!mine && (
                      <p className="mt-1 text-xs text-muted">Demo sample listing owned by you in this demo.</p>
                    )}
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/property/${p.id}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-ink transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" /> Preview
                  </Link>
                  {p.status === "Published" && (
                    <button
                      onClick={() => setStatus(p, mine, "Unavailable")}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-ink transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                    >
                      <PauseCircle className="h-4 w-4" aria-hidden="true" /> Mark unavailable
                    </button>
                  )}
                  {(p.status === "Unavailable" || p.status === "Expired") && (
                    <button
                      onClick={() => setStatus(p, mine, "Published")}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-ink transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                    >
                      <PlayCircle className="h-4 w-4" aria-hidden="true" /> Renew (publish)
                    </button>
                  )}
                  {p.status === "Published" && (
                    <button
                      onClick={() => setStatus(p, mine, "Expired")}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-ink transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden="true" /> Expire listing
                    </button>
                  )}
                  {mine && (
                    <button
                      onClick={() => {
                        removeListing(p.id);
                        toast.push("Listing deleted (demo)");
                      }}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-200 px-4 text-sm font-medium text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                    </button>
                  )}
                  {!mine && p.status === "Published" && (
                    <span className="inline-flex h-9 items-center gap-1.5 px-2 text-xs text-muted">
                      <XCircle className="h-4 w-4" aria-hidden="true" /> Demo samples cannot be deleted
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
