"use client";

import { Building2, Inbox, LayoutDashboard, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/listings", label: "My listings", icon: Building2 },
  { href: "/dashboard/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/account", label: "Profile & settings", icon: User },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Dashboard" className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href, l.exact) ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                  isActive(l.href, l.exact) ? "bg-ink text-white" : "text-stone2 hover:bg-mist hover:text-ink"
                }`}
              >
                <l.icon className="h-4 w-4" aria-hidden="true" /> {l.label}
              </Link>
            ))}
            <Link
              href="/list-property"
              className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-bronze transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" /> Add property
            </Link>
          </div>
          <p className="mt-6 hidden rounded-2xl border border-dashed border-bronze/50 bg-mist px-4 py-3 text-xs leading-relaxed text-stone2 lg:block">
            Demo dashboard — counts reflect data stored on this device only. No fabricated analytics.
          </p>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
