"use client";

import Image from "next/image";
import { useState } from "react";
import type { MenuItem } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { MissingImageState } from "./missing-image-state";

export function FoodCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem({ menuItemId: item.id, name: item.name, price: item.price });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-light/40 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-stone/20 dark:bg-charcoal-soft">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <MissingImageState />
        )}

        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/60">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-charcoal">
              غير متوفر حالياً
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-xl leading-none text-charcoal dark:text-cream">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-sm text-stone dark:text-stone-light">{item.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span
            className={
              item.price !== null
                ? "font-mono text-lg font-bold text-brand-red dark:text-brand-red-light"
                : "text-sm font-medium text-stone dark:text-stone-light"
            }
          >
            {item.price !== null ? `${item.price.toLocaleString("ar-SY")} ل.س` : "السعر يحدد لاحقاً"}
          </span>

          <button
            onClick={handleAdd}
            disabled={!item.is_available}
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:bg-stone-light disabled:text-stone"
          >
            {justAdded ? "أُضيف ✓" : "أضف إلى السلة"}
          </button>
        </div>
      </div>
    </article>
  );
}
