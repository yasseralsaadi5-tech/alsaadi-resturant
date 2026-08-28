"use client";

import { useState } from "react";
import type { Category, MenuItem } from "@/lib/types";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { ImageUploader } from "@/components/admin/image-uploader";
import { DeleteButton } from "@/components/admin/delete-button";

export function MenuItemRow({
  item,
  categories,
}: {
  item: MenuItem;
  categories: Category[];
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-2xl border border-stone-light/40 bg-white p-4 dark:border-stone/20 dark:bg-charcoal-soft">
      {editing ? (
        <MenuItemForm categories={categories} item={item} onDone={() => setEditing(false)} />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ImageUploader
              menuItemId={item.id}
              currentImageUrl={item.image_url}
              currentImagePath={item.image_path}
            />
            <div>
              <p className="font-bold text-charcoal dark:text-cream">
                {item.name}{" "}
                {!item.is_available && (
                  <span className="text-xs font-normal text-brand-red">(غير متوفر)</span>
                )}
              </p>
              <p className="font-mono text-sm text-stone dark:text-stone-light">
                {item.price !== null ? `${item.price.toLocaleString("ar-SY")} ل.س` : "السعر يحدد لاحقاً"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditing(true)}
              className="text-sm font-bold text-charcoal hover:text-brand-red dark:text-cream"
            >
              تعديل
            </button>
            <DeleteButton
              table="menu_items"
              id={item.id}
              confirmMessage={`هل أنت متأكد من حذف "${item.name}"؟`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
