/**
 * Webhook-free live status.
 *
 * The original design relied on LiveKit `ingress_started` / `ingress_ended`
 * webhooks, which need a public URL (ngrok) during local development.
 * Instead, this helper asks LiveKit which rooms currently have a publisher
 * and mirrors that into `stream.isLive`. Ingress rooms are named after the
 * host's user id (see actions/ingress.ts), so room name == stream.userId.
 *
 * Calls are throttled so a burst of server components rendering the same
 * page only hits the LiveKit API once every few seconds.
 */
import { RoomServiceClient } from "livekit-server-sdk";
import { db } from "@/lib/db";

const THROTTLE_MS = 5_000;
let lastRefresh = 0;
let inFlight: Promise<void> | null = null;

export async function refreshLiveStatus(): Promise<void> {
  const url = process.env.LIVEKIT_API_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  if (!url || !apiKey || !apiSecret) return;

  const now = Date.now();
  if (now - lastRefresh < THROTTLE_MS) return inFlight ?? undefined;
  lastRefresh = now;

  inFlight = (async () => {
    try {
      const client = new RoomServiceClient(url, apiKey, apiSecret);
      const rooms = await client.listRooms();
      const liveHostIds = rooms
        .filter((room) => room.numPublishers > 0)
        .map((room) => room.name);

      await db.stream.updateMany({
        where: { isLive: true, userId: { notIn: liveHostIds } },
        data: { isLive: false },
      });
      if (liveHostIds.length > 0) {
        await db.stream.updateMany({
          where: { isLive: false, userId: { in: liveHostIds } },
          data: { isLive: true },
        });
      }
    } catch (error) {
      console.warn("Live status refresh failed:", error);
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
