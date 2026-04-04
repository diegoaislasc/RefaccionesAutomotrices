"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuoteCartStore, selectCartItemCount } from "@/stores/quote-cart-store";

export function HeaderQuoteLink() {
  const count = useQuoteCartStore(selectCartItemCount);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useQuoteCartStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useQuoteCartStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return (
    <Link
      href="/cotizacion"
      className="text-muted-foreground hover:text-foreground relative inline-flex items-center gap-1.5 transition-colors"
    >
      Cotizacion
      {hydrated && count > 0 ? (
        <span className="bg-red-600 text-white flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
