import Link from "next/link";
import { Wrench, Zap, Gauge, CircuitBoard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SearchBar } from "@/components/search/search-bar";
import { ProductCard } from "@/components/product/product-card";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ReactNode> = {
  frenos: <Gauge className="h-8 w-8" />,
  motor: <Wrench className="h-8 w-8" />,
  suspension: <Zap className="h-8 w-8" />,
  electrico: <CircuitBoard className="h-8 w-8" />,
};

export default async function Home() {
  const supabase = await createClient();
  const [{ data: categories }, { data: demoProducts }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("products")
      .select("*")
      .like("slug", "demo-articulo-%")
      .eq("is_active", true)
      .order("slug", { ascending: true })
      .limit(12),
  ]);

  const demoBrandIds = [
    ...new Set(
      (demoProducts ?? []).map((p) => p.brand_id).filter(Boolean) as string[]
    ),
  ];
  let demoBrandMap = new Map<string, string>();
  if (demoBrandIds.length) {
    const { data: brandRows } = await supabase
      .from("brands")
      .select("id, name")
      .in("id", demoBrandIds);
    demoBrandMap = new Map(brandRows?.map((b) => [b.id, b.name]) ?? []);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-900 to-zinc-900" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Encuentra la refaccion
              <span className="text-red-500"> que necesitas</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400">
              Refacciones automotrices, servicio pesado y maquinaria.
              Cotiza en linea y recibe atencion personalizada.
            </p>

            <div className="mt-8 text-left">
              <SearchBar
                variant="hero"
                className="[&_input]:border-zinc-700 [&_input]:bg-zinc-800 [&_input]:text-white [&_input]:placeholder:text-zinc-500 [&_button]:bg-red-600 [&_button]:hover:bg-red-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">Categorias</h2>
        <p className="mt-1 text-muted-foreground">
          Explora nuestro catalogo por categoria
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories?.map((category) => (
            <Link key={category.id} href={`/buscar?category=${category.slug}`}>
              <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-red-200">
                <CardHeader>
                  <div className="mb-2 text-red-600 transition-transform group-hover:scale-110">
                    {categoryIcons[category.slug] ?? <Wrench className="h-8 w-8" />}
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Vista previa catalogo (datos de muestra) */}
      {demoProducts && demoProducts.length > 0 ? (
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Vista previa del catalogo
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Ejemplo con articulos de demostracion (articulo1, articulo2,
                  …). Asi se vera el listado cuando tengas el inventario real.
                </p>
              </div>
              <Link
                href="/buscar"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "mt-2 shrink-0 sm:mt-0"
                )}
              >
                Ver catalogo en el buscador
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {demoProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  brandName={
                    product.brand_id
                      ? demoBrandMap.get(product.brand_id) ?? null
                      : null
                  }
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="border-t bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">
            No encuentras lo que buscas?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Contactanos por WhatsApp y te ayudamos a encontrar la pieza correcta.
          </p>
          <a
            href="https://wa.me/521XXXXXXXXXX?text=Hola%2C%20busco%20una%20refaccion"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            Escribenos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
