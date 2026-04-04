import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { SearchPageParams } from "@/lib/search-url";
import { SEARCH_PAGE_SIZE } from "@/lib/search-url";

export async function runProductSearch(
  supabase: SupabaseClient<Database>,
  params: SearchPageParams
) {
  const offset = (params.page - 1) * SEARCH_PAGE_SIZE;

  const [productsRes, countRes] = await Promise.all([
    supabase.rpc("search_products", {
      search_query: params.q,
      category_slug: params.category,
      brand_slugs: params.brandSlugs,
      min_price: params.minPrice,
      max_price: params.maxPrice,
      page_limit: SEARCH_PAGE_SIZE,
      page_offset: offset,
    }),
    supabase.rpc("count_search_products", {
      search_query: params.q,
      category_slug: params.category,
      brand_slugs: params.brandSlugs,
      min_price: params.minPrice,
      max_price: params.maxPrice,
    }),
  ]);

  if (productsRes.error) throw productsRes.error;
  if (countRes.error) throw countRes.error;

  const rawTotal = countRes.data;
  const total =
    typeof rawTotal === "bigint"
      ? Number(rawTotal)
      : typeof rawTotal === "string"
        ? Number.parseInt(rawTotal, 10)
        : Number(rawTotal ?? 0);

  return {
    products: productsRes.data ?? [],
    total: Number.isFinite(total) ? total : 0,
  };
}
