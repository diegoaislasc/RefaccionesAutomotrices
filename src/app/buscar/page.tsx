import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  parseSearchPageParams,
  SEARCH_PAGE_SIZE,
} from "@/lib/search-url";
import { runProductSearch } from "@/lib/search-server";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchBar } from "@/components/search/search-bar";
import { ProductCard } from "@/components/product/product-card";
import type { Tables } from "@/types/database";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = parseSearchPageParams(sp);
  const supabase = await createClient();

  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").order("sort_order"),
    supabase.from("brands").select("id, name, slug").order("name"),
  ]);

  let products: Tables<"products">[] = [];
  let total = 0;
  let errorMsg: string | null = null;

  try {
    const res = await runProductSearch(supabase, params);
    products = res.products;
    total = res.total;
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : "Error al buscar productos";
  }

  const totalPages = Math.max(1, Math.ceil(total / SEARCH_PAGE_SIZE));

  const brandIds = [
    ...new Set(products.map((p) => p.brand_id).filter(Boolean)),
  ] as string[];
  let brandMap = new Map<string, string>();
  if (brandIds.length) {
    const { data: brandRows } = await supabase
      .from("brands")
      .select("id, name")
      .in("id", brandIds);
    brandMap = new Map(brandRows?.map((b) => [b.id, b.name]) ?? []);
  }

  function buildPageLink(pageNum: number) {
    const q = new URLSearchParams();
    if (params.q) q.set("q", params.q);
    if (params.category) q.set("category", params.category);
    if (params.brandSlugs) q.set("brands", params.brandSlugs);
    if (params.minPrice != null) q.set("min_price", String(params.minPrice));
    if (params.maxPrice != null) q.set("max_price", String(params.maxPrice));
    if (pageNum > 1) q.set("page", String(pageNum));
    const s = q.toString();
    return s ? `/buscar?${s}` : "/buscar";
  }

  const start = total === 0 ? 0 : (params.page - 1) * SEARCH_PAGE_SIZE + 1;
  const end = Math.min(params.page * SEARCH_PAGE_SIZE, total);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <SearchBar variant="compact" initialQuery={params.q} />
      </div>

      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Resultados</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {params.q.trim()
            ? `Busqueda: "${params.q.trim()}"`
            : "Todos los productos activos"}
          {total > 0 ? (
            <span className="ml-2">
              ({start}–{end} de {total})
            </span>
          ) : (
            <span className="ml-2">(0 resultados)</span>
          )}
        </p>
      </header>

      {errorMsg ? (
        <div className="mb-8 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-medium text-destructive">{errorMsg}</p>
          <p className="mt-2 text-muted-foreground">
            Si el error menciona una funcion RPC, ejecuta en Supabase SQL Editor
            la migracion{" "}
            <code className="rounded bg-muted px-1 text-foreground">
              supabase/migrations/002_search_rpc.sql
            </code>
            .
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-8 lg:flex-row">
        <Suspense
          fallback={
            <div className="h-48 w-56 shrink-0 animate-pulse rounded-md bg-muted" />
          }
        >
          <SearchFilters
            categories={categories ?? []}
            brands={brands ?? []}
          />
        </Suspense>

        <div className="min-w-0 flex-1">
          {products.length === 0 && !errorMsg ? (
            <p className="text-muted-foreground">
              No hay productos con estos criterios. Prueba otra busqueda o ajusta
              los filtros.
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <li key={p.id}>
                  <ProductCard
                    product={p}
                    brandName={
                      p.brand_id ? brandMap.get(p.brand_id) ?? null : null
                    }
                  />
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 ? (
            <nav
              className="mt-10 flex items-center justify-center gap-2"
              aria-label="Paginacion"
            >
              {params.page > 1 ? (
                <Link
                  href={buildPageLink(params.page - 1)}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
                >
                  Anterior
                </Link>
              ) : (
                <span className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
                  Anterior
                </span>
              )}
              <span className="px-2 text-sm text-muted-foreground">
                Pagina {params.page} de {totalPages}
              </span>
              {params.page < totalPages ? (
                <Link
                  href={buildPageLink(params.page + 1)}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
                >
                  Siguiente
                </Link>
              ) : (
                <span className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
                  Siguiente
                </span>
              )}
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
