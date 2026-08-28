"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useLastOrderStore } from "@/store/last-order-store";
import { createOrder } from "./actions";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totalAmount, hasUnpricedItems, clear } = useCartStore();
  const setLastOrder = useLastOrderStore((s) => s.setLastOrder);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod] = useState<"cash_on_delivery">("cash_on_delivery");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = totalAmount();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await createOrder({
      customerName,
      customerPhone,
      customerAddress,
      orderType,
      paymentMethod,
      notes,
      lines,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setLastOrder({
      orderNumber: result.orderNumber,
      lines,
      totalAmount: total,
      orderType,
      paymentMethod,
      status: "جديد",
      customerAddress: orderType === "delivery" ? customerAddress : null,
    });
    clear();
    router.push(`/order-confirmation/${result.orderNumber}`);
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg text-stone dark:text-stone-light">
          سلتك فارغة. أضف بعض الأصناف قبل إتمام الطلب.
        </p>
        <Link href="/" className="rounded-full bg-brand-red px-6 py-3 font-bold text-white">
          العودة إلى المنيو
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-6 font-display text-3xl text-brand-red">إتمام الطلب</h1>

      <div className="mb-6 rounded-2xl border border-stone-light/40 p-4 dark:border-stone/20">
        <h2 className="mb-3 font-bold text-charcoal dark:text-cream">ملخص طلبك</h2>
        <ul className="flex flex-col gap-1 text-sm">
          {lines.map((l) => (
            <li key={l.menuItemId} className="flex justify-between">
              <span>
                {l.name} × {l.quantity}
              </span>
              <span className="font-mono">
                {l.price !== null ? `${(l.price * l.quantity).toLocaleString("ar-SY")} ل.س` : "يحدد لاحقاً"}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-stone-light/40 pt-3 font-bold dark:border-stone/20">
          <span>الإجمالي</span>
          <span className="font-mono text-brand-red">
            {total !== null ? `${total.toLocaleString("ar-SY")} ل.س` : "يُحدد عند التأكيد"}
          </span>
        </div>
        {hasUnpricedItems() && (
          <p className="mt-2 text-xs text-stone dark:text-stone-light">
            بعض الأصناف لم يُحدد سعرها بعد. سيتواصل معك المطعم لتأكيد السعر النهائي قبل التحضير.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="الاسم">
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="input"
            placeholder="اسمك الكامل"
          />
        </Field>

        <Field label="رقم الهاتف">
          <input
            required
            dir="ltr"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="input"
            placeholder="09xxxxxxxx"
          />
        </Field>

        <div>
          <span className="mb-2 block text-sm font-bold text-charcoal dark:text-cream">
            طريقة الاستلام
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOrderType("delivery")}
              className={`flex-1 rounded-xl border py-2 font-bold ${
                orderType === "delivery"
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-stone-light/50 text-charcoal dark:text-cream"
              }`}
            >
              توصيل
            </button>
            <button
              type="button"
              onClick={() => setOrderType("pickup")}
              className={`flex-1 rounded-xl border py-2 font-bold ${
                orderType === "pickup"
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-stone-light/50 text-charcoal dark:text-cream"
              }`}
            >
              استلام من المطعم
            </button>
          </div>
        </div>

        {orderType === "delivery" && (
          <Field label="العنوان">
            <input
              required
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="input"
              placeholder="القرية أو البلدة والحي"
            />
          </Field>
        )}

        <div>
          <span className="mb-2 block text-sm font-bold text-charcoal dark:text-cream">
            طريقة الدفع
          </span>
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl border border-brand-red bg-brand-red py-2 text-center font-bold text-white">
              الدفع عند الاستلام
            </div>
            <div
              className="flex-1 cursor-not-allowed rounded-xl border border-stone-light/50 py-2 text-center font-bold text-stone dark:text-stone-light"
              title="ستُفعّل قريباً بعد تحديد المحفظة المعتمدة"
            >
              محفظة محلية (قريباً)
            </div>
          </div>
        </div>

        <Field label="ملاحظات الطلب (اختياري)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input min-h-20"
            placeholder="مثال: بدون بصل، توصيل بعد الساعة 8"
          />
        </Field>

        {error && <p className="text-sm font-bold text-brand-red">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-brand-red py-3 font-bold text-white transition hover:bg-brand-red-dark disabled:opacity-60"
        >
          {submitting ? "جارٍ إرسال الطلب..." : "تأكيد الطلب"}
        </button>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(138, 128, 120, 0.4);
          padding: 0.65rem 1rem;
          background: transparent;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-bold text-charcoal dark:text-cream">{label}</span>
      {children}
    </label>
  );
}
