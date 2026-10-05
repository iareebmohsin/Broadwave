import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
}

/** Coral rounded tile with the wave glyph. */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)]",
        className,
      )}
    >
      <svg
        aria-hidden
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
        viewBox="0 0 24 24"
      >
        <path d="M3 13c2 0 2-5 4-5s2 9 4 9 2-9 4-9 2 5 4 5" />
        <circle cx="19.5" cy="5.5" fill="currentColor" r="1.6" stroke="none" />
      </svg>
    </span>
  );
}

interface BrandLogoProps {
  subtitle?: string;
  href?: string;
  /** Extra classes on the mark wrapper (used for mobile spacing in navbars). */
  markClassName?: string;
}

/** Mark plus wordmark. The wordmark hides on small screens. */
export function BrandLogo({ subtitle, href = "/", markClassName }: BrandLogoProps) {
  return (
    <Link className="flex items-center gap-x-3 transition hover:opacity-80" href={href}>
      <BrandMark className={markClassName} />
      <div className="hidden leading-tight lg:block">
        <p className="text-[17px] font-bold tracking-tight">
          Broad<span className="text-primary">wave</span>
        </p>
        {subtitle && (
          <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">{subtitle}</p>
        )}
      </div>
    </Link>
  );
}
