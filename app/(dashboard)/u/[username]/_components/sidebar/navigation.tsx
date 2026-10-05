"use client";

import { useParams, usePathname } from "next/navigation";

import { FullscreenIcon, KeyRoundIcon, MessageSquareIcon, UsersIcon } from "lucide-react";

import { NavItem, NavItemSkeleton } from "./nav-item";

export function Navigation(): React.JSX.Element {
  const pathname = usePathname();
  // The dashboard lives under /u/[username]; read the handle from the route
  // rather than from Clerk, which may have no username set.
  const params = useParams<{ username?: string }>();
  const username = params?.username;

  const routes = [
    { label: "Stream", href: `/u/${username}`, icon: FullscreenIcon },
    { label: "Keys", href: `/u/${username}/keys`, icon: KeyRoundIcon },
    { label: "Chat", href: `/u/${username}/chat`, icon: MessageSquareIcon },
    { label: "Community", href: `/u/${username}/community`, icon: UsersIcon },
  ];

  if (!username) {
    return (
      <ul className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <NavItemSkeleton key={i} />
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2 px-2 pt-4 lg:pt-0">
      {routes.map((route) => (
        <NavItem
          key={route.href}
          href={route.href}
          icon={route.icon}
          isActive={pathname === route.href}
          label={route.label}
        />
      ))}
    </ul>
  );
}
