import type { Metadata } from "next";
import { Discovery } from "@/components/search/Discovery";

export const metadata: Metadata = {
  title: "Explore properties on the map",
  description: "Explore demo properties across Jaipur on an interactive map. Marker locations are illustrative, not exact addresses.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Discovery
        defaultType="all"
        defaultView="map"
        title="Explore Jaipur"
        subtitle="Browse demo properties on the map. Click a marker to preview, or click a card to fly to its location. All locations are illustrative."
      />
    </div>
  );
}
