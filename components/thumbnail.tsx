import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";

import { LiveBadge } from "./live-badge";

interface ThumbnailProps {
  src: string | null;
  fallback: string;
  isLive: boolean;
  username: string;
}

export function Thumbnail({ src, fallback, isLive, username }: ThumbnailProps) {
  let content;

  if (!src) {
    content = (
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--aqua)_18%,transparent),transparent_70%)]">
        <UserAvatar imageUrl={fallback} isLive={isLive} showBadge size="lg" username={username} />
      </div>
    );
  } else {
    content = (
      <Image
        alt={`${username}'s stream thumbnail`}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
        src={src}
      />
    );
  }

  return (
    <div className="group relative aspect-video cursor-pointer overflow-hidden rounded-2xl border border-border bg-card">
      {content}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      {isLive && src && (
        <div className="absolute top-3 left-3">
          <LiveBadge />
        </div>
      )}
    </div>
  );
}

export function ThumbnailSkeleton() {
  return (
    <div className="group relative aspect-video cursor-pointer rounded-2xl">
      <Skeleton className="h-full w-full rounded-2xl" />
    </div>
  );
}
