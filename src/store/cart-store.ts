import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  menuItemId: string;
  name: string;
  price: number | null; // null = price not yet set by the restaurant
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  addItem: (item: Omit<CartLine, "quantity">) => void;
  increment: (menuItemId: string) => void;
  decrement: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  clear: () => void;
  totalItems: () => number;
  // Returns null if ANY line has no confirmed price yet — we never show
  // a misleading partial total in that case, per the project rules.
  totalAmount: () => number | null;
  hasUnpricedItems: () => boolean;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.lines.find((l) => l.menuItemId === item.menuItemId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.menuItemId === item.menuItemId ? { ...l, quantity: l.quantity + 1 } : l
              ),
            };
          }
          return { lines: [...state.lines, { ...item, quantity: 1 }] };
        });
      },

      increment: (menuItemId) => {
        set((state) => ({
          lines: state.lines.map((l) =>
            l.menuItemId === menuItemId ? { ...l, quantity: l.quantity + 1 } : l
          ),
        }));
      },

      decrement: (menuItemId) => {
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.menuItemId === menuItemId ? { ...l, quantity: l.quantity - 1 } : l
            )
            .filter((l) => l.quantity > 0),
        }));
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          lines: state.lines.filter((l) => l.menuItemId !== menuItemId),
        }));
      },

      clear: () => set({ lines: [] }),

      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),

      hasUnpricedItems: () => get().lines.some((l) => l.price === null),

      totalAmount: () => {
        const lines = get().lines;
        if (lines.some((l) => l.price === null)) return null;
        return lines.reduce((sum, l) => sum + (l.price ?? 0) * l.quantity, 0);
      },
    }),
    { name: "al-saadi-cart", skipHydration: true }
  )
);
