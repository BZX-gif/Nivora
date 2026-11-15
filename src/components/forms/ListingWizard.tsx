"use client";

import { ArrowLeft, ArrowRight, Building2, Check, ChevronLeft, ChevronRight, ImagePlus, KeyRound, Tag, Trash2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { useSession, useToast, useUserListings } from "@/lib/store";
import { Button } from "@/components/ui/primitives";
import {
  ADVERTISER_TYPES,
  CATEGORIES,
  FURNISHING_OPTIONS,
  LOCALITIES,
  type AdvertiserType,
  type Furnishing,
  type ListingType,
  type Property,
  type PropertyCategory,
} from "@/types/property";

const AMENITY_OPTIONS = [
  "Lift", "Covered parking", "Power backup", "Balcony", "Garden", "Security",
  "Clubhouse", "Gym", "Swimming pool", "Modular kitchen", "Vaastu friendly", "CCTV",
];

interface Draft {
  listingType: ListingType | "";
  category: PropertyCategory | "";
  city: string;
  locality: string;
  address: string;
  landmark: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  areaUnit: "sq.ft." | "sq.yd.";
  furnishing: Furnishing | "";
  amenities: string[];
  description: string;
  price: string;
  negotiable: boolean;
  maintenance: string;
  advertiserType: AdvertiserType;
  advertiserName: string;
  phone: string;
  whatsapp: string;
  images: string[];
}

const EMPTY_DRAFT: Draft = {
  listingType: "",
  category: "",
  city: "Jaipur",
  locality: "",
  address: "",
  landmark: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  areaUnit: "sq.ft.",
  furnishing: "",
  amenities: [],
  description: "",
  price: "",
  negotiable: false,
  maintenance: "",
  advertiserType: "Owner",
  advertiserName: "",
  phone: "",
  whatsapp: "",
  images: [],
};

const STEPS = [
  "Sale or rent",
  "Property type",
  "Location",
  "Property details",
  "Price",
  "Photographs",
  "Your details",
  "Preview",
];

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 1200 / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ListingWizard() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useSession();
  const { addListing } = useUserListings();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  /* Restore draft */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nivora:listing-draft");
      if (raw) setDraft({ ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<Draft>) });
    } catch {
      /* ignore */
    }
  }, []);

  /* Save draft */
  useEffect(() => {
    try {
      localStorage.setItem("nivora:listing-draft", JSON.stringify(draft));
    } catch {
      /* storage full — keep working in memory */
    }
  }, [draft]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!draft.listingType) e.listingType = "Please choose whether you are selling or renting.";
    }
    if (s === 1) {
      if (!draft.category) e.category = "Please choose a property type.";
    }
    if (s === 2) {
      if (!draft.locality) e.locality = "Please choose a locality.";
      if (!draft.address.trim()) e.address = "Please enter an approximate address.";
    }
    if (s === 3) {
      if (!draft.area || Number(draft.area) <= 0) e.area = "Please enter the property area.";
      if (draft.description.trim().length < 30) e.description = "Please write at least 30 characters so buyers know what to expect.";
    }
    if (s === 4) {
      if (!draft.price || Number(draft.price) <= 0) e.price = "Please enter the advertised price.";
    }
    if (s === 5) {
      if (draft.images.length === 0) e.images = "Please add at least one photograph.";
    }
    if (s === 6) {
      if (!draft.advertiserName.trim()) e.advertiserName = "Please enter your name or business name.";
      if (draft.phone.replace(/\D/g, "").length < 10) e.phone = "Please enter a valid 10-digit phone number.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);
    for (const file of list) {
      if (!file.type.startsWith("image/")) {
        toast.push(`"${file.name}" is not an image — skipped`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.push(`"${file.name}" is larger than 5MB — skipped`);
        continue;
      }
      if (draft.images.length >= 6) {
        toast.push("You can add up to 6 photographs in this demo.");
        break;
      }
      setUploading(true);
      setProgress(0);
      const tick = window.setInterval(() => setProgress((p) => Math.min(p + 20, 90)), 120);
      try {
        const dataUrl = await compressImage(file);
        window.clearInterval(tick);
        setProgress(100);
        setDraft((d) => ({ ...d, images: [...d.images, dataUrl] }));
        window.setTimeout(() => setProgress(0), 400);
      } catch {
        window.clearInterval(tick);
        toast.push(`Could not read "${file.name}".`);
      }
      setUploading(false);
    }
  };

  const moveImage = (i: number, dir: -1 | 1) => {
    setDraft((d) => {
      const images = [...d.images];
      const j = i + dir;
      if (j < 0 || j >= images.length) return d;
      [images[i], images[j]] = [images[j], images[i]];
      return { ...d, images };
    });
  };

  const removeImage = (i: number) => {
    setDraft((d) => ({ ...d, images: d.images.filter((_, x) => x !== i) }));
  };

  const buildProperty = (): Property => {
    const areaSqft = draft.areaUnit === "sq.yd." ? Number(draft.area) * 9 : Number(draft.area);
    const title =
      draft.category === "Plot / Land"
        ? `Residential plot in ${draft.locality}`
        : draft.category === "Commercial"
          ? `Commercial space in ${draft.locality}`
          : `${draft.bedrooms || ""}${draft.bedrooms ? "BHK " : ""}${(draft.category || "property").toLowerCase()} in ${draft.locality}`.trim();
    return {
      id: `user-${Date.now()}`,
      title,
      listingType: draft.listingType === "rent" ? "rent" : "buy",
      category: (draft.category || "Apartment") as PropertyCategory,
      price: Number(draft.price),
      locality: draft.locality,
      city: draft.city || "Jaipur",
      address: draft.address,
      landmark: draft.landmark || undefined,
      bedrooms: draft.bedrooms ? Number(draft.bedrooms) : undefined,
      bathrooms: draft.bathrooms ? Number(draft.bathrooms) : undefined,
      areaSqft,
      furnishing: draft.furnishing || undefined,
      amenities: draft.amenities,
      description: draft.description,
      images: draft.images,
      advertiser: {
        type: draft.advertiserType,
        name: draft.advertiserName,
        phone: draft.phone,
        phoneVerified: false,
        memberSince: String(new Date().getFullYear()),
      },
      lat: 26.9124,
      lng: 75.7873,
      listedDaysAgo: 0,
      status: "Pending Moderation",
      negotiable: draft.negotiable,
      maintenance: draft.maintenance ? Number(draft.maintenance) : undefined,
      demo: true,
    };
  };

  const submit = () => {
    if (!validateStep(7)) return;
    const property = buildProperty();
    addListing(property);
    try {
      localStorage.removeItem("nivora:listing-draft");
    } catch {
      /* ignore */
    }
    router.push(`/list-property/success?id=${property.id}`);
  };

  const preview = buildProperty();

  return (
    <div>
      {/* Progress — a single compact line on phones, the full stepper from sm up */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-ink">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="truncate text-sm text-muted">{STEPS[step]}</p>
        </div>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label={`Listing progress: step ${step + 1} of ${STEPS.length}`}
        >
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-300 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <ol className="hidden flex-wrap gap-2 sm:flex" aria-label="Listing progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                i < step
                  ? "bg-ink text-white"
                  : i === step
                    ? "bg-bronze text-white"
                    : "bg-mist text-muted"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
            </span>
            <span className={`hidden text-sm font-medium sm:block ${i === step ? "text-ink" : "text-muted"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-4 bg-line sm:w-6" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        {step === 0 && (
          <fieldset>
            <legend className="font-serif text-2xl text-ink">What would you like to do?</legend>
            <p className="mt-2 text-[15px] text-stone2">Choose whether you want to sell or rent out this property.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  { value: "buy" as ListingType, title: "Sell", text: "I want to sell my property", icon: Tag },
                  { value: "rent" as ListingType, title: "Rent", text: "I want to rent out my property", icon: KeyRound },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("listingType", opt.value)}
                  aria-pressed={draft.listingType === opt.value}
                  className={`rounded-2xl border p-6 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                    draft.listingType === opt.value ? "border-ink bg-mist" : "border-line hover:border-ink/40"
                  }`}
                >
                  <opt.icon className="h-7 w-7 text-bronze" aria-hidden="true" />
                  <p className="mt-3 font-serif text-xl text-ink">{opt.title}</p>
                  <p className="mt-1 text-sm text-stone2">{opt.text}</p>
                </button>
              ))}
            </div>
            {errors.listingType && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {errors.listingType}
              </p>
            )}
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="font-serif text-2xl text-ink">What kind of property is it?</legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("category", c)}
                  aria-pressed={draft.category === c}
                  className={`rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                    draft.category === c ? "border-ink bg-mist" : "border-line hover:border-ink/40"
                  }`}
                >
                  <p className="font-medium text-ink">{c}</p>
                </button>
              ))}
            </div>
            {errors.category && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {errors.category}
              </p>
            )}
          </fieldset>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-serif text-2xl text-ink">Where is the property?</h3>
            <p className="mt-2 text-[15px] text-stone2">Give an approximate location. The exact address is shown to visitors only as you describe it.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="wz-city" className={labelClass}>City</label>
                <input id="wz-city" value={draft.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="wz-locality" className={labelClass}>Locality *</label>
                <select id="wz-locality" value={draft.locality} onChange={(e) => set("locality", e.target.value)} className={inputClass}>
                  <option value="">Choose a locality</option>
                  {LOCALITIES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                {errors.locality && <p role="alert" className="mt-1.5 text-sm text-red-700">{errors.locality}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="wz-address" className={labelClass}>Approximate address *</label>
                <input id="wz-address" value={draft.address} onChange={(e) => set("address", e.target.value)} placeholder="e.g. Plot 42, near Gandhi Path" className={inputClass} />
                {errors.address && <p role="alert" className="mt-1.5 text-sm text-red-700">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="wz-landmark" className={labelClass}>Landmark (optional)</label>
                <input id="wz-landmark" value={draft.landmark} onChange={(e) => set("landmark", e.target.value)} placeholder="e.g. Near City Mall" className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-serif text-2xl text-ink">Tell us about the property</h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {draft.category !== "Plot / Land" && draft.category !== "Commercial" && (
                <>
                  <div>
                    <label htmlFor="wz-bed" className={labelClass}>Bedrooms</label>
                    <input id="wz-bed" type="number" min={0} max={20} value={draft.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="wz-bath" className={labelClass}>Bathrooms</label>
                    <input id="wz-bath" type="number" min={0} max={20} value={draft.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className={inputClass} />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="wz-area" className={labelClass}>Area *</label>
                <div className="flex gap-2">
                  <input id="wz-area" type="number" min={1} value={draft.area} onChange={(e) => set("area", e.target.value)} className={inputClass} />
                  <select aria-label="Area unit" value={draft.areaUnit} onChange={(e) => set("areaUnit", e.target.value as Draft["areaUnit"])} className="h-12 rounded-xl border border-line bg-white px-3 text-[15px] focus:border-ink focus:outline-none">
                    <option value="sq.ft.">sq.ft.</option>
                    <option value="sq.yd.">sq.yd.</option>
                  </select>
                </div>
                {errors.area && <p role="alert" className="mt-1.5 text-sm text-red-700">{errors.area}</p>}
              </div>
              <div>
                <label htmlFor="wz-furn" className={labelClass}>Furnishing</label>
                <select id="wz-furn" value={draft.furnishing} onChange={(e) => set("furnishing", e.target.value as Furnishing | "")} className={inputClass}>
                  <option value="">Not specified</option>
                  {FURNISHING_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <fieldset className="sm:col-span-2">
                <legend className={labelClass}>Amenities</legend>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((a) => {
                    const active = draft.amenities.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          set("amenities", active ? draft.amenities.filter((x) => x !== a) : [...draft.amenities, a])
                        }
                        className={`rounded-full border px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                          active ? "border-ink bg-ink text-white" : "border-line text-stone2 hover:border-ink/40 hover:text-ink"
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <div className="sm:col-span-2">
                <label htmlFor="wz-desc" className={labelClass}>Description *</label>
                <textarea
                  id="wz-desc"
                  rows={5}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe the property — layout, light, neighbourhood, anything a visitor should know…"
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
                />
                {errors.description && <p role="alert" className="mt-1.5 text-sm text-red-700">{errors.description}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="font-serif text-2xl text-ink">Advertised price</h3>
            <p className="mt-2 text-[15px] text-stone2">
              {draft.listingType === "rent" ? "The monthly rent in ₹." : "The total advertised price in ₹."} Be honest — visitors compare advertised prices.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="wz-price" className={labelClass}>Price (₹) *</label>
                <input id="wz-price" type="number" min={1} value={draft.price} onChange={(e) => set("price", e.target.value)} placeholder={draft.listingType === "rent" ? "e.g. 28000" : "e.g. 8500000"} className={inputClass} />
                {errors.price && <p role="alert" className="mt-1.5 text-sm text-red-700">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="wz-maint" className={labelClass}>Maintenance (₹/month, optional)</label>
                <input id="wz-maint" type="number" min={0} value={draft.maintenance} onChange={(e) => set("maintenance", e.target.value)} className={inputClass} />
              </div>
              <fieldset className="sm:col-span-2">
                <legend className={labelClass}>Is the price negotiable?</legend>
                <div className="flex gap-2">
                  {([true, false] as const).map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      aria-pressed={draft.negotiable === v}
                      onClick={() => set("negotiable", v)}
                      className={`rounded-full border px-5 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                        draft.negotiable === v ? "border-ink bg-ink text-white" : "border-line text-stone2 hover:border-ink/40 hover:text-ink"
                      }`}
                    >
                      {v ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="font-serif text-2xl text-ink">Photographs</h3>
            <p className="mt-2 text-[15px] text-stone2">Add up to 6 photos (JPG/PNG, max 5MB each). The first photo is the cover. Use the arrows to reorder.</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              aria-label="Upload photographs"
              onChange={(e) => {
                void handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="mt-6 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-mist/60 px-6 py-10 text-center transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
            >
              {uploading ? <Upload className="h-8 w-8 animate-pulse text-bronze" aria-hidden="true" /> : <ImagePlus className="h-8 w-8 text-bronze" aria-hidden="true" />}
              <span className="font-medium text-ink">{uploading ? `Uploading… ${progress}%` : "Tap to add photographs"}</span>
              <span className="text-sm text-muted">JPG or PNG, up to 5MB each</span>
              {uploading && (
                <span className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                  <span className="block h-full bg-ink transition-all duration-200" style={{ width: `${progress}%` }} />
                </span>
              )}
            </button>
            {errors.images && <p role="alert" className="mt-2 text-sm text-red-700">{errors.images}</p>}

            {draft.images.length > 0 && (
              <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {draft.images.map((src, i) => (
                  <li key={`${src.slice(0, 32)}-${i}`} className="relative overflow-hidden rounded-2xl border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Listing photo ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">Cover</span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/70 p-1.5 backdrop-blur-sm">
                      <div className="flex">
                        <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`} className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/20 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => moveImage(i, 1)} disabled={i === draft.images.length - 1} aria-label={`Move photo ${i + 1} later`} className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/20 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                      <button type="button" onClick={() => removeImage(i)} aria-label={`Remove photo ${i + 1}`} className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 className="font-serif text-2xl text-ink">Your details</h3>
            <p className="mt-2 text-[15px] text-stone2">Visitors see your advertiser type and name. Your phone is only revealed when they choose to view it.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <fieldset className="sm:col-span-2">
                <legend className={labelClass}>I am listing as</legend>
                <div className="flex flex-wrap gap-2">
                  {ADVERTISER_TYPES.map((a) => (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={draft.advertiserType === a}
                      onClick={() => set("advertiserType", a)}
                      className={`rounded-full border px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                        draft.advertiserType === a ? "border-ink bg-ink text-white" : "border-line text-stone2 hover:border-ink/40 hover:text-ink"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="wz-name" className={labelClass}>Name / business name *</label>
                <input id="wz-name" value={draft.advertiserName} onChange={(e) => set("advertiserName", e.target.value)} className={inputClass} autoComplete="name" />
                {errors.advertiserName && <p role="alert" className="mt-1.5 text-sm text-red-700">{errors.advertiserName}</p>}
              </div>
              <div>
                <label htmlFor="wz-phone" className={labelClass}>Phone number *</label>
                <input id="wz-phone" type="tel" inputMode="tel" value={draft.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 …" className={inputClass} autoComplete="tel" />
                {errors.phone && <p role="alert" className="mt-1.5 text-sm text-red-700">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="wz-wa" className={labelClass}>WhatsApp number (optional)</label>
                <input id="wz-wa" type="tel" inputMode="tel" value={draft.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+91 …" className={inputClass} />
              </div>
              {user && (
                <p className="text-sm text-muted sm:col-span-2">
                  Signed in as {user.name} ({user.email}). Your listing will appear under this account in the demo dashboard.
                </p>
              )}
            </div>
          </div>
        )}

        {step === 7 && (
          <div>
            <h3 className="font-serif text-2xl text-ink">Preview your listing</h3>
            <p className="mt-2 text-[15px] text-stone2">This is exactly how visitors will see it. Go back to any step to make changes.</p>
            <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
              <PropertyCard property={preview} />
              <dl className="divide-y divide-line rounded-2xl border border-line bg-white">
                {[
                  ["Listing type", draft.listingType === "buy" ? "For sale" : "For rent"],
                  ["Property type", draft.category],
                  ["Location", `${draft.address}, ${draft.locality}, ${draft.city}`],
                  ["Area", `${draft.area} ${draft.areaUnit}`],
                  ["Advertiser", `${draft.advertiserName} (${draft.advertiserType})`],
                  ["Status on submit", "Pending Moderation"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <dt className="text-sm text-muted">{k}</dt>
                    <dd className="text-right text-sm font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-5 rounded-xl bg-mist px-4 py-3 text-sm leading-relaxed text-stone2">
              On submit, your listing is saved as <strong className="text-ink">Pending Moderation</strong> in this
              demo. In production, a moderator reviews it before it becomes visible. NIVORA does not verify
              ownership or legality of advertised properties.
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="flex h-12 items-center gap-2 rounded-full border border-line px-5 text-[15px] font-medium text-ink transition hover:border-ink/40 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
          </button>
          <p className="hidden text-sm text-muted sm:block">Progress saves automatically on this device.</p>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} size="lg">
              Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button onClick={submit} size="lg" variant="bronze">
              <Check className="h-4 w-4" aria-hidden="true" /> Submit listing
            </Button>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setDraft(EMPTY_DRAFT);
            setStep(0);
            try {
              localStorage.removeItem("nivora:listing-draft");
            } catch {
              /* ignore */
            }
            toast.push("Draft cleared");
          }}
          className="mt-4 inline-flex items-center gap-1.5 rounded py-2 text-sm text-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" /> Discard draft and start over
        </button>
      </div>
    </div>
  );
}
