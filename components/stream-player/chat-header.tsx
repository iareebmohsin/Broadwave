"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { ChatToggle } from "./chat-toggle";
import { VariantToggle } from "./variant-toggle";

export function ChatHeader() {
  return (
    <div className="relative border-b border-border p-3">
      <div className="absolute top-2 left-2 hidden lg:block">
        <ChatToggle />
      </div>
      <p className="text-center text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        Live chat
      </p>
      <div className="absolute top-2 right-2">
        <VariantToggle />
      </div>
    </div>
  );
}

export function ChatHeaderSkeleton() {
  return (
    <div className="relative hidden border-b p-3 md:block">
      <Skeleton className="absolute top-3 left-3 size-6" />
      <Skeleton className="mx-auto h-6 w-28" />
    </div>
  );
}
