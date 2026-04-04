-- ============================================
-- MIGRATION: 005_product_placeholder_images
-- Asigna URL ficticia estable (Picsum por md5(slug)) a productos sin imagen.
-- Coincide visualmente con getProductImageUrl solo si slug es el mismo criterio;
-- en la app, las filas con images[] siguen usando esa URL desde BD.
-- ============================================

UPDATE products
SET images = ARRAY[
  'https://picsum.photos/seed/ra-' || md5(slug::text) || '/600/600'
]::text[]
WHERE
  images IS NULL
  OR array_length(images, 1) IS NULL
  OR trim(both FROM images[1]) = '';
