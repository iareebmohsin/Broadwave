import { RadioIcon } from "lucide-react";

interface OfflineVideoProps {
  username: string;
}

export function OfflineVideo({ username }: OfflineVideoProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--aqua)_14%,transparent),transparent_70%)]">
      <span className="inline-flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
        <RadioIcon className="size-7" />
      </span>
      <p className="font-medium">{username} is off air</p>
      <p className="text-sm text-muted-foreground">Follow to get notified when they go live.</p>
    </div>
  );
}
