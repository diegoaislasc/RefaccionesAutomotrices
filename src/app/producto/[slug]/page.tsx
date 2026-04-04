import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CompatibilityTable } from "@/components/product/compatibility-table";
import { AddToQuoteButton } from "@/components/quote/add-to-quote-button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Json } from "@/types/database";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return { title: "Producto" };
  return { title: `${data.name} | Refacciones` };
}

function formatMx(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function specsEntries(specs: Json | null): [string, string][] {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return [];
  return Object.entries(specs as Record<string, Json>)
    .filter(([, v]) => v != null)
    .map(([k, v]) => [k, String(v)]);
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !product) notFound();

  const imageUrl = product.images?.[0] ?? null;

  const [{ data: brand }, { data: category }, { data: compatRows }] =
    await Promise.all([
      product.brand_id
        ? supabase
            .from("brands")
            .select("name, slug")
            .eq("id", product.brand_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      product.category_id
        ? supabase
            .from("categories")
            .select("name, slug")
            .eq("id", product.category_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("vehicle_compatibilities")
        .select("*")
        .eq("product_id", product.id)
        .order("make"),
    ]);

  const compat = compatRows ?? [];
  const specsRows = specsEntries(product.specs);

  const waText = encodeURIComponent(
    `Hola, me interesa: ${product.name} (${product.sku ?? product.slug})`
  );
  const waHref = `https://wa.me/521XXXXXXXXXX?text=${waText}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href="/buscar" className="hover:text-foreground">
          Catalogo
        </Link>
        {category ? (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/buscar?category=${category.slug}`}
              className="hover:text-foreground"
            >
              {category.name}
            </Link>
          </>
        ) : null}
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Sin imagen
              </div>
            )}
          </div>
        </div>

        <div>
          {brand ? (
            <Badge variant="secondary" className="mb-2">
              {brand.name}
            </Badge>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            {product.part_number ? (
              <p>No. parte: {product.part_number}</p>
            ) : null}
            {product.sku ? <p>SKU: {product.sku}</p> : null}
          </div>
          <p className="mt-6 text-3xl font-semibold">{formatMx(product.price)}</p>
          {product.stock != null && product.stock > 0 ? (
            <p className="mt-2 text-sm font-medium text-green-700">
              En existencia
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Consultar disponibilidad
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToQuoteButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              imageUrl={imageUrl}
              className="justify-center text-center sm:flex-1"
            />
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "justify-center border-green-600 bg-green-600 text-white hover:bg-green-700 sm:flex-1"
              )}
            >
              WhatsApp
            </a>
          </div>

          {product.description ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Descripcion</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {specsRows.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">Especificaciones</h2>
          <div className="mt-4 overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <tbody>
                {specsRows.map(([key, val]) => (
                  <tr key={key} className="border-t">
                    <th className="w-1/3 px-3 py-2 text-left font-medium text-muted-foreground">
                      {key}
                    </th>
                    <td className="px-3 py-2">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Compatibilidad</h2>
        <div className="mt-4">
          <CompatibilityTable rows={compat} />
        </div>
      </section>
    </div>
  );
}
