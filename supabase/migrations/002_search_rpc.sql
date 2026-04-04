-- ============================================
-- MIGRATION: 002_search_rpc
-- Full-text search + filtros via RPC (PostgREST)
-- ============================================

-- search_query vacío = listar todos los activos (con filtros opcionales)
CREATE OR REPLACE FUNCTION search_products(
  search_query text DEFAULT '',
  category_slug text DEFAULT NULL,
  brand_slugs text DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL,
  page_limit int DEFAULT 12,
  page_offset int DEFAULT 0
)
RETURNS SETOF products
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT p.*
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN brands b ON b.id = p.brand_id
  WHERE p.is_active = true
    AND (
      NULLIF(trim(search_query), '') IS NULL
      OR p.search_vector @@ plainto_tsquery(
        'spanish',
        unaccent(trim(search_query))
      )
    )
    AND (category_slug IS NULL OR c.slug = category_slug)
    AND (
      NULLIF(trim(brand_slugs), '') IS NULL
      OR b.slug IN (
        SELECT trim(regexp_split_to_table)
        FROM regexp_split_to_table(brand_slugs, ',')
      )
    )
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
  ORDER BY
    CASE
      WHEN NULLIF(trim(search_query), '') IS NULL THEN 0
      ELSE ts_rank_cd(
        p.search_vector,
        plainto_tsquery('spanish', unaccent(trim(search_query)))
      )
    END DESC,
    p.created_at DESC
  LIMIT greatest(page_limit, 1)
  OFFSET greatest(page_offset, 0);
$$;

CREATE OR REPLACE FUNCTION count_search_products(
  search_query text DEFAULT '',
  category_slug text DEFAULT NULL,
  brand_slugs text DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL
)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT count(*)::bigint
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN brands b ON b.id = p.brand_id
  WHERE p.is_active = true
    AND (
      NULLIF(trim(search_query), '') IS NULL
      OR p.search_vector @@ plainto_tsquery(
        'spanish',
        unaccent(trim(search_query))
      )
    )
    AND (category_slug IS NULL OR c.slug = category_slug)
    AND (
      NULLIF(trim(brand_slugs), '') IS NULL
      OR b.slug IN (
        SELECT trim(regexp_split_to_table)
        FROM regexp_split_to_table(brand_slugs, ',')
      )
    )
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price);
$$;

GRANT EXECUTE ON FUNCTION search_products(
  text, text, text, numeric, numeric, integer, integer
) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION count_search_products(
  text, text, text, numeric, numeric
) TO anon, authenticated;
