"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronDown, List, Map as MapIcon, Search, SlidersHorizontal, X } from "lucide-react";
import { Suspense, useMemo, useRef, useState } from "react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { FilterDrawer } from "@/components/search/FilterDrawer";
import { DEMO_PROPERTIES } from "@/data/demo-properties";
import { applyFilters, applySort, countActiveFilters, DEFAULT_FILTERS } from "@/lib/filters";
import { formatPrice } from "@/lib/format";
import { Button, CardSkeleton, EmptyState } from "@/components/ui/primitives";
import type { ListingType, SearchFilters, SortKey } from "@/types/property";

const PropertyMap = dynamic(
  () => import("@/components/maps/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false }
);

interface DiscoveryProps {
  defaultType: ListingType | "all";
  defaultView?: "list" | "map";
  title: string;
  subtitle: string;
}

function DiscoveryInner({ defaultType, defaultView = "list", title, subtitle }: DiscoveryProps) {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFilters>(() => {
    const f: SearchFilters = { ...DEFAULT_FILTERS, listingType: defaultType };
    const locality = searchParams.get("locality");
    if (locality) f.query = locality;
    const category = searchParams.get("category");
    if (category && ["Apartment", "Independent House", "Villa", "Plot / Land", "Commercial"].includes(category)) {
      f.category = category as SearchFilters["category"];
    }
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    if (min) f.minPrice = Number(min);
    if (max) f.maxPrice = Number(max);
    return f;
  });

  const [sort, setSort] = useState<SortKey>("recent");
  const [view, setView] = useState<"list" | "map">(defaultView);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  const results = useMemo(
    () => applySort(applyFilters(DEMO_PROPERTIES, filters), sort),
    [filters, sort]
  );

  const activeCount = countActiveFilters(filters, { ...DEFAULT_FILTERS, listingType: defaultType });

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (view === "list") {
      cardRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleMapSelect = (id: string | null) => {
    setSelectedId(id);
    if (id) {
      cardRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const resetFilters = () => setFilters({ ...DEFAULT_FILTERS, listingType: defaultType });

  const listContent = (
    <>
      {results.length === 0 ? (
        <EmptyState
          title="No properties match your search"
          message="Try widening your budget, choosing a different locality, or clearing your filters."
          action={
            <Button variant="outline" onClick={resetFilters}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((p) => (
            <div
              key={p.id}
              ref={(el) => {
                if (el) cardRefs.current.set(p.id, el);
                else cardRefs.current.delete(p.id);
              }}
            >
              <PropertyCard
                property={p}
                highlighted={p.id === selectedId || p.id === hoveredId}
                onHover={setHoveredId}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-stone2">{subtitle}</p>
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          <span className="font-semibold text-ink">{results.length}</span>{" "}
          {results.length === 1 ? "property" : "properties"} found
        </p>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <div className="relative w-full min-w-0 sm:w-auto sm:min-w-[200px] sm:flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <label htmlFor="discovery-search" className="sr-only">
            Search by locality, title or type
          </label>
          <input
            id="discovery-search"
            type="search"
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            placeholder="Search locality, title or type…"
            className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-10 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
          />
          {filters.query && (
            <button
              onClick={() => setFilters((f) => ({ ...f, query: "" }))}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setDrawerOpen(true)}
          className="relative flex h-12 shrink-0 items-center gap-2 rounded-full border border-line bg-white px-5 text-[15px] font-medium text-ink transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>

        <label className="sr-only" htmlFor="sort-select">Sort results</label>
        <div className="relative min-w-0 flex-1 sm:flex-none">
          <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-12 w-full cursor-pointer appearance-none rounded-full border border-line bg-white pl-11 pr-10 text-[15px] font-medium text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 sm:w-auto"
          >
            <option value="recent">Recently listed</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        </div>

        <div className="flex shrink-0 rounded-full border border-line bg-white p-1" role="group" aria-label="View">
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            aria-label="List view"
            className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
              view === "list" ? "bg-ink text-white" : "text-stone2 hover:text-ink"
            }`}
          >
            <List className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setView("map")}
            aria-pressed={view === "map"}
            aria-label="Map view"
            className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
              view === "map" ? "bg-ink text-white" : "text-stone2 hover:text-ink"
            }`}
          >
            <MapIcon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted">Active:</span>
          {filters.category !== "all" && (
            <Chip label={filters.category} onRemove={() => setFilters((f) => ({ ...f, category: "all" }))} />
          )}
          {(filters.minPrice != null || filters.maxPrice != null) && (
            <Chip
              label={`${filters.minPrice != null ? formatPrice(filters.minPrice, "buy") : "₹0"} – ${filters.maxPrice != null ? formatPrice(filters.maxPrice, "buy") : "Any"}`}
              onRemove={() => setFilters((f) => ({ ...f, minPrice: null, maxPrice: null }))}
            />
          )}
          {filters.bedrooms != null && (
            <Chip label={`${filters.bedrooms}+ bed`} onRemove={() => setFilters((f) => ({ ...f, bedrooms: null }))} />
          )}
          {filters.bathrooms != null && (
            <Chip label={`${filters.bathrooms}+ bath`} onRemove={() => setFilters((f) => ({ ...f, bathrooms: null }))} />
          )}
          {filters.furnishing !== "all" && (
            <Chip label={filters.furnishing} onRemove={() => setFilters((f) => ({ ...f, furnishing: "all" }))} />
          )}
          {filters.advertiserType !== "all" && (
            <Chip label={filters.advertiserType} onRemove={() => setFilters((f) => ({ ...f, advertiserType: "all" }))} />
          )}
          <button onClick={resetFilters} className="text-sm font-medium text-bronze underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded">
            Clear all
          </button>
        </div>
      )}

      {/* Results */}
      <div className="mt-8">
        {view === "list" ? (
          listContent
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-line lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
              <PropertyMap
                properties={results}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={handleMapSelect}
                onHover={setHoveredId}
                className="h-full w-full"
              />
            </div>
            <div className="grid content-start gap-5 sm:grid-cols-2">
              {results.length === 0 ? (
                <div className="sm:col-span-2">
                  <EmptyState
                    title="No properties on the map"
                    message="Adjust your filters to see demo properties in this area."
                    action={
                      <Button variant="outline" onClick={resetFilters}>
                        Clear all filters
                      </Button>
                    }
                  />
                </div>
              ) : (
                results.map((p) => (
                  <div
                    key={p.id}
                    ref={(el) => {
                      if (el) cardRefs.current.set(p.id, el);
                      else cardRefs.current.delete(p.id);
                    }}
                  >
                    <PropertyCard
                      property={p}
                      highlighted={p.id === selectedId || p.id === hoveredId}
                      onHover={setHoveredId}
                      onSelect={handleSelect}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        resultCount={results.length}
      />
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-[13px] font-medium text-ink">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="flex h-4 w-4 items-center justify-center rounded-full text-stone2 transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export function Discovery(props: DiscoveryProps) {
  return (
    <Suspense fallback={<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>}>
      <DiscoveryInner {...props} />
    </Suspense>
  );
}
