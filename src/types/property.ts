export type ListingType = "buy" | "rent";

export type PropertyCategory =
  | "Apartment"
  | "Independent House"
  | "Villa"
  | "Plot / Land"
  | "Commercial";

export type AdvertiserType =
  | "Owner"
  | "Independent Broker"
  | "Agency"
  | "Builder / Developer";

export type ListingStatus =
  | "Draft"
  | "Pending Moderation"
  | "Published"
  | "Rejected"
  | "Expired"
  | "Unavailable";

export type Furnishing = "Unfurnished" | "Semi-furnished" | "Fully furnished";

export interface Advertiser {
  type: AdvertiserType;
  name: string;
  /** Demo contact — never a real person's number. */
  phone: string;
  phoneVerified: boolean;
  memberSince: string;
}

export interface Property {
  id: string;
  title: string;
  listingType: ListingType;
  category: PropertyCategory;
  /** Advertised price in INR. Monthly rent when listingType is "rent". */
  price: number;
  locality: string;
  city: string;
  address: string;
  landmark?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft: number;
  furnishing?: Furnishing;
  amenities: string[];
  description: string;
  images: string[];
  advertiser: Advertiser;
  lat: number;
  lng: number;
  listedDaysAgo: number;
  status: ListingStatus;
  negotiable?: boolean;
  maintenance?: number;
  featured?: boolean;
  /** All demo inventory is illustrative — never real listings. */
  demo: true;
}

export interface SearchFilters {
  listingType: ListingType | "all";
  query: string;
  category: PropertyCategory | "all";
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  furnishing: Furnishing | "all";
  advertiserType: AdvertiserType | "all";
  minArea: number | null;
  maxArea: number | null;
  availability: "all" | "available";
}

export type SortKey = "recent" | "price-asc" | "price-desc";

export const CATEGORIES: PropertyCategory[] = [
  "Apartment",
  "Independent House",
  "Villa",
  "Plot / Land",
  "Commercial",
];

export const ADVERTISER_TYPES: AdvertiserType[] = [
  "Owner",
  "Independent Broker",
  "Agency",
  "Builder / Developer",
];

export const FURNISHING_OPTIONS: Furnishing[] = [
  "Unfurnished",
  "Semi-furnished",
  "Fully furnished",
];

export const LOCALITIES = [
  "Vaishali Nagar",
  "Mansarovar",
  "Malviya Nagar",
  "Jagatpura",
  "C-Scheme",
  "Ajmer Road",
  "Tonk Road",
  "Bani Park",
  "Raja Park",
  "Sanganer",
  "Sitapura",
  "Durgapura",
  "Pratap Nagar",
  "Gandhi Nagar",
  "Adarsh Nagar",
  "Vidhyadhar Nagar",
  "Kalwar Road",
  "Bagru",
] as const;
