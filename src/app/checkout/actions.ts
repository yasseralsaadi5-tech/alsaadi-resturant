"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/order-number";
import type { CartLine } from "@/store/cart-store";

export type CheckoutInput = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderType: "delivery" | "pickup";
  paymentMethod: "cash_on_delivery" | "local_wallet";
  notes: string;
  lines: CartLine[];
};

export type CheckoutResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  if (input.lines.length === 0) {
    return { ok: false, error: "سلة الطلبات فارغة." };
  }
  if (!input.customerName.trim() || !input.customerPhone.trim()) {
    return { ok: false, error: "الاسم ورقم الهاتف مطلوبان." };
  }

  const supabase = await createClient();
  const orderNumber = generateOrderNumber();
  // Generated here (not read back from the DB) so we never need to SELECT
  // the row we just inserted. Public visitors are intentionally not allowed
  // to read the orders table (only admins can), so relying on Postgres to
  // hand the row back via RETURNING would fail RLS even though the INSERT
  // itself is allowed — this avoids that entirely.
  const orderId = randomUUID();

  const hasUnpriced = input.lines.some((l) => l.price === null);
  const totalAmount = hasUnpriced
    ? null
    : input.lines.reduce((sum, l) => sum + (l.price ?? 0) * l.quantity, 0);

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    order_number: orderNumber,
    customer_name: input.customerName.trim(),
    customer_phone: input.customerPhone.trim(),
    customer_address: input.customerAddress.trim() || null,
    order_type: input.orderType,
    payment_method: input.paymentMethod,
    payment_status: "unpaid",
    status: "جديد",
    notes: input.notes.trim() || null,
    total_amount: totalAmount,
  });

  if (orderError) {
    return { ok: false, error: "تعذر إنشاء الطلب. حاول مرة أخرى." };
  }

  const orderItemsPayload = input.lines.map((l) => ({
    order_id: orderId,
    menu_item_id: l.menuItemId,
    item_name: l.name,
    unit_price: l.price,
    quantity: l.quantity,
    line_total: l.price !== null ? l.price * l.quantity : null,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);

  if (itemsError) {
    return { ok: false, error: "تعذر حفظ أصناف الطلب. حاول مرة أخرى." };
  }

  return { ok: true, orderNumber };
}
