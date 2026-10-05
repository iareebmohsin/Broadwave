import { getFollowedUsers } from "@/lib/follow-service";
import { getRecommended } from "@/lib/recommended-service";

import { Following, FollowingSkeleton } from "./following";
import { Recommended, RecommendedSkeleton } from "./recommended";
import { Toggle, ToggleSkeleton } from "./toggle";
import { Wrapper } from "./wrapper";

export async function Sidebar() {
  const [recommended, following] = await Promise.all([getRecommended(), getFollowedUsers()]);

  return (
    <Wrapper>
      <Toggle />
      <div className="space-y-6 pt-4 lg:pt-0">
        <Following data={following} />
        <Recommended data={recommended} />
      </div>
    </Wrapper>
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="fixed left-0 z-50 flex h-full w-17.5 flex-col border-r border-sidebar-border bg-sidebar lg:w-60">
      <ToggleSkeleton />
      <FollowingSkeleton />
      <RecommendedSkeleton />
    </aside>
  );
}
