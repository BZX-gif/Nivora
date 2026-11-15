"use client";

import dynamic from "next/dynamic";
import type { Property } from "@/types/property";

const PropertyMap = dynamic(
  () => import("@/components/maps/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false }
);

/** Client wrapper so server pages can render a single-property map. */
export function SinglePropertyMap({ property }: { property: Property }) {
  return (
    <PropertyMap
      properties={[property]}
      selectedId={property.id}
      hoveredId={null}
      onSelect={() => {}}
      onHover={() => {}}
      className="h-full w-full"
    />
  );
}
