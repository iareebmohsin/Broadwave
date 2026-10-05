"use client";

import { useIsClient } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

import { FollowingSkeleton } from "./following";
import { RecommendedSkeleton } from "./recommended";
import { ToggleSkeleton } from "./toggle";

interface WrapperProps {
  children: React.ReactNode;
}

const BASE = "fixed left-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar";

export function Wrapper({ children }: WrapperProps) {
  const isClient = useIsClient();
  const { collapsed } = useSidebar((state) => state);

  if (!isClient) {
    return (
      <aside className={cn(BASE, "w-17.5 lg:w-60")}>
        <ToggleSkeleton />
        <FollowingSkeleton />
        <RecommendedSkeleton />
      </aside>
    );
  }

  return <aside className={cn(BASE, "w-60", collapsed && "w-17.5")}>{children}</aside>;
}
