import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  Headphones,
  Truck,
  Wrench,
  Zap,
  Gauge,
  CircuitBoard,
  Package,
  Clock,
} from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { ProductCard } from "@/components/product/product-card";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { whatsAppMessageHref } from "@/lib/site";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD8XWRAYLxFxHOmSmesoYb3v75NhQNc8LqPcapn2dLz_kkEYtF6kHn4HU0WNKBnsHQM97ZFRgKXUdjpg6Gg7PbPlJVzucTuJ_VQe1BHZgK30OvF9hhfeYvicv0XO7XWE2b4yRQdXyzDLql4XTW5kahi_L-Xs-lnkQxGRg0zTUwNy5uK1WlLElu_Q7Qt07d-ZDJ12eQTcQvjmBP3UAkg02CD8h7GWK2H86VlIQwVTjsbfcvPvGLvvnAKSZsfcmpMAVZqQyV_3c_-KmQj";

const categoryIcons: Record<string, React.ReactNode> = {
  frenos: <Gauge className="h-7 w-7" />,
  motor: <Wrench className="h-7 w-7" />,
  suspension: <Zap className="h-7 w-7" />,
  electrico: <CircuitBoard className="h-7 w-7" />,
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

  const waCta = whatsAppMessageHref(
    "Hola, busco una refacción y no la encontré en el catálogo."
  );

  return (
    <>
      <section className="relative flex min-h-[min(870px,100svh)] items-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt="Motor diesel y taller industrial"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
          <div
            className="blueprint-grid-dots absolute inset-0 opacity-20"
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl lg:leading-tight">
              Refacciones que mantienen tu flota en movimiento.
            </h1>
            <p className="mb-10 text-xl font-normal text-zinc-400 md:text-2xl">
              Servicio especializado para maquinaria pesada y automotriz.
              Precisión garantizada.
            </p>

            <div className="max-w-2xl rounded-xl border border-white/5 bg-white/10 p-2 backdrop-blur-md">
              <SearchBar variant="landing" />
            </div>

            <Link
              href="/buscar"
              className="group mt-6 inline-flex items-center gap-2 font-semibold text-zinc-300 transition-colors hover:text-[#da3437]"
            >
              Ver catálogo completo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900 py-6" aria-label="Ventajas">
        <div className="mx-auto max-w-screen-2xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-max items-center justify-between gap-6 text-xs font-bold tracking-widest text-zinc-400 uppercase sm:gap-8 sm:text-sm">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 shrink-0 text-[#b61722]" />
              Envío nacional
            </div>
            <div className="h-4 w-px shrink-0 bg-zinc-800" />
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-[#b61722]" />
              Cotización en línea
            </div>
            <div className="h-4 w-px shrink-0 bg-zinc-800" />
            <div className="flex items-center gap-3">
              <Headphones className="h-5 w-5 shrink-0 text-[#b61722]" />
              Soporte especializado
            </div>
            <div className="h-4 w-px shrink-0 bg-zinc-800" />
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 shrink-0 text-[#b61722]" />
              Garantía de fábrica
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbf8fc] py-16 md:py-24">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#b61722] uppercase">
              Sistemas principales
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#1b1b1e] md:text-4xl lg:text-5xl">
              Explora por categoría
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/buscar?category=${category.slug}`}
                className="group block rounded-xl bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-[#fbf8fc] hover:shadow-md"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e4e1e6] text-zinc-900 transition-colors group-hover:bg-[#b61722] group-hover:text-white">
                  {categoryIcons[category.slug] ?? (
                    <Wrench className="h-7 w-7" />
                  )}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-[#1b1b1e]">
                  {category.name}
                </h3>
                <p className="mb-6 leading-relaxed text-[#5b403e]">
                  {category.description}
                </p>
                <div className="h-1 w-0 bg-[#b61722] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {demoProducts && demoProducts.length > 0 ? (
        <section className="border-t border-zinc-200/80 bg-[#f6f2f7]/80">
          <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1b1b1e] md:text-3xl">
                  Vista previa del catálogo
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-[#5b403e]">
                  Ejemplo con artículos de demostración. Así se verá el listado
                  cuando tengas el inventario real.
                </p>
              </div>
              <Link
                href="/buscar"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "mt-2 shrink-0 bg-[#b61722] hover:bg-[#da3437] sm:mt-0"
                )}
              >
                Ver en el buscador
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {demoProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  brandName={
                    product.brand_id
                      ? (demoBrandMap.get(product.brand_id) ?? null)
                      : null
                  }
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden bg-[#f6f2f7] py-16 md:py-24">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            <div className="flex-1 lg:pr-12">
              <h2 className="mb-8 text-3xl font-black tracking-tighter text-[#1b1b1e] md:text-4xl lg:text-5xl lg:leading-tight">
                Inventario confiable para servicio pesado y automotriz.
              </h2>
              <p className="text-lg leading-relaxed text-[#5b403e] md:text-xl">
                Nos enfocamos en la{" "}
                <span className="font-bold text-[#b61722]">
                  precisión técnica
                </span>{" "}
                de cada componente. Entendemos que cada minuto que su
                maquinaria está detenida representa una pérdida. Por ello,
                priorizamos disponibilidad y calidad certificada.
              </p>
            </div>
            <div className="relative w-full flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex aspect-square flex-col justify-between rounded-xl bg-zinc-900 p-6 shadow-xl md:p-8">
                  <Package className="h-9 w-9 text-[#b61722] md:h-11 md:w-11" />
                  <div>
                    <div className="text-4xl font-black tracking-tighter text-white md:text-5xl">
                      +10k
                    </div>
                    <div className="mt-2 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      Referencias
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex aspect-square flex-col justify-between rounded-xl bg-[#e4e1e6] p-6 md:mt-8 md:p-8">
                  <Clock className="h-9 w-9 text-zinc-900 md:h-11 md:w-11" />
                  <div>
                    <div className="text-4xl font-black tracking-tighter text-zinc-900 md:text-5xl">
                      24h
                    </div>
                    <div className="mt-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                      Respuesta
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="blueprint-grid-dots absolute -right-12 -bottom-12 -z-10 h-64 w-64 opacity-30"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t-2 border-[#b61722] bg-zinc-950 py-16 md:py-20">
        <div className="absolute top-0 right-0 h-full w-1/3 -skew-x-12 translate-x-1/2 bg-[#b61722]/5" />
        <div className="relative z-10 mx-auto flex max-w-screen-2xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-white md:text-4xl lg:text-5xl">
            ¿No encuentras la pieza?
          </h2>
          <a
            href={waCta}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#128C7E] active:scale-95 md:px-10 md:py-5 md:text-lg"
          >
            <svg
              className="h-7 w-7 fill-current"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.653a11.883 11.883 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Escríbenos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
