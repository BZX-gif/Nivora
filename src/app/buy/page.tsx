import type { Metadata } from "next";
import { Discovery } from "@/components/search/Discovery";

export const metadata: Metadata = {
  title: "Properties for sale in Jaipur",
  description: "Browse demo properties for sale in Jaipur — apartments, houses, villas, plots and commercial spaces with advertised prices.",
};

export default function BuyPage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Discovery
        defaultType="buy"
        title="Properties for sale"
        subtitle="Demo properties for sale in Jaipur. Prices are advertised by advertisers — always confirm details with them directly."
      />
    </div>
  );
}
