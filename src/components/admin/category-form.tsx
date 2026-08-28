"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

function slugify(input: string) {
  return input
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}

export function CategoryForm({ category }: { category?: Category }) {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState(category?.name ?? "");
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (category) {
      const { error } = await supabase
        .from("categories")
        .update({ name, sort_order: sortOrder, updated_at: new Date().toISOString() })
        .eq("id", category.id);
      setSaving(false);
      if (error) return setError("تعذر حفظ التعديلات.");
    } else {
      const { error } = await supabase.from("categories").insert({
        name,
        slug: slugify(name) || `category-${Date.now()}`,
        sort_order: sortOrder,
      });
      setSaving(false);
      if (error) return setError("تعذر إضافة التصنيف.");
      setName("");
      setSortOrder(0);
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-charcoal dark:text-cream">اسم التصنيف</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-stone-light/40 px-3 py-2"
          placeholder="مثال: سندويشات"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-charcoal dark:text-cream">الترتيب</span>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          className="w-20 rounded-lg border border-stone-light/40 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-brand-red px-5 py-2 font-bold text-white disabled:opacity-60"
      >
        {saving ? "جارٍ الحفظ..." : category ? "حفظ التعديل" : "إضافة تصنيف"}
      </button>
      {error && <p className="text-sm font-bold text-brand-red">{error}</p>}
    </form>
  );
}
