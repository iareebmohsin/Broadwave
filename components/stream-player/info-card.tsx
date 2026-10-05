"use client";

import Image from "next/image";

import { PencilIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { InfoModal } from "./info-modal";

interface InfoCardProps {
  name: string;
  thumbnailUrl: string | null;
  hostIdentity: string;
  viewerIdentity: string;
}

export function InfoCard({ name, thumbnailUrl, hostIdentity, viewerIdentity }: InfoCardProps) {
  const hostAsViewer = `host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  if (!isHost) return null;

  return (
    <div className="px-4">
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-x-3 p-4">
          <div className="rounded-xl bg-primary p-2 text-primary-foreground">
            <PencilIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold lg:text-base">Stream details</h2>
            <p className="text-xs text-muted-foreground">Title and thumbnail shown on your channel card</p>
          </div>
          <InfoModal initialName={name} initialThumbnailUrl={thumbnailUrl} />
        </div>
        <Separator />
        <div className="space-y-4 p-4 lg:p-6">
          <div>
            <h3 className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">Title</h3>
            <p className="text-sm font-medium">{name}</p>
          </div>
          <div>
            <h3 className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">Thumbnail</h3>
            {thumbnailUrl ? (
              <div className="relative aspect-video w-50 overflow-hidden rounded-xl border border-border">
                <Image alt={name} className="object-cover" fill sizes="200px" src={thumbnailUrl} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">None yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
