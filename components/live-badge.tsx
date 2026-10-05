import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  className?: string;
}

export function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-primary-foreground uppercase shadow-[0_4px_14px_-4px_var(--primary)]",
        className,
      )}
    >
      <span className="live-dot size-1.5 rounded-full bg-primary-foreground" />
      Live
    </div>
  );
}
