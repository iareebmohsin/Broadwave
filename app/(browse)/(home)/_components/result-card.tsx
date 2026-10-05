import Link from "next/link";

import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { User } from "@/generated/prisma";

interface ResultCardProps {
  data: {
    user: User;
    isLive: boolean;
    name: string;
    thumbnailUrl: string | null;
  };
}

export function ResultCard({ data }: ResultCardProps) {
  return (
    <Link className="group block" href={`/${data.user.username}`}>
      <div className="h-full w-full space-y-3">
        <Thumbnail
          fallback={data.user.imageUrl}
          isLive={data.isLive}
          src={data.thumbnailUrl}
          username={data.user.username}
        />
        <div className="flex gap-x-3 px-1">
          <UserAvatar imageUrl={data.user.imageUrl} isLive={data.isLive} username={data.user.username} />
          <div className="flex flex-col overflow-hidden text-sm">
            <p className="truncate font-semibold transition-colors group-hover:text-primary">{data.name}</p>
            <p className="text-xs text-muted-foreground">
              @{data.user.username}
              {!data.isLive && <span className="ml-2 text-muted-foreground/70">Offline</span>}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ResultCardSkeleton() {
  return (
    <div className="h-full w-full space-y-3">
      <ThumbnailSkeleton />
      <div className="flex gap-x-3">
        <UserAvatarSkeleton />
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}
