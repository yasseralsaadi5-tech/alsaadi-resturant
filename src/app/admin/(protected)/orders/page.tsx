

import { createClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";

export const revalidate = 0;

const paymentLabels: Record<string, string> = {
  cash_on_delivery: "الدفع عند الاستلام",
  local_wallet: "محفظة محلية",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: allItems } = await supabase.from("order_items").select("*");

  const itemsByOrder = new Map<string, OrderItem[]>();
  (allItems as OrderItem[] | null)?.forEach((item) => {
    const list = itemsByOrder.get(item.order_id) ?? [];
    list.push(item);
    itemsByOrder.set(item.order_id, list);
  });

  const typedOrders = (orders as Order[] | null) ?? [];

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-brand-red">الطلبات</h1>

      {typedOrders.length === 0 ? (
        <p className="text-stone dark:text-stone-light">لا توجد طلبات بعد.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {typedOrders.map((order) => {
            const items = itemsByOrder.get(order.id) ?? [];
            return (
              <div
                key={order.id}
                className="rounded-2xl border border-stone-light/40 bg-white p-4 dark:border-stone/20 dark:bg-charcoal-soft"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono font-bold text-charcoal dark:text-cream" dir="ltr">
                      {order.order_number}
                    </p>
                    <p className="text-xs text-stone dark:text-stone-light">
                      {new Date(order.created_at).toLocaleString("ar-SY")}
                    </p>
                  </div>
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status as OrderStatus} />
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <span className="font-bold">الاسم: </span>
                    {order.customer_name}
                  </p>
                  <p dir="ltr">
                    <span className="font-bold">الهاتف: </span>
                    {order.customer_phone}
                  </p>
                  {order.customer_address && (
                    <p className="sm:col-span-2">
                      <span className="font-bold">العنوان: </span>
                      {order.customer_address}
                    </p>
                  )}
                  <p>
                    <span className="font-bold">طريقة الدفع: </span>
                    {paymentLabels[order.payment_method] ?? order.payment_method}
                  </p>
                  <p>
                    <span className="font-bold">نوع الطلب: </span>
                    {order.order_type === "delivery" ? "توصيل" : "استلام من المطعم"}
                  </p>
                  {order.notes && (
                    <p className="sm:col-span-2">
                      <span className="font-bold">ملاحظات: </span>
                      {order.notes}
                    </p>
                  )}
                </div>

                <ul className="mt-3 flex flex-col gap-1 border-t border-stone-light/40 pt-3 text-sm dark:border-stone/20">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.item_name} × {item.quantity}
                      </span>
                      <span className="font-mono">
                        {item.line_total !== null
                          ? `${item.line_total.toLocaleString("ar-SY")} ل.س`
                          : "يحدد لاحقاً"}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-2 flex justify-between border-t border-stone-light/40 pt-2 font-bold dark:border-stone/20">
                  <span>الإجمالي</span>
                  <span className="font-mono text-brand-red">
                    {order.total_amount !== null
                      ? `${order.total_amount.toLocaleString("ar-SY")} ل.س`
                      : "غير محدد بعد"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
