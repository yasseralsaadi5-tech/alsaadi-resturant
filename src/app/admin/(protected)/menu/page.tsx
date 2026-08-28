"use client";
import { createClient } from "@/lib/supabase/server";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { MenuItemRow } from "@/components/admin/menu-item-row";
import type { Category, MenuItem } from "@/lib/types";

export const revalidate = 0;

export default async function AdminMenuPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").order("sort_order"),
  ]);

  const typedCategories = (categories as Category[] | null) ?? [];
  const typedItems = (items as MenuItem[] | null) ?? [];

  if (typedCategories.length === 0) {
    return (
      <div>
        <h1 className="mb-4 font-display text-3xl text-brand-red">الأصناف</h1>
        <p className="text-stone dark:text-stone-light">
          أضف تصنيفاً واحداً على الأقل من صفحة التصنيفات قبل إضافة الأصناف.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-brand-red">الأصناف</h1>

      <div className="mb-8 rounded-2xl border border-stone-light/40 bg-white p-4 dark:border-stone/20 dark:bg-charcoal-soft">
        <h2 className="mb-3 font-bold text-charcoal dark:text-cream">إضافة صنف جديد</h2>
        <MenuItemForm categories={typedCategories} />
      </div>

      {typedCategories.map((cat) => {
        const catItems = typedItems.filter((i) => i.category_id === cat.id);
        if (catItems.length === 0) return null;
        return (
          <div key={cat.id} className="mb-8">
            <h2 className="mb-3 font-display text-xl text-charcoal dark:text-cream">
              {cat.name}
            </h2>
            <div className="flex flex-col gap-3">
              {catItems.map((item) => (
                <MenuItemRow key={item.id} item={item} categories={typedCategories} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
