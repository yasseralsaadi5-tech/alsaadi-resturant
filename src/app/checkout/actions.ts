"use server";

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

  const hasUnpriced = input.lines.some((l) => l.price === null);
  const totalAmount = hasUnpriced
    ? null
    : input.lines.reduce((sum, l) => sum + (l.price ?? 0) * l.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
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
    })
    .select()
    .single();

  if (orderError || !order) {
    return { ok: false, error: "تعذر إنشاء الطلب. حاول مرة أخرى." };
  }

  const orderItemsPayload = input.lines.map((l) => ({
    order_id: order.id,
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
