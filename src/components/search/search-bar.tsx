"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearch } from "@/hooks/use-search";
import Link from "next/link";

type Variant = "hero" | "compact" | "landing";

type SearchBarProps = {
  variant?: Variant;
  className?: string;
  initialQuery?: string;
};

export function SearchBar({
  variant = "compact",
  className,
  initialQuery = "",
}: SearchBarProps) {
  const router = useRouter();
  const { query, setQuery, results, loading } = useSearch(300, initialQuery);
  const [open, setOpen] = useState(false);

  const isHero = variant === "hero";
  const isLanding = variant === "landing";

  const submit = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      const params = new URLSearchParams();
      if (trimmed) params.set("q", trimmed);
      router.push(`/buscar?${params.toString()}`);
      setOpen(false);
    },
    [router]
  );

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(query);
  };

  return (
    <div className={cn("relative", className)}>
      <form
        onSubmit={onFormSubmit}
        className={cn(
          "flex gap-2",
          isLanding && "flex-col md:flex-row md:items-stretch"
        )}
      >
        <div className="relative min-w-0 flex-1">
          <Search
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
              isLanding && "left-4 h-5 w-5 text-zinc-400",
              isHero && !isLanding && "left-4 h-5 w-5",
              !isHero && !isLanding && "left-3 h-4 w-4"
            )}
          />
          <Input
            type="search"
            name="q"
            autoComplete="off"
            placeholder={
              isLanding
                ? "Busca por pieza, marca o modelo..."
                : isHero
                  ? "Buscar por nombre, SKU o numero de parte..."
                  : "Buscar refacciones..."
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              window.setTimeout(() => setOpen(false), 150);
            }}
            className={cn(
              isLanding &&
                "h-12 rounded-xl border-0 bg-transparent pl-12 text-base text-white shadow-none ring-0 placeholder:text-zinc-500 focus-visible:ring-0",
              isHero &&
                !isLanding &&
                "h-12 rounded-xl pl-12 text-base",
              !isHero && !isLanding && "h-9 pl-9"
            )}
          />
          {loading && (
            <Loader2
              className={cn(
                "absolute top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground",
                isLanding && "right-4 text-zinc-400",
                isHero && !isLanding && "right-4",
                !isHero && !isLanding && "right-3"
              )}
            />
          )}
        </div>
        <Button
          type="submit"
          size={isHero || isLanding ? "lg" : "default"}
          className={cn(
            (isHero || isLanding) && "h-12 shrink-0 rounded-xl",
            isLanding &&
              "border-0 bg-[#b61722] font-bold text-white hover:bg-[#da3437]"
          )}
        >
          Buscar
        </Button>
      </form>

      {open && (query.trim().length >= 2 || results.length > 0) && (
        <div
          className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
          role="listbox"
        >
          {results.length === 0 && !loading && query.trim().length >= 2 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Sin coincidencias
            </p>
          ) : (
            <ul className="py-1">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/producto/${p.slug}`}
                    className="block px-3 py-2 text-sm hover:bg-accent"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="font-medium">{p.name}</span>
                    {p.part_number ? (
                      <span className="ml-2 text-muted-foreground">
                        {p.part_number}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
