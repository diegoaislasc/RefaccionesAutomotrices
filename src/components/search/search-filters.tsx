"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CategoryRow = { id: string; name: string; slug: string };
type BrandRow = { id: string; name: string; slug: string };

type SearchFiltersProps = {
  categories: CategoryRow[];
  brands: BrandRow[];
};

export function SearchFilters({ categories, brands }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const selectedBrands = useMemo(() => {
    const raw = searchParams.get("brands");
    if (!raw) return new Set<string>();
    return new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }, [searchParams]);

  const currentCategory = searchParams.get("category") ?? "";
  const minPrice = searchParams.get("min_price") ?? "";
  const maxPrice = searchParams.get("max_price") ?? "";

  const pushParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      p.delete("page");
      const qs = p.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [pathname, router, searchParams]
  );

  const toggleBrand = (slug: string) => {
    pushParams((p) => {
      const next = new Set(selectedBrands);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      const joined = [...next].join(",");
      if (joined) p.set("brands", joined);
      else p.delete("brands");
    });
  };

  const onCategoryChange = (slug: string) => {
    pushParams((p) => {
      if (slug) p.set("category", slug);
      else p.delete("category");
    });
  };

  const applyPrice = (form: FormData) => {
    const min = String(form.get("min_price") ?? "").trim();
    const max = String(form.get("max_price") ?? "").trim();
    pushParams((p) => {
      if (min) p.set("min_price", min);
      else p.delete("min_price");
      if (max) p.set("max_price", max);
      else p.delete("max_price");
    });
  };

  const clearFilters = () => {
    const q = searchParams.get("q");
    startTransition(() => {
      const p = new URLSearchParams();
      if (q) p.set("q", q);
      const qs = p.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  return (
    <aside className="w-full shrink-0 space-y-8 lg:w-56">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Categoria
        </h3>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          value={currentCategory}
          disabled={pending}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Marca
        </h3>
        <ul className="space-y-2">
          {brands.map((b) => (
            <li key={b.id}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input"
                  checked={selectedBrands.has(b.slug)}
                  disabled={pending}
                  onChange={() => toggleBrand(b.slug)}
                />
                {b.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Precio (MXN)
        </h3>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            applyPrice(new FormData(e.currentTarget));
          }}
        >
          <Input
            name="min_price"
            type="number"
            min={0}
            step={1}
            placeholder="Min"
            defaultValue={minPrice}
            disabled={pending}
          />
          <Input
            name="max_price"
            type="number"
            min={0}
            step={1}
            placeholder="Max"
            defaultValue={maxPrice}
            disabled={pending}
          />
          <Button type="submit" size="sm" className="w-full" disabled={pending}>
            Aplicar precio
          </Button>
        </form>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        disabled={pending}
        onClick={clearFilters}
      >
        Limpiar filtros
      </Button>
    </aside>
  );
}
