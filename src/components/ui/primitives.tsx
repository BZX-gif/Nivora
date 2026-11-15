"use client";

import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import type { ListingStatus } from "@/types/property";

/* ---------------- Buttons ---------------- */

type ButtonVariant = "primary" | "outline" | "ghost" | "dark" | "bronze" | "light" | "ghostlight";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-coal",
  dark: "bg-coal text-white hover:bg-black",
  bronze: "bg-bronze text-white hover:bg-bronzedark",
  outline: "border border-line bg-white text-ink hover:border-ink/40",
  ghost: "text-ink hover:bg-mist",
  /** White pill on photography / dark panels */
  light: "bg-white text-ink hover:bg-mist",
  /** Text button for dark panels */
  ghostlight: "text-white hover:bg-white/10",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-[15px]",
    lg: "h-[52px] px-7 text-base",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyles[variant]} ${sizes[size]} ${className}`}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}) {
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-[15px]",
    lg: "h-[52px] px-7 text-base",
  };
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${buttonStyles[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* ---------------- Badges ---------------- */

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink backdrop-blur-sm ${className}`}>
      {children}
    </span>
  );
}

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-dashed border-bronze/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-bronzedark ${className}`}>
      Demo listing
    </span>
  );
}

const statusStyles: Record<ListingStatus, string> = {
  Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-mist text-stone2 border-line",
  "Pending Moderation": "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Expired: "bg-mist text-muted border-line",
  Unavailable: "bg-mist text-muted border-line",
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

/* ---------------- Skeleton ---------------- */

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="aspect-[4/3] animate-pulse bg-mist" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-mist" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-mist" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-mist" />
      </div>
    </div>
  );
}

/* ---------------- Empty state ---------------- */

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-mist/60 px-6 py-16 text-center">
      <p className="font-serif text-2xl text-ink">{title}</p>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-stone2">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ---------------- Section heading ---------------- */

export function SectionHeading({
  eyebrow,
  title,
  message,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  message?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bronze">{eyebrow}</p>
      )}
      <h2 className="mt-3 text-balance font-serif text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      {message && <p className="mt-3 text-[15px] leading-relaxed text-stone2 sm:text-base">{message}</p>}
    </div>
  );
}

/* ---------------- Scroll reveal ---------------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Accessible modal ---------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close dialog" onClick={onClose} className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={`relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-pop sm:rounded-3xl ${wide ? "max-w-3xl" : "max-w-lg"}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 className="font-serif text-2xl text-ink">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-stone2 transition hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
