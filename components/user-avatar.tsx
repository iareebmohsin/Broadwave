import { cva, type VariantProps } from "class-variance-authority";

import { LiveBadge } from "@/components/live-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  username: string;
  imageUrl: string;
  isLive?: boolean;
  showBadge?: boolean;
}

export function UserAvatar({ username, imageUrl, isLive, showBadge, size }: UserAvatarProps) {
  const canShowBadge = showBadge && isLive;

  return (
    <div className="relative">
      <Avatar className={cn(isLive && "border-2 border-background ring-2 ring-primary", avatarSizes({ size }))}>
        <AvatarImage className="object-cover" src={imageUrl} />
        <AvatarFallback className="bg-accent font-semibold text-foreground uppercase">
          {username[0]}
          {username[username.length - 1]}
        </AvatarFallback>
      </Avatar>
      {canShowBadge && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 transform">
          <LiveBadge />
        </div>
      )}
    </div>
  );
}

type UserAvatarSkeletonProps = VariantProps<typeof avatarSizes>;

export function UserAvatarSkeleton({ size }: UserAvatarSkeletonProps) {
  return <Skeleton className={cn("rounded-full", avatarSizes({ size }))} />;
}
