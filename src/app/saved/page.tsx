"use client";

import { DEMO_PROPERTIES } from "@/data/demo-properties";
import { useFavourites, useUserListings } from "@/lib/store";
import { PropertyCard } from "@/components/property/PropertyCard";
import { ButtonLink, EmptyState } from "@/components/ui/primitives";

export default function SavedPage() {
  const { ids } = useFavourites();
  const { listings } = useUserListings();
  const all = [...listings, ...DEMO_PROPERTIES];
  const saved = all.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">Saved properties</h1>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-stone2">
        Properties you save on this device. Saved properties are stored locally in this demo.
      </p>

      <div className="mt-10">
        {saved.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            message="Tap the heart on any property to save it here for later."
            action={<ButtonLink href="/explore">Explore properties</ButtonLink>}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
