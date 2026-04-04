"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { useQuoteCartStore } from "@/stores/quote-cart-store";

type AddToQuoteButtonProps = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  label?: string;
};

export function AddToQuoteButton({
  productId,
  slug,
  name,
  price,
  imageUrl,
  className,
  variant = "default",
  label = "Agregar a cotizacion",
}: AddToQuoteButtonProps) {
  const addLine = useQuoteCartStore((s) => s.addLine);
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant }), className)}
      onClick={() => {
        addLine({ productId, slug, name, price, imageUrl, quantity: 1 });
        setDone(true);
        window.setTimeout(() => setDone(false), 2000);
      }}
    >
      {done ? "Agregado" : label}
    </button>
  );
}
