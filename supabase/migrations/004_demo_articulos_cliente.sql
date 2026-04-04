-- ============================================
-- MIGRATION: 004_demo_articulos_cliente
-- 200 productos de muestra (articulo1..articulo200) para vista previa
-- Idempotente: borra solo SKUs DEMO-ART-* y vuelve a insertar.
-- ============================================

DELETE FROM products WHERE sku LIKE 'DEMO-ART-%';

INSERT INTO products (
  name,
  slug,
  sku,
  price,
  category_id,
  brand_id,
  is_active,
  stock,
  description
)
SELECT
  'articulo' || n::text,
  'demo-articulo-' || lpad(n::text, 3, '0'),
  'DEMO-ART-' || lpad(n::text, 4, '0'),
  (99 + (n * 97) % 12000)::numeric(10, 2),
  cat.id,
  br.id,
  true,
  (n % 50) + 1,
  'Producto de demostracion para presentacion al cliente.'
FROM generate_series(1, 200) AS t(n)
CROSS JOIN LATERAL (
  SELECT id
  FROM categories
  ORDER BY sort_order NULLS LAST, name
  LIMIT 1
  OFFSET ((n - 1) % GREATEST((SELECT COUNT(*)::int FROM categories), 1))
) cat
CROSS JOIN LATERAL (
  SELECT id
  FROM brands
  ORDER BY name
  LIMIT 1
  OFFSET ((n - 1) % GREATEST((SELECT COUNT(*)::int FROM brands), 1))
) br;
