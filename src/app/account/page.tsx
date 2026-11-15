"use client";

import { Heart, Inbox, LogOut, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEnquiries, useFavourites, useSession, useToast } from "@/lib/store";
import { Button, ButtonLink } from "@/components/ui/primitives";

export default function AccountPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, signOut } = useSession();
  const { ids } = useFavourites();
  const { enquiries } = useEnquiries();

  const clearDemoData = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("nivora:"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    signOut();
    toast.push("Demo data cleared. You have been signed out.");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mist">
          <User className="h-6 w-6 text-bronze" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-serif text-3xl text-ink">Sign in to continue</h1>
        <p className="mt-2 text-[15px] text-stone2">
          Your account, saved properties and enquiries live here. Demo sign-in takes seconds.
        </p>
        <ButtonLink href="/sign-in" size="lg" className="mt-6">Sign in</ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">My account</h1>

      <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-serif text-xl text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-lg font-semibold text-ink">{user.name}</p>
            <p className="text-sm text-stone2">{user.email}</p>
            <p className="mt-0.5 text-xs text-muted">Role: {user.role === "admin" ? "Administrator (demo)" : "Member (demo)"}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/saved"
            className="flex items-center gap-3 rounded-2xl border border-line px-5 py-4 transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <Heart className="h-5 w-5 text-bronze" aria-hidden="true" />
            <span>
              <span className="block font-medium text-ink">{ids.length} saved properties</span>
              <span className="text-sm text-muted">View your favourites</span>
            </span>
          </Link>
          <Link
            href="/dashboard/enquiries"
            className="flex items-center gap-3 rounded-2xl border border-line px-5 py-4 transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <Inbox className="h-5 w-5 text-bronze" aria-hidden="true" />
            <span>
              <span className="block font-medium text-ink">{enquiries.length} enquiries sent</span>
              <span className="text-sm text-muted">Track your messages (demo)</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-line bg-white p-6">
        <h2 className="font-serif text-xl text-ink">Account settings</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-stone2">
          This is a demo account stored on your device. There is no password change, email
          verification or server account in this build.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => {
              signOut();
              toast.push("Signed out (demo)");
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
          </Button>
          <Button variant="outline" onClick={clearDemoData} className="border-red-200 text-red-700 hover:bg-red-50">
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Clear all demo data
          </Button>
        </div>
      </div>
    </div>
  );
}
