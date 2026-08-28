import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./cart-store";

export type LastOrderSummary = {
  orderNumber: string;
  lines: CartLine[];
  totalAmount: number | null;
  orderType: "delivery" | "pickup";
  paymentMethod: "cash_on_delivery" | "local_wallet";
  status: string;
  customerAddress: string | null;
};

type LastOrderState = {
  lastOrder: LastOrderSummary | null;
  setLastOrder: (order: LastOrderSummary) => void;
};

// Stores only the customer's own most recent order, in their own browser —
// never fetched from the server, so it can't be used to read anyone else's order.
export const useLastOrderStore = create<LastOrderState>()(
  persist(
    (set) => ({
      lastOrder: null,
      setLastOrder: (order) => set({ lastOrder: order }),
    }),
    { name: "al-saadi-last-order", skipHydration: true }
  )
);
