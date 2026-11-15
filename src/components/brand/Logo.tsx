import Link from "next/link";

/**
 * NIVORA logo — an original geometric mark: the letter N whose diagonal
 * rises into a roofline, forming a doorway in the negative space.
 * Rendered as inline SVG so it stays sharp at every size and inherits
 * colour from `currentColor`.
 */
export function LogoSymbol({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path fill="currentColor" d="M8 24 32 10l24 14h-7L32 15.5 15 24H8Z" />
      <path fill="currentColor" d="M12 24h7v28h-7V24Z" />
      <path fill="currentColor" d="M45 24h7v28h-7V24Z" />
      <path fill="currentColor" d="M19 24h7.5L45 52h-7.5L19 24Z" />
    </svg>
  );
}

interface LogoProps {
  variant?: "horizontal" | "symbol";
  /** "dark" = ink on light background, "light" = white on dark background */
  theme?: "dark" | "light";
  className?: string;
  href?: string;
}

export function Logo({ variant = "horizontal", theme = "dark", className = "", href = "/" }: LogoProps) {
  const color = theme === "light" ? "text-white" : "text-ink";
  const inner =
    variant === "symbol" ? (
      <span className={`inline-flex items-center ${color}`}>
        <LogoSymbol className="h-8 w-8" />
        <span className="sr-only">NIVORA — Find your place.</span>
      </span>
    ) : (
      <span className={`inline-flex items-center gap-2.5 ${color}`}>
        <LogoSymbol className="h-8 w-8 shrink-0" />
        <span className="text-[19px] font-semibold tracking-[0.32em]">NIVORA</span>
        <span className="sr-only">NIVORA — Find your place.</span>
      </span>
    );

  if (!href) return <span className={className}>{inner}</span>;
  return (
    <Link href={href} className={`inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${className}`} aria-label="NIVORA home">
      {inner}
    </Link>
  );
}
