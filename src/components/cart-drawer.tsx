"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, increment, decrement, removeItem, totalAmount, hasUnpricedItems } =
    useCartStore();

  const total = totalAmount();

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-charcoal/50 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-label="سلة الطلبات"
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 dark:bg-charcoal ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-light/40 p-4 dark:border-stone/20">
          <h2 className="font-display text-2xl text-brand-red">سلة الطلبات</h2>
          <button
            onClick={onClose}
            aria-label="إغلاق السلة"
            className="text-2xl leading-none text-stone hover:text-brand-red"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {lines.length === 0 ? (
            <p className="mt-10 text-center text-stone dark:text-stone-light">
              سلتك فارغة حالياً. تصفح المنيو وأضف ما تشتهيه.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {lines.map((line) => (
                <li
                  key={line.menuItemId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-stone-light/40 p-3 dark:border-stone/20"
                >
                  <div className="flex-1">
                    <p className="font-bold text-charcoal dark:text-cream">{line.name}</p>
                    <p className="font-mono text-sm text-stone dark:text-stone-light">
                      {line.price !== null ? `${line.price.toLocaleString("ar-SY")} ل.س` : "السعر يحدد لاحقاً"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrement(line.menuItemId)}
                      aria-label="إنقاص الكمية"
                      className="h-7 w-7 rounded-full border border-stone-light text-lg leading-none hover:border-brand-red hover:text-brand-red"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-mono">{line.quantity}</span>
                    <button
                      onClick={() => increment(line.menuItemId)}
                      aria-label="زيادة الكمية"
                      className="h-7 w-7 rounded-full border border-stone-light text-lg leading-none hover:border-brand-red hover:text-brand-red"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(line.menuItemId)}
                    aria-label={`إزالة ${line.name}`}
                    className="text-stone hover:text-brand-red"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-stone-light/40 p-4 dark:border-stone/20">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold text-charcoal dark:text-cream">الإجمالي</span>
              <span className="font-mono text-lg font-bold text-brand-red dark:text-brand-red-light">
                {total !== null ? `${total.toLocaleString("ar-SY")} ل.س` : "يُحدد عند التأكيد"}
              </span>
            </div>
            {hasUnpricedItems() && (
              <p className="mb-3 text-xs text-stone dark:text-stone-light">
                تحتوي سلتك على أصناف لم يُحدد سعرها بعد. سيتواصل معك المطعم لتأكيد السعر النهائي.
              </p>
            )}
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-full bg-brand-red py-3 text-center font-bold text-white transition hover:bg-brand-red-dark"
            >
              إتمام الطلب
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
