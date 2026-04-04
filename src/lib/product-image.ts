import { createHash } from "node:crypto";

/**
 * Imagen de catálogo: usa la primera URL de `images` si existe;
 * si no, una foto ficticia estable por `slug` (misma pieza = misma imagen).
 * La semilla coincide con `005_product_placeholder_images.sql` (md5 del slug).
 */
export function getProductImageUrl(product: {
  images: string[] | null;
  slug: string;
}): string {
  const first = product.images?.[0]?.trim();
  if (first) return first;
  const seed = slugToPlaceholderSeed(product.slug);
  return `https://picsum.photos/seed/${seed}/600/600`;
}

/** Semilla estable para Picsum; misma lógica que `md5(slug)` en Postgres. */
export function slugToPlaceholderSeed(slug: string): string {
  return `ra-${createHash("md5").update(slug, "utf8").digest("hex")}`;
}
