"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Hint } from "@/components/hint";
import { LiveBadge } from "@/components/live-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

interface UserItemProps {
  username: string;
  imageUrl: string;
  isLive?: boolean;
}

export function UserItem({ username, imageUrl, isLive }: UserItemProps) {
  const pathname = usePathname();
  const { collapsed } = useSidebar((state) => state);
  const href = `/${username}`;
  const isActive = pathname === href;

  const content = (
    <Button
      asChild
      className={cn(
        "h-12 w-full rounded-xl",
        collapsed ? "justify-center" : "justify-start",
        isActive && "bg-accent text-primary",
      )}
      variant="ghost"
    >
      <Link aria-label={username} href={href}>
        <div className={cn("flex w-full items-center gap-x-3", collapsed && "justify-center")}>
          <UserAvatar imageUrl={imageUrl} isLive={isLive} username={username} />
          {!collapsed && <p className="truncate text-sm font-medium">{username}</p>}
          {!collapsed && isLive && <LiveBadge className="ml-auto" />}
        </div>
      </Link>
    </Button>
  );

  if (collapsed) {
    return (
      <Hint asChild label={username} side="right">
        {content}
      </Hint>
    );
  }

  return content;
}

export function UserItemSkeleton() {
  return (
    <li className="flex items-center gap-x-4 px-3 py-2">
      <Skeleton className="min-h-8 min-w-8 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-6" />
      </div>
    </li>
  );
}
