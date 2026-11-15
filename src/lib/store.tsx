"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Property } from "@/types/property";

/* ---------------- Favourites ---------------- */

interface FavouritesCtx {
  ids: string[];
  isFav: (id: string) => boolean;
  toggle: (id: string) => void;
}

const FavContext = createContext<FavouritesCtx>({ ids: [], isFav: () => false, toggle: () => {} });

export function useFavourites() {
  return useContext(FavContext);
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — demo state stays in memory */
  }
}

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(readJSON<string[]>("nivora:favs", []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeJSON("nivora:favs", ids);
  }, [ids, ready]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const value = useMemo<FavouritesCtx>(
    () => ({ ids, isFav: (id: string) => ids.includes(id), toggle }),
    [ids, toggle]
  );

  return <FavContext.Provider value={value}>{children}</FavContext.Provider>;
}

/* ---------------- Demo session ---------------- */

export interface SessionUser {
  name: string;
  email: string;
  role: "user" | "admin";
}

interface SessionCtx {
  user: SessionUser | null;
  signIn: (name: string, email: string, role?: "user" | "admin") => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionCtx>({ user: null, signIn: () => {}, signOut: () => {} });

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(readJSON<SessionUser | null>("nivora:session", null));
  }, []);

  const signIn = useCallback((name: string, email: string, role: "user" | "admin" = "user") => {
    const u = { name, email, role };
    setUser(u);
    writeJSON("nivora:session", u);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    writeJSON("nivora:session", null);
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/* ---------------- User-submitted listings (demo) ---------------- */

interface UserListingsCtx {
  listings: Property[];
  addListing: (p: Property) => void;
  updateStatus: (id: string, status: Property["status"]) => void;
  removeListing: (id: string) => void;
}

const UserListingsContext = createContext<UserListingsCtx>({
  listings: [],
  addListing: () => {},
  updateStatus: () => {},
  removeListing: () => {},
});

export function useUserListings() {
  return useContext(UserListingsContext);
}

export function UserListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Property[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setListings(readJSON<Property[]>("nivora:user-listings", []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeJSON("nivora:user-listings", listings);
  }, [listings, ready]);

  const addListing = useCallback((p: Property) => {
    setListings((prev) => [p, ...prev]);
  }, []);

  const updateStatus = useCallback((id: string, status: Property["status"]) => {
    setListings((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }, []);

  const removeListing = useCallback((id: string) => {
    setListings((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo(
    () => ({ listings, addListing, updateStatus, removeListing }),
    [listings, addListing, updateStatus, removeListing]
  );

  return <UserListingsContext.Provider value={value}>{children}</UserListingsContext.Provider>;
}

/* ---------------- Toasts ---------------- */

interface Toast {
  id: number;
  message: string;
}

interface ToastCtx {
  push: (message: string) => void;
}

const ToastContext = createContext<ToastCtx>({ push: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const push = useCallback((message: string) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev.slice(-2), { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-24 left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-full bg-coal px-4 py-2.5 text-sm font-medium text-white shadow-pop"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ---------------- Enquiries (demo) ---------------- */

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  message: string;
  name: string;
  contact: string;
  createdAt: string;
  status: "Sent (demo)" | "Viewed by advertiser (demo)";
}

interface EnquiriesCtx {
  enquiries: Enquiry[];
  addEnquiry: (e: Enquiry) => void;
}

const EnquiriesContext = createContext<EnquiriesCtx>({ enquiries: [], addEnquiry: () => {} });

export function useEnquiries() {
  return useContext(EnquiriesContext);
}

export function EnquiriesProvider({ children }: { children: ReactNode }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEnquiries(readJSON<Enquiry[]>("nivora:enquiries", []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeJSON("nivora:enquiries", enquiries);
  }, [enquiries, ready]);

  const addEnquiry = useCallback((e: Enquiry) => {
    setEnquiries((prev) => [e, ...prev]);
  }, []);

  const value = useMemo(() => ({ enquiries, addEnquiry }), [enquiries, addEnquiry]);
  return <EnquiriesContext.Provider value={value}>{children}</EnquiriesContext.Provider>;
}
