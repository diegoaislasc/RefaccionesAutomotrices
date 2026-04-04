"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { submitQuote, type SubmitQuoteState } from "@/app/actions/submit-quote";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import {
  useQuoteCartStore,
  selectCartSubtotal,
} from "@/stores/quote-cart-store";
import { cn } from "@/lib/utils";

function formatMx(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function QuoteCartSection() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useQuoteCartStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useQuoteCartStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  const lines = useQuoteCartStore((s) => s.lines);
  const removeLine = useQuoteCartStore((s) => s.removeLine);
  const setQuantity = useQuoteCartStore((s) => s.setQuantity);
  const subtotal = useQuoteCartStore(selectCartSubtotal);

  const itemsJson = useMemo(
    () =>
      JSON.stringify(
        lines.map((l) => ({ productId: l.productId, quantity: l.quantity }))
      ),
    [lines]
  );

  const [state, formAction, pending] = useActionState<
    SubmitQuoteState | null,
    FormData
  >(submitQuote, null);

  if (!hydrated) {
    return (
      <p className="mt-8 text-sm text-muted-foreground">Cargando carrito...</p>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p>Tu cotizacion esta vacia.</p>
        <Link
          href="/buscar"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}
        >
          Ir al catalogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      <ul className="divide-y rounded-lg border">
        {lines.map((line) => (
          <li
            key={line.productId}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                {line.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={line.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/producto/${line.slug}`}
                  className="font-medium hover:underline"
                >
                  {line.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatMx(line.price)} c/u
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:justify-end">
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Cant.</span>
                <Input
                  type="number"
                  min={1}
                  max={999}
                  className="w-20"
                  value={line.quantity}
                  onChange={(e) =>
                    setQuantity(line.productId, Number(e.target.value) || 0)
                  }
                />
              </label>
              <p className="w-28 text-right font-semibold">
                {formatMx(line.quantity * line.price)}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => removeLine(line.productId)}
              >
                Quitar
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-end border-t pt-4">
        <p className="text-lg font-semibold">
          Subtotal estimado: {formatMx(subtotal)}
        </p>
      </div>

      <form action={formAction} className="space-y-4 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Tus datos</h2>
        <input type="hidden" name="items_json" value={itemsJson} readOnly />

        {state && !state.ok ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        ) : null}

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="customer_name">
            Nombre
          </label>
          <Input
            id="customer_name"
            name="customer_name"
            required
            autoComplete="name"
            maxLength={200}
            placeholder="Nombre completo"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="customer_phone">
            Telefono
          </label>
          <Input
            id="customer_phone"
            name="customer_phone"
            required
            type="tel"
            autoComplete="tel"
            placeholder="10 digitos o mas"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="customer_email">
            Correo (opcional)
          </label>
          <Input
            id="customer_email"
            name="customer_email"
            type="email"
            autoComplete="email"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="notes">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={2000}
            className={cn(
              "min-h-[80px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none",
              "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            )}
            placeholder="Vehiculo, urgencia, etc."
          />
        </div>

        <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
          {pending ? "Enviando..." : "Enviar cotizacion"}
        </Button>
      </form>
    </div>
  );
}
