import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";
import { ClearCartOnConfirm } from "@/components/quote/clear-cart-on-confirm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tables } from "@/types/database";

type PageProps = { searchParams: Promise<{ ref?: string }> };

function formatMx(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

type QuoteWithItems = Tables<"quotes"> & {
  quote_items: Tables<"quote_items">[];
};

export default async function ConfirmacionPage({ searchParams }: PageProps) {
  const { ref } = await searchParams;
  const code = ref?.trim() ?? "";

  if (!code) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Folio no encontrado</h1>
        <p className="mt-2 text-muted-foreground">
          Falta el parametro de referencia en la URL.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-6 inline-flex")}
        >
          Ir al inicio
        </Link>
      </div>
    );
  }

  let quote: QuoteWithItems | null = null;
  let configError = false;

  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("quotes")
      .select("*, quote_items(*)")
      .eq("reference_code", code)
      .maybeSingle();

    if (error) {
      console.error("confirmacion fetch:", error);
    } else if (data && "quote_items" in data) {
      const row = data as QuoteWithItems;
      if (Array.isArray(row.quote_items)) {
        quote = row;
      }
    }
  } catch {
    configError = true;
  }

  if (configError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Configuracion incompleta</h1>
        <p className="mt-2 text-muted-foreground">
          En el servidor falta{" "}
          <code className="rounded bg-muted px-1 text-sm">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          para mostrar el detalle de la cotizacion.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Tu folio registrado: <strong>{code}</strong>
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-6 inline-flex")}
        >
          Ir al inicio
        </Link>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Cotizacion no encontrada</h1>
        <p className="mt-2 text-muted-foreground">
          No hay una cotizacion con el folio indicado.
        </p>
        <Link
          href="/cotizacion"
          className={cn(buttonVariants({ variant: "outline" }), "mt-6 inline-flex")}
        >
          Nueva cotizacion
        </Link>
      </div>
    );
  }

  const items = [...quote.quote_items].sort((a, b) =>
    a.product_name.localeCompare(b.product_name, "es")
  );
  const total = items.reduce(
    (acc, it) => acc + Number(it.unit_price) * it.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <ClearCartOnConfirm />
      <h1 className="text-3xl font-bold tracking-tight">
        Cotizacion recibida
      </h1>
      <p className="mt-2 text-muted-foreground">
        Guarda tu folio para cualquier seguimiento.
      </p>
      <p className="mt-6 rounded-lg border bg-muted/40 px-4 py-3 font-mono text-lg font-semibold tracking-wide">
        {quote.reference_code}
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Resumen</h2>
        <ul className="mt-4 divide-y rounded-lg border">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm"
            >
              <span>
                {it.product_name}{" "}
                <span className="text-muted-foreground">
                  × {it.quantity}
                </span>
              </span>
              <span className="font-medium">
                {formatMx(Number(it.unit_price) * it.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-right text-lg font-semibold">
          Total estimado: {formatMx(total)}
        </p>
      </section>

      <section className="mt-10 text-sm text-muted-foreground">
        <p>
          Estado: <span className="text-foreground">{quote.status}</span>
        </p>
        {quote.customer_name ? (
          <p className="mt-1">Cliente: {quote.customer_name}</p>
        ) : null}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/buscar"
          className={cn(buttonVariants({ variant: "default" }), "inline-flex")}
        >
          Seguir comprando
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
        >
          Inicio
        </Link>
      </div>
    </div>
  );
}
