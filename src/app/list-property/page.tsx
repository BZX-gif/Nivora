import type { Metadata } from "next";
import { ListingWizard } from "@/components/forms/ListingWizard";

export const metadata: Metadata = {
  title: "List your property",
  description: "List your property on NIVORA in a few guided steps — for owners, brokers, agencies and builders.",
};

export default function ListPropertyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">List your property</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-stone2">
        A guided wizard for everyone — no technical experience needed. Your progress saves
        automatically on this device, and you can preview your listing before submitting.
      </p>
      <div className="mt-8">
        <ListingWizard />
      </div>
    </div>
  );
}
