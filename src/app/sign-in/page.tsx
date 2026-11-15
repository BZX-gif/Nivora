"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/primitives";
import { useSession, useToast } from "@/lib/store";

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";

export default function SignInPage() {
  const router = useRouter();
  const toast = useToast();
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Please enter a valid email address.");
    }
    if (password.length < 4) {
      return setError("Password must be at least 4 characters (demo only).");
    }
    const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const role = email.toLowerCase().includes("admin") ? "admin" : "user";
    signIn(name, email, role);
    toast.push(role === "admin" ? "Signed in as demo admin" : "Signed in (demo)");
    router.push(role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 sm:px-6 lg:py-24">
      <Logo />
      <h1 className="mt-8 font-serif text-3xl text-ink">Welcome back</h1>
      <p className="mt-2 text-center text-[15px] text-stone2">Sign in to manage your listings and enquiries.</p>

      <form onSubmit={submit} className="mt-8 w-full space-y-4" noValidate>
        <div>
          <label htmlFor="signin-email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input id="signin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="signin-password" className="mb-1.5 block text-sm font-medium text-ink">Password</label>
          <input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} autoComplete="current-password" placeholder="••••••••" />
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        <Button type="submit" size="lg" className="w-full">Sign in</Button>
      </form>

      <p className="mt-6 text-sm text-stone2">
        New to NIVORA?{" "}
        <Link href="/sign-up" className="font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded">
          Create an account
        </Link>
      </p>

      <div className="mt-8 w-full rounded-2xl border border-dashed border-bronze/50 bg-mist px-5 py-4 text-sm leading-relaxed text-stone2">
        <strong className="text-ink">Demo sign-in.</strong> No real account is created and no password is stored.
        Use any email — include the word <code className="rounded bg-white px-1.5 py-0.5 text-xs">admin</code> in the
        email to preview the admin & moderation area.
      </div>
    </div>
  );
}
