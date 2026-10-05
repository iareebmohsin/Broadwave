import type { User as ClerkUser } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

import { User } from "@/generated/prisma/client";
import { db } from "@/lib/db";

async function requireAuthenticatedClerkUser(): Promise<ClerkUser> {
  const self = await currentUser();

  if (!self) {
    throw new Error("Unauthorized");
  }

  return self;
}

/**
 * Clerk accounts created with Google or email-only sign-in may have no
 * username. Derive a stable handle from the username, the email local part,
 * or the Clerk id so every account can own a channel.
 */
export function deriveUsername(self: ClerkUser): string {
  const email = self.emailAddresses?.[0]?.emailAddress ?? "";
  const base = self.username || email.split("@")[0] || `creator_${self.id.slice(-6)}`;
  const cleaned = base.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/^_+|_+$/g, "");
  return cleaned || `creator_${self.id.slice(-6)}`;
}

export async function getSelf(): Promise<User> {
  const self = await requireAuthenticatedClerkUser();

  const user = await db.user.findUnique({
    where: { externalUserId: self.id },
  });

  if (user) {
    return user;
  }

  // No Clerk webhook in local development: create the local record (and the
  // user's stream) on first authenticated request, mirroring the webhook.
  const username = deriveUsername(self);
  return db.user.upsert({
    where: { externalUserId: self.id },
    create: {
      externalUserId: self.id,
      username,
      imageUrl: self.imageUrl,
      stream: {
        create: {
          name: `${username}'s stream`,
        },
      },
    },
    update: {
      imageUrl: self.imageUrl,
    },
  });
}

export async function getSelfByUsername(username: string): Promise<User> {
  const self = await requireAuthenticatedClerkUser();

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.externalUserId !== self.id) {
    throw new Error("Unauthorized");
  }

  return user;
}
