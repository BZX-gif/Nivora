"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/primitives";
import { useSession, useToast } from "@/lib/store";

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";

export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();
  const { signIn } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 4) return setError("Password must be at least 4 characters (demo only).");
    signIn(name.trim(), email, "user");
    toast.push("Account created (demo) — welcome to NIVORA");
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 sm:px-6 lg:py-24">
      <Logo />
      <h1 className="mt-8 font-serif text-3xl text-ink">Create your account</h1>
      <p className="mt-2 text-center text-[15px] text-stone2">List properties, save favourites and track enquiries.</p>

      <form onSubmit={submit} className="mt-8 w-full space-y-4" noValidate>
        <div>
          <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
          <input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-ink">Password</label>
          <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} autoComplete="new-password" placeholder="••••••••" />
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        <Button type="submit" size="lg" className="w-full">Create account</Button>
      </form>

      <p className="mt-6 text-sm text-stone2">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded">
          Sign in
        </Link>
      </p>

      <div className="mt-8 w-full rounded-2xl border border-dashed border-bronze/50 bg-mist px-5 py-4 text-sm leading-relaxed text-stone2">
        <strong className="text-ink">Demo only.</strong> This creates a local demo session on your device — no
        real account, no email verification, no data leaves your browser.
      </div>
    </div>
  );
}
