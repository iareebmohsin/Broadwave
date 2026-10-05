import { Actions } from "./actions";
import { Logo } from "./logo";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-between gap-x-4 border-b border-border bg-background/80 px-3 backdrop-blur-md lg:px-6">
      <Logo />
      <Actions />
    </nav>
  );
}
