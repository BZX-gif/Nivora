"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, Heart, Home, KeyRound, LayoutDashboard, LogOut, Map, Menu, PlusCircle, Search, ShieldCheck, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useSession } from "@/lib/store";

const NAV_LINKS = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/explore", label: "Explore" },
  { href: "/list-property", label: "List your property" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-line bg-white/90 shadow-[0_1px_0_rgba(21,21,21,0.02)] backdrop-blur-xl" : "bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                  isActive(l.href) ? "bg-mist text-ink" : "text-stone2 hover:bg-mist hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/saved"
              aria-label="Saved properties"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-stone2 transition hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink sm:flex"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {user ? (
              <div className="relative">
                {accountOpen && (
                  <button
                    aria-label="Close account menu"
                    onClick={() => setAccountOpen(false)}
                    className="fixed inset-0 z-10 cursor-default"
                    tabIndex={-1}
                  />
                )}
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  className="flex h-10 items-center gap-2 rounded-full border border-line bg-white pl-1.5 pr-3 text-sm font-medium text-ink transition hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[120px] truncate sm:block">{user.name}</span>
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      role="menu"
                      className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-2xl border border-line bg-white py-2 shadow-pop"
                    >
                      <p className="border-b border-line px-4 py-2.5 text-xs text-muted">
                        Signed in as <span className="font-medium text-ink">{user.email}</span>
                      </p>
                      {[
                        { href: "/account", label: "My account", icon: User },
                        { href: "/dashboard", label: "Advertiser dashboard", icon: LayoutDashboard },
                        { href: "/dashboard/listings", label: "My listings", icon: Building2 },
                        { href: "/saved", label: "Saved properties", icon: Heart },
                        ...(user.role === "admin"
                          ? [{ href: "/admin", label: "Admin & moderation", icon: ShieldCheck }]
                          : []),
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink"
                        >
                          <item.icon className="h-4 w-4 text-stone2" /> {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleSignOut}
                        role="menuitem"
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink"
                      >
                        <LogOut className="h-4 w-4 text-stone2" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="hidden h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-white transition hover:bg-coal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 sm:inline-flex"
              >
                Sign in
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-[2px] lg:hidden"
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile"
              className="fixed right-0 top-0 z-[61] flex h-full w-[86%] max-w-sm flex-col bg-white shadow-pop lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <Logo />
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {[
                  { href: "/buy", label: "Buy properties", icon: KeyRound },
                  { href: "/rent", label: "Rent properties", icon: Home },
                  { href: "/explore", label: "Explore map", icon: Map },
                  { href: "/list-property", label: "List your property", icon: PlusCircle },
                  { href: "/saved", label: "Saved properties", icon: Heart },
                  { href: "/about", label: "About NIVORA", icon: Search },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-base font-medium text-ink transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    <l.icon className="h-5 w-5 text-stone2" /> {l.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-line p-5">
                {user ? (
                  <div className="space-y-2">
                    <Link href="/dashboard" className="flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-medium text-white">
                      Open dashboard
                    </Link>
                    <button onClick={handleSignOut} className="flex h-12 w-full items-center justify-center rounded-full border border-line text-[15px] font-medium text-ink">
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link href="/sign-in" className="flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-medium text-white">
                    Sign in
                  </Link>
                )}
                <p className="mt-4 text-center text-xs text-muted">Find your place.</p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5">
          {[
            { href: "/", label: "Home", icon: Home, active: pathname === "/" },
            { href: "/buy", label: "Buy", icon: KeyRound, active: isActive("/buy") },
            { href: "/rent", label: "Rent", icon: Building2, active: isActive("/rent") },
            { href: "/saved", label: "Saved", icon: Heart, active: isActive("/saved") },
            { href: user ? "/account" : "/sign-in", label: "Account", icon: User, active: isActive("/account") || isActive("/dashboard") },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              aria-current={l.active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink ${
                l.active ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              <l.icon className={`h-5 w-5 ${l.active ? "fill-ink/10" : ""}`} />
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
