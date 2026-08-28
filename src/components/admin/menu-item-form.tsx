"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, MenuItem } from "@/lib/types";

export function MenuItemForm({
  categories,
  item,
  onDone,
}: {
  categories: Category[];
  item?: MenuItem;
  onDone?: () => void;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [categoryId, setCategoryId] = useState(item?.category_id ?? categories[0]?.id ?? "");
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState<string>(item?.price?.toString() ?? "");
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      category_id: categoryId,
      name,
      description: description.trim() || null,
      price: price.trim() === "" ? null : Number(price),
      is_available: isAvailable,
      updated_at: new Date().toISOString(),
    };

    if (item) {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", item.id);
      setSaving(false);
      if (error) return setError("تعذر حفظ التعديلات.");
    } else {
      const { error } = await supabase.from("menu_items").insert(payload);
      setSaving(false);
      if (error) return setError("تعذر إضافة الصنف.");
      setName("");
      setDescription("");
      setPrice("");
    }

    router.refresh();
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-charcoal dark:text-cream">التصنيف</span>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-lg border border-stone-light/40 px-3 py-2"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-charcoal dark:text-cream">اسم الصنف</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-stone-light/40 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 sm:col-span-2">
        <span className="text-sm font-bold text-charcoal dark:text-cream">الوصف (اختياري)</span>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-stone-light/40 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-charcoal dark:text-cream">
          السعر (اتركه فارغاً إذا لم يُحدد بعد)
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="rounded-lg border border-stone-light/40 px-3 py-2"
          dir="ltr"
        />
      </label>

      <label className="flex items-center gap-2 self-end pb-2">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
        <span className="text-sm font-bold text-charcoal dark:text-cream">متوفر حالياً</span>
      </label>

      <div className="sm:col-span-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-red px-5 py-2 font-bold text-white disabled:opacity-60"
        >
          {saving ? "جارٍ الحفظ..." : item ? "حفظ التعديل" : "إضافة الصنف"}
        </button>
        {error && <p className="text-sm font-bold text-brand-red">{error}</p>}
      </div>
    </form>
  );
}
