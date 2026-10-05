import Link from "next/link";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { RadioIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { getSelf } from "@/lib/auth-service";

export async function Actions() {
  let username: string | null = null;
  try {
    // Resolves (and lazily creates) the local channel record for the signed-in account.
    const self = await getSelf();
    username = self.username;
  } catch {
    // Not signed in, or Clerk unreachable — show the sign-in button.
  }

  return (
    <div className="ml-2 flex items-center justify-end gap-x-2 lg:ml-0">
      <ThemeToggle />
      {!username && (
        <SignInButton>
          <Button className="rounded-full px-5 font-semibold" size="sm" variant="primary">
            Sign in
          </Button>
        </SignInButton>
      )}
      {!!username && (
        <div className="flex items-center gap-x-3">
          <Button
            asChild
            className="rounded-full border border-border bg-card font-semibold hover:border-primary/50 hover:text-primary"
            size="sm"
            variant="ghost"
          >
            <Link href={`/u/${username}`}>
              <RadioIcon className="size-4 lg:mr-2" />
              <span className="hidden lg:block">Studio</span>
            </Link>
          </Button>
          <UserButton />
        </div>
      )}
    </div>
  );
}
