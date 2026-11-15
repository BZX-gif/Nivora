import type { Property, SearchFilters, SortKey } from "@/types/property";

export const DEFAULT_FILTERS: SearchFilters = {
  listingType: "all",
  query: "",
  category: "all",
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  bathrooms: null,
  furnishing: "all",
  advertiserType: "all",
  minArea: null,
  maxArea: null,
  availability: "all",
};

export function applyFilters(properties: Property[], f: SearchFilters): Property[] {
  const q = f.query.trim().toLowerCase();
  return properties.filter((p) => {
    if (p.status !== "Published") return false;
    if (f.listingType !== "all" && p.listingType !== f.listingType) return false;
    if (f.category !== "all" && p.category !== f.category) return false;
    if (f.minPrice != null && p.price < f.minPrice) return false;
    if (f.maxPrice != null && p.price > f.maxPrice) return false;
    if (f.bedrooms != null && (p.bedrooms ?? 0) < f.bedrooms) return false;
    if (f.bathrooms != null && (p.bathrooms ?? 0) < f.bathrooms) return false;
    if (f.furnishing !== "all" && p.furnishing !== f.furnishing) return false;
    if (f.advertiserType !== "all" && p.advertiser.type !== f.advertiserType) return false;
    if (f.minArea != null && p.areaSqft < f.minArea) return false;
    if (f.maxArea != null && p.areaSqft > f.maxArea) return false;
    if (q) {
      const hay = `${p.title} ${p.locality} ${p.city} ${p.category} ${p.address}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function applySort(properties: Property[], sort: SortKey): Property[] {
  const list = [...properties];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    default:
      return list.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
  }
}

export function countActiveFilters(f: SearchFilters, base: SearchFilters): number {
  let n = 0;
  if (f.query !== base.query) n++;
  if (f.category !== base.category) n++;
  if (f.minPrice !== base.minPrice || f.maxPrice !== base.maxPrice) n++;
  if (f.bedrooms !== base.bedrooms) n++;
  if (f.bathrooms !== base.bathrooms) n++;
  if (f.furnishing !== base.furnishing) n++;
  if (f.advertiserType !== base.advertiserType) n++;
  if (f.minArea !== base.minArea || f.maxArea !== base.maxArea) n++;
  return n;
}
