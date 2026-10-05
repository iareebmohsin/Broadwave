import { BrandMark } from "@/components/brand-logo";

export function Logo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-y-4">
      <BrandMark className="size-16 rounded-2xl [&>svg]:size-8" />
      <div className="flex flex-col items-center">
        <p className="text-2xl font-bold tracking-tight">
          Broad<span className="text-primary">wave</span>
        </p>
        <p className="text-sm text-muted-foreground">Go live in a minute</p>
      </div>
    </div>
  );
}
