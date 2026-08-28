"use client";

import { use } from "react";
import Link from "next/link";
import { useLastOrderStore } from "@/store/last-order-store";

const paymentLabels: Record<string, string> = {
  cash_on_delivery: "الدفع عند الاستلام",
  local_wallet: "محفظة محلية",
};

const orderTypeLabels: Record<string, string> = {
  delivery: "توصيل",
  pickup: "استلام من المطعم",
};

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const lastOrder = useLastOrderStore((s) => s.lastOrder);

  const matches = lastOrder?.orderNumber === orderNumber;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center gap-4 px-4 py-16 text-center">
      <span className="text-5xl">✅</span>
      <h1 className="font-display text-3xl text-brand-red">تم استلام طلبك</h1>
      <p className="text-stone dark:text-stone-light">رقم الطلب الخاص بك هو:</p>
      <p className="font-mono text-2xl font-bold text-charcoal dark:text-cream" dir="ltr">
        {orderNumber}
      </p>

      {matches && lastOrder && (
        <div className="mt-4 w-full rounded-2xl border border-stone-light/40 p-4 text-right dark:border-stone/20">
          <h2 className="mb-3 font-bold text-charcoal dark:text-cream">ملخص الطلب</h2>
          <ul className="flex flex-col gap-1 text-sm">
            {lastOrder.lines.map((l) => (
              <li key={l.menuItemId} className="flex justify-between">
                <span>
                  {l.name} × {l.quantity}
                </span>
                <span className="font-mono">
                  {l.price !== null
                    ? `${(l.price * l.quantity).toLocaleString("ar-SY")} ل.س`
                    : "يحدد لاحقاً"}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-stone-light/40 pt-3 font-bold dark:border-stone/20">
            <span>الإجمالي</span>
            <span className="font-mono text-brand-red">
              {lastOrder.totalAmount !== null
                ? `${lastOrder.totalAmount.toLocaleString("ar-SY")} ل.س`
                : "يُحدد عند التأكيد"}
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-1 text-sm text-stone dark:text-stone-light">
            <span>طريقة الاستلام: {orderTypeLabels[lastOrder.orderType]}</span>
            {lastOrder.customerAddress && <span>العنوان: {lastOrder.customerAddress}</span>}
            <span>طريقة الدفع: {paymentLabels[lastOrder.paymentMethod]}</span>
            <span>حالة الطلب: {lastOrder.status}</span>
          </div>
        </div>
      )}

      <p className="mt-2 text-sm text-stone dark:text-stone-light">
        سيتواصل معك المطعم قريباً لتأكيد الطلب. يمكنك أيضاً التواصل مباشرة عبر
        واتساب على <span dir="ltr">0982673401</span> لمتابعة حالة طلبك.
      </p>

      <Link href="/" className="mt-4 rounded-full bg-brand-red px-6 py-3 font-bold text-white">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}
