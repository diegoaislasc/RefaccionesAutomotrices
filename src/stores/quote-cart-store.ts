import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuoteCartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

type QuoteCartState = {
  lines: QuoteCartLine[];
  addLine: (item: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    imageUrl: string | null;
    quantity?: number;
  }) => void;
  removeLine: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useQuoteCartStore = create<QuoteCartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (item) => {
        const qty = item.quantity ?? 1;
        set((s) => {
          const idx = s.lines.findIndex((l) => l.productId === item.productId);
          if (idx >= 0) {
            const next = [...s.lines];
            next[idx] = {
              ...next[idx],
              quantity: next[idx].quantity + qty,
            };
            return { lines: next };
          }
          return {
            lines: [
              ...s.lines,
              {
                productId: item.productId,
                slug: item.slug,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                quantity: qty,
              },
            ],
          };
        });
      },
      removeLine: (productId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.productId !== productId)
              : s.lines.map((l) =>
                  l.productId === productId ? { ...l, quantity } : l
                ),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "refacciones-quote-cart" }
  )
);

export function selectCartItemCount(state: QuoteCartState): number {
  return state.lines.reduce((acc, l) => acc + l.quantity, 0);
}

export function selectCartSubtotal(state: QuoteCartState): number {
  return state.lines.reduce((acc, l) => acc + l.quantity * l.price, 0);
}
