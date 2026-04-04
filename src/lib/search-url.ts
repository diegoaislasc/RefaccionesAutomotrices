export const SEARCH_PAGE_SIZE = 12;

export type SearchPageParams = {
  q: string;
  category: string | null;
  brandSlugs: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  page: number;
};

/**
 * Normaliza query params de /buscar para RPC y paginación.
 */
export function parseSearchPageParams(
  sp: Record<string, string | string[] | undefined>
): SearchPageParams {
  const q = typeof sp.q === "string" ? sp.q : "";

  const category =
    typeof sp.category === "string" && sp.category.trim()
      ? sp.category.trim()
      : null;

  const brandsRaw = sp.brands;
  const brandsJoined = Array.isArray(brandsRaw)
    ? brandsRaw.filter(Boolean).join(",")
    : typeof brandsRaw === "string"
      ? brandsRaw
      : "";
  const uniqueBrands = [
    ...new Set(
      brandsJoined
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  ];
  const brandSlugs = uniqueBrands.length ? uniqueBrands.join(",") : null;

  const minPrice = parseOptionalNumber(sp.min_price);
  const maxPrice = parseOptionalNumber(sp.max_price);

  const pageRaw =
    typeof sp.page === "string" ? Number.parseInt(sp.page, 10) : 1;
  const page =
    Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

  return {
    q,
    category,
    brandSlugs,
    minPrice,
    maxPrice,
    page,
  };
}

function parseOptionalNumber(
  v: string | string[] | undefined
): number | null {
  if (typeof v !== "string" || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
