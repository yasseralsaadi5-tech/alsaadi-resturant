"use client";

import { useState } from "react";
import type { Category, MenuItem } from "@/lib/types";
import { FoodCard } from "./food-card";

export function MenuSection({
  categories,
  items,
}: {
  categories: Category[];
  items: MenuItem[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? "");

  const visibleItems = items.filter((item) => item.category_id === activeCategory);

  return (
    <section id="menu" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <span className="font-display text-brand-red">المنيو</span>
        <h2 className="mt-2 font-display text-3xl text-charcoal dark:text-cream">
          تصفح أصنافنا
        </h2>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-stone dark:text-stone-light">
          لم تتم إضافة أصناف بعد. تابعونا قريباً.
        </p>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative rounded-full border px-5 py-2 font-bold transition ${
                  activeCategory === cat.id
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-stone-light/50 text-charcoal hover:border-brand-red hover:text-brand-red dark:text-cream"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {visibleItems.length === 0 ? (
            <p className="text-center text-stone dark:text-stone-light">
              لا توجد أصناف متاحة في هذا التصنيف حالياً.
            </p>
          ) : (
            <div className="grid animate-slide-up grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
