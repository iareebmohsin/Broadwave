"use client";

import { VerifiedMark } from "@/components/verified-mark";

import { BioModal } from "./bio-modal";

interface AboutCardProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  bio: string | null;
  followedByCount: number;
}

export function AboutCard({ hostName, hostIdentity, viewerIdentity, bio, followedByCount }: AboutCardProps) {
  const hostAsViewer = `host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;
  const followedByLabel = followedByCount === 1 ? "follower" : "followers";

  return (
    <div className="px-4">
      <div className="group flex flex-col gap-y-3 rounded-2xl border border-border bg-card p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-lg font-bold tracking-tight lg:text-2xl">
            About {hostName}
            <VerifiedMark />
          </div>
          {isHost && <BioModal initialValue={bio} />}
        </div>
        <div className="inline-flex w-fit items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          <span className="mr-1.5 font-semibold text-foreground">{followedByCount}</span> {followedByLabel}
        </div>
        <p className="text-sm leading-relaxed text-foreground/85">
          {bio && bio.trim() ? bio : "This creator hasn't written a bio yet."}
        </p>
      </div>
    </div>
  );
}
