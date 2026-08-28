import { createClient } from "@/lib/supabase/server";
import { CategoryForm } from "@/components/admin/category-form";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Category } from "@/lib/types";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  const typedCategories = (categories as Category[] | null) ?? [];

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-brand-red">التصنيفات</h1>

      <div className="mb-6 rounded-2xl border border-stone-light/40 bg-white p-4 dark:border-stone/20 dark:bg-charcoal-soft">
        <h2 className="mb-3 font-bold text-charcoal dark:text-cream">إضافة تصنيف جديد</h2>
        <CategoryForm />
      </div>

      <div className="flex flex-col gap-3">
        {typedCategories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col gap-3 rounded-2xl border border-stone-light/40 bg-white p-4 dark:border-stone/20 dark:bg-charcoal-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <CategoryForm category={cat} />
            <DeleteButton
              table="categories"
              id={cat.id}
              confirmMessage={`هل أنت متأكد من حذف تصنيف "${cat.name}"؟`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
