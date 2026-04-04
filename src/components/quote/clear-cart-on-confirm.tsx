"use client";

import { useEffect, useRef } from "react";
import { useQuoteCartStore } from "@/stores/quote-cart-store";

/** Vacia el carrito al mostrar la pagina de confirmacion (tras redirect del server action). */
export function ClearCartOnConfirm() {
  const clear = useQuoteCartStore((s) => s.clear);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    clear();
  }, [clear]);

  return null;
}
