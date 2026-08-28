"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteButton({
  table,
  id,
  confirmMessage,
}: {
  table: "categories" | "menu_items";
  id: string;
  confirmMessage: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(confirmMessage)) return;
    setDeleting(true);
    const { error } = await supabase.from(table).delete().eq("id", id);
    setDeleting(false);
    if (error) {
      alert("تعذر الحذف. تأكد أنه لا توجد أصناف مرتبطة بهذا التصنيف.");
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm font-bold text-brand-red hover:underline disabled:opacity-50"
    >
      {deleting ? "جارٍ الحذف..." : "حذف"}
    </button>
  );
}
