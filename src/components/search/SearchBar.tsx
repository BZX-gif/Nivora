"use client";

import { ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { CATEGORIES, LOCALITIES, type ListingType } from "@/types/property";

const BUY_BUDGETS = [
  { label: "Any budget", min: "", max: "" },
  { label: "Under ₹50 Lakh", min: "", max: "5000000" },
  { label: "₹50 Lakh – ₹1 Cr", min: "5000000", max: "10000000" },
  { label: "₹1 Cr – ₹2 Cr", min: "10000000", max: "20000000" },
  { label: "₹2 Cr+", min: "20000000", max: "" },
];

const RENT_BUDGETS = [
  { label: "Any budget", min: "", max: "" },
  { label: "Under ₹30k/mo", min: "", max: "30000" },
  { label: "₹30k – ₹60k/mo", min: "30000", max: "60000" },
  { label: "₹60k+/mo", min: "60000", max: "" },
];

function Field({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-mist px-4 py-2 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-ink/15">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full cursor-pointer appearance-none truncate bg-transparent pr-7 text-[15px] font-medium text-ink focus:outline-none"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-stone2"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function SearchBar() {
  const router = useRouter();
  const [type, setType] = useState<ListingType>("buy");
  const [locality, setLocality] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("Any budget");

  const budgets = type === "buy" ? BUY_BUDGETS : RENT_BUDGETS;

  const changeType = (t: ListingType) => {
    setType(t);
    setBudget("Any budget"); // budget ranges differ between buy and rent
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locality) params.set("locality", locality);
    if (category) params.set("category", category);
    const b = budgets.find((x) => x.label === budget);
    if (b?.min) params.set("minPrice", b.min);
    if (b?.max) params.set("maxPrice", b.max);
    const qs = params.toString();
    router.push(`/${type}${qs ? `?${qs}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className="w-full rounded-3xl border border-line bg-white p-3 shadow-lift"
      role="search"
      aria-label="Search properties"
    >
      {/* Buy / Rent segmented control */}
      <div className="flex rounded-full bg-mist p-1" role="tablist" aria-label="Buy or rent">
        {(["buy", "rent"] as ListingType[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={type === t}
            onClick={() => changeType(t)}
            className={`h-10 flex-1 rounded-full text-[15px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
              type === t ? "bg-ink text-white shadow" : "text-stone2 hover:text-ink"
            }`}
          >
            {t === "buy" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      {/* Fields — stacked on mobile, one row on desktop */}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-stretch">
        <Field id="search-locality" label="Locality" value={locality} onChange={setLocality}>
          <option value="">City or locality</option>
          {LOCALITIES.map((l) => (
            <option key={l} value={l}>
              {l}, Jaipur
            </option>
          ))}
        </Field>

        <Field id="search-category" label="Property type" value={category} onChange={setCategory}>
          <option value="">Any type</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Field>

        <Field id="search-budget" label="Budget" value={budget} onChange={setBudget}>
          {budgets.map((b) => (
            <option key={b.label} value={b.label}>
              {b.label}
            </option>
          ))}
        </Field>

        <button
          type="submit"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink px-8 text-[15px] font-medium text-white transition hover:bg-coal active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 md:h-full md:min-w-[150px]"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </button>
      </div>
    </form>
  );
}
