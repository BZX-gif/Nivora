"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import { ADVERTISER_TYPES, CATEGORIES, FURNISHING_OPTIONS, type SearchFilters } from "@/types/property";
import { Button } from "@/components/ui/primitives";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  onReset: () => void;
  resultCount: number;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-5">
      <legend className="text-sm font-semibold text-ink">{title}</legend>
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-stone2 hover:border-ink/40 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";

export function FilterDrawer({ open, onClose, filters, onChange, onReset, resultCount }: FilterDrawerProps) {
  const set = (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close filters"
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Filters"
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col bg-white shadow-pop"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-serif text-xl text-ink">Filters</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={onReset}
                  className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-stone2 transition hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <Group title="Property type">
                <div className="flex flex-wrap gap-2">
                  <Chip active={filters.category === "all"} onClick={() => set({ category: "all" })}>All types</Chip>
                  {CATEGORIES.map((c) => (
                    <Chip key={c} active={filters.category === c} onClick={() => set({ category: c })}>{c}</Chip>
                  ))}
                </div>
              </Group>

              <Group title="Budget (₹)">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="f-min" className="mb-1.5 block text-xs font-medium text-muted">Min price</label>
                    <input
                      id="f-min"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="No min"
                      value={filters.minPrice ?? ""}
                      onChange={(e) => set({ minPrice: e.target.value === "" ? null : Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="f-max" className="mb-1.5 block text-xs font-medium text-muted">Max price</label>
                    <input
                      id="f-max"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="No max"
                      value={filters.maxPrice ?? ""}
                      onChange={(e) => set({ maxPrice: e.target.value === "" ? null : Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </Group>

              <Group title="Bedrooms">
                <div className="flex flex-wrap gap-2">
                  <Chip active={filters.bedrooms === null} onClick={() => set({ bedrooms: null })}>Any</Chip>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Chip key={n} active={filters.bedrooms === n} onClick={() => set({ bedrooms: n })}>
                      {n}+
                    </Chip>
                  ))}
                </div>
              </Group>

              <Group title="Bathrooms">
                <div className="flex flex-wrap gap-2">
                  <Chip active={filters.bathrooms === null} onClick={() => set({ bathrooms: null })}>Any</Chip>
                  {[1, 2, 3, 4].map((n) => (
                    <Chip key={n} active={filters.bathrooms === n} onClick={() => set({ bathrooms: n })}>
                      {n}+
                    </Chip>
                  ))}
                </div>
              </Group>

              <Group title="Furnishing">
                <div className="flex flex-wrap gap-2">
                  <Chip active={filters.furnishing === "all"} onClick={() => set({ furnishing: "all" })}>Any</Chip>
                  {FURNISHING_OPTIONS.map((f) => (
                    <Chip key={f} active={filters.furnishing === f} onClick={() => set({ furnishing: f })}>{f}</Chip>
                  ))}
                </div>
              </Group>

              <Group title="Advertiser type">
                <div className="flex flex-wrap gap-2">
                  <Chip active={filters.advertiserType === "all"} onClick={() => set({ advertiserType: "all" })}>Any</Chip>
                  {ADVERTISER_TYPES.map((a) => (
                    <Chip key={a} active={filters.advertiserType === a} onClick={() => set({ advertiserType: a })}>{a}</Chip>
                  ))}
                </div>
              </Group>

              <Group title="Area (sq.ft.)">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="f-areamin" className="mb-1.5 block text-xs font-medium text-muted">Min area</label>
                    <input
                      id="f-areamin"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="No min"
                      value={filters.minArea ?? ""}
                      onChange={(e) => set({ minArea: e.target.value === "" ? null : Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="f-areamax" className="mb-1.5 block text-xs font-medium text-muted">Max area</label>
                    <input
                      id="f-areamax"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="No max"
                      value={filters.maxArea ?? ""}
                      onChange={(e) => set({ maxArea: e.target.value === "" ? null : Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </Group>

              <Group title="Availability">
                <div className="flex flex-wrap gap-2">
                  <Chip active={filters.availability === "all"} onClick={() => set({ availability: "all" })}>All</Chip>
                  <Chip active={filters.availability === "available"} onClick={() => set({ availability: "available" })}>
                    Available now
                  </Chip>
                </div>
              </Group>
            </div>

            <div className="border-t border-line p-4">
              <Button onClick={onClose} className="w-full" size="lg">
                Show {resultCount} result{resultCount === 1 ? "" : "s"}
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
