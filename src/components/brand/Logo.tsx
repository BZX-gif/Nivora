import Link from "next/link";
import {
  LOCKUP_HEIGHT,
  LOCKUP_VIEW_BOX,
  LOCKUP_WIDTH,
  LOCKUP_WORDMARK_PATH,
  SYMBOL_PATHS,
  SYMBOL_VIEW_BOX,
  WORDMARK_PATH,
  WORDMARK_VIEW_BOX,
} from "./mark-paths.generated";

/**
 * NIVORA brand mark — two volumes, one channel.
 *
 * A wall turning into a floor, and a separate block, held apart by a 10-unit
 * channel of space that enters the form from two sides. Architectural in origin,
 * abstract in reading: not a house, roof, door or pin.
 *
 * Geometry is generated (docs/brand/geometry.mjs → mark-paths.generated.ts) and
 * the wordmark is outlined from Inter SemiBold, so nothing here depends on a
 * font being installed. Everything inherits `currentColor`.
 */

const LOCKUP_RATIO = `${LOCKUP_WIDTH} / ${LOCKUP_HEIGHT}`;
const WORDMARK_RATIO = "675.557 / 100";

/** The symbol alone — square, colour inherited, recognisable at 16px. */
export function LogoSymbol({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox={SYMBOL_VIEW_BOX} fill="none" className={className} aria-hidden="true">
      {SYMBOL_PATHS.map((d) => (
        <path key={d} fill="currentColor" d={d} />
      ))}
    </svg>
  );
}

/** The wordmark alone — for places where the symbol has already been established. */
export function LogoWordmark({ className = "h-5" }: { className?: string }) {
  return (
    <svg
      viewBox={WORDMARK_VIEW_BOX}
      fill="none"
      className={className}
      style={{ aspectRatio: WORDMARK_RATIO }}
      aria-hidden="true"
    >
      <path fill="currentColor" d={WORDMARK_PATH} />
    </svg>
  );
}

/** Symbol and wordmark locked up horizontally: the primary logo. */
function LogoLockup({ className = "h-8" }: { className?: string }) {
  return (
    <svg
      viewBox={LOCKUP_VIEW_BOX}
      fill="none"
      className={className}
      style={{ aspectRatio: LOCKUP_RATIO }}
      aria-hidden="true"
    >
      {SYMBOL_PATHS.map((d) => (
        <path key={d} fill="currentColor" d={d} />
      ))}
      <path fill="currentColor" d={LOCKUP_WORDMARK_PATH} />
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

  const inner = (
    <span className={`inline-flex items-center ${color}`}>
      {variant === "symbol" ? <LogoSymbol className="h-8 w-8" /> : <LogoLockup className="h-9" />}
      <span className="sr-only">NIVORA — Find your place.</span>
    </span>
  );

  // `className` always lands on the outermost element, so callers can position
  // the logo whether or not it is wrapped in a link.
  if (!href) return <span className={`inline-flex items-center ${className}`}>{inner}</span>;
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[44px] items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${className}`}
      aria-label="NIVORA home"
    >
      {inner}
    </Link>
  );
}
