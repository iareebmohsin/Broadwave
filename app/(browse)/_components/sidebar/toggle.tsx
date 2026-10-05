"use client";

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/store/use-sidebar";

export function Toggle(): React.JSX.Element {
  const { collapsed, onExpand, onCollapse } = useSidebar((state) => state);
  const label = collapsed ? "Expand" : "Collapse";

  return (
    <>
      {collapsed && (
        <div className="mb-4 hidden w-full items-center justify-center pt-4 lg:flex">
          <Hint asChild label={label} side="right">
            <Button className="h-auto rounded-full p-2" variant="ghost" onClick={onExpand}>
              <PanelLeftOpenIcon className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {!collapsed && (
        <div className="mb-2 flex w-full items-center p-3 pl-6">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">Channels</p>
          <Hint asChild label={label} side="right">
            <Button className="ml-auto h-auto rounded-full p-2" variant="ghost" onClick={onCollapse}>
              <PanelLeftCloseIcon className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
    </>
  );
}

export function ToggleSkeleton(): React.JSX.Element {
  return (
    <div className="mb-2 hidden w-full items-center justify-between p-3 pl-6 lg:flex">
      <Skeleton className="h-6 w-25" />
      <Skeleton className="size-6" />
    </div>
  );
}
