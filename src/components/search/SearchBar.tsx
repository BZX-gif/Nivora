"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, LOCALITIES, type ListingType } from "@/types/property";

const BUDGETS = [
  { label: "Any budget", min: "", max: "" },
  { label: "Under ₹50 Lakh", min: "", max: "5000000" },
  { label: "₹50 Lakh – ₹1 Cr", min: "5000000", max: "10000000" },
  { label: "₹1 Cr – ₹2 Cr", min: "10000000", max: "20000000" },
  { label: "₹2 Cr+", min: "20000000", max: "" },
  { label: "Under ₹30k/mo", min: "", max: "30000" },
  { label: "₹30k – ₹60k/mo", min: "30000", max: "60000" },
  { label: "₹60k+/mo", min: "60000", max: "" },
];

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [type, setType] = useState<ListingType>("buy");
  const [locality, setLocality] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locality) params.set("locality", locality);
    if (category) params.set("category", category);
    const b = BUDGETS.find((x) => x.label === budget);
    if (b?.min) params.set("minPrice", b.min);
    if (b?.max) params.set("maxPrice", b.max);
    const qs = params.toString();
    router.push(`/${type}${qs ? `?${qs}` : ""}`);
  };

  const selectClass =
    "h-12 w-full appearance-none rounded-xl border border-line bg-white px-3.5 pr-8 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";

  return (
    <form
      onSubmit={submit}
      className={`w-full rounded-3xl border border-line bg-white p-2 shadow-lift sm:rounded-full ${compact ? "" : ""}`}
      role="search"
      aria-label="Search properties"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex rounded-full bg-mist p-1" role="tablist" aria-label="Buy or rent">
          {(["buy", "rent"] as ListingType[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={type === t}
              onClick={() => setType(t)}
              className={`h-10 flex-1 rounded-full px-6 text-[15px] font-medium capitalize transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink sm:flex-none ${
                type === t ? "bg-ink text-white shadow" : "text-stone2 hover:text-ink"
              }`}
            >
              {t === "buy" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>

        <label className="sr-only" htmlFor="search-locality">Locality</label>
        <select id="search-locality" value={locality} onChange={(e) => setLocality(e.target.value)} className={selectClass}>
          <option value="">City or locality</option>
          {LOCALITIES.map((l) => (
            <option key={l} value={l}>{l}, Jaipur</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="search-category">Property type</label>
        <select id="search-category" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          <option value="">Property type</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="search-budget">Budget</label>
        <select id="search-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={selectClass}>
          {BUDGETS.map((b) => (
            <option key={b.label} value={b.label}>{b.label}</option>
          ))}
        </select>

        <button
          type="submit"
          className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 text-[15px] font-medium text-white transition hover:bg-coal active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </button>
      </div>
    </form>
  );
}
