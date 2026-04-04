"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuoteCartStore, selectCartItemCount } from "@/stores/quote-cart-store";
import { cn } from "@/lib/utils";

type HeaderQuoteLinkProps = {
  variant?: "link" | "button";
  className?: string;
};

export function HeaderQuoteLink({
  variant = "link",
  className,
}: HeaderQuoteLinkProps) {
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
      className={cn(
        "relative inline-flex items-center gap-1.5 transition-colors",
        variant === "link" &&
          "text-muted-foreground hover:text-foreground",
        variant === "button" &&
          "rounded-xl border-0 bg-[#b61722] px-5 py-2 text-sm font-bold text-white hover:bg-[#da3437] active:scale-[0.98]",
        className
      )}
    >
      Cotizar
      {hydrated && count > 0 ? (
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none",
            variant === "link" && "bg-red-600 text-white",
            variant === "button" &&
              "bg-white/20 text-white ring-1 ring-white/30"
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
