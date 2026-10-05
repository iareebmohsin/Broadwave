"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SearchIcon, XIcon } from "lucide-react";
import qs from "query-string";

export function Search() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: { term: trimmedValue },
      },
      { skipEmptyString: true },
    );
    router.push(url);
  }

  function onClear() {
    setValue("");
  }

  return (
    <form className="relative flex w-full items-center lg:w-[460px]" onSubmit={onSubmit}>
      <button
        aria-label="Search"
        className="absolute left-4 text-muted-foreground transition hover:text-primary"
        type="submit"
      >
        <SearchIcon className="size-[18px]" />
      </button>
      <input
        className="h-11 w-full rounded-full border border-border bg-card pr-11 pl-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus:outline-none"
        placeholder="Search channels"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button
          aria-label="Clear search"
          className="absolute right-4 text-muted-foreground transition hover:text-foreground"
          type="button"
          onClick={onClear}
        >
          <XIcon className="size-[18px]" />
        </button>
      )}
    </form>
  );
}
