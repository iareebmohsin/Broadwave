import Image from "next/image";
import Link from "next/link";

import { PlayIcon } from "lucide-react";

import { LiveBadge } from "@/components/live-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { getStreams } from "@/lib/feed-service";

import { ResultCard, ResultCardSkeleton } from "./result-card";

type Stream = Awaited<ReturnType<typeof getStreams>>[number];

function Featured({ stream }: { stream: Stream }) {
  return (
    <Link
      className="group relative mb-8 block overflow-hidden rounded-3xl border border-border bg-card"
      href={`/${stream.user.username}`}
    >
      <div className="relative aspect-[21/9] w-full">
        {stream.thumbnailUrl ? (
          <Image
            alt={stream.name}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            src={stream.thumbnailUrl}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,color-mix(in_oklab,var(--aqua)_25%,transparent),transparent_70%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between lg:p-10">
          <div className="max-w-2xl text-white">
            <div className="mb-3 flex items-center gap-2">
              {stream.isLive ? (
                <LiveBadge />
              ) : (
                <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase backdrop-blur">
                  Featured channel
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{stream.name}</h1>
            <div className="mt-3 flex items-center gap-x-3">
              <UserAvatar imageUrl={stream.user.imageUrl} isLive={stream.isLive} username={stream.user.username} />
              <div className="text-sm">
                <p className="font-semibold">@{stream.user.username}</p>
                {stream.user.bio && <p className="line-clamp-1 text-white/70">{stream.user.bio}</p>}
              </div>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_30px_-8px_var(--primary)] transition group-hover:brightness-110">
            <PlayIcon className="size-4 fill-current" />
            {stream.isLive ? "Watch live" : "Open channel"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export async function Results() {
  const data = await getStreams();
  const liveCount = data.filter((s) => s.isLive).length;
  const featured = data.find((s) => s.isLive) ?? data[0];
  const rest = featured ? data.filter((s) => s.id !== featured.id) : data;

  return (
    <div>
      {featured && <Featured stream={featured} />}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">Browse</p>
          <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Channels on air</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <span className={liveCount > 0 ? "live-dot size-2 rounded-full bg-primary" : "size-2 rounded-full bg-muted-foreground/40"} />
          {liveCount} live now
        </div>
      </div>

      {data.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
          <p className="font-semibold">No channels yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Sign in, open your studio, and be the first to go live.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {rest.map((result) => (
          <ResultCard key={result.id} data={result} />
        ))}
      </div>
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-8 aspect-[21/9] w-full rounded-3xl" />
      <Skeleton className="mb-6 h-9 w-72.5" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {[...Array(4)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
