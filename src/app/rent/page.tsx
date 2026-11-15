import type { Metadata } from "next";
import { Discovery } from "@/components/search/Discovery";

export const metadata: Metadata = {
  title: "Properties for rent in Jaipur",
  description: "Browse demo properties for rent in Jaipur — apartments, houses, villas and commercial spaces with monthly advertised rents.",
};

export default function RentPage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Discovery
        defaultType="rent"
        title="Properties for rent"
        subtitle="Demo properties for rent in Jaipur. Rents shown are monthly advertised amounts — confirm terms with the advertiser directly."
      />
    </div>
  );
}
