"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ImageUploader({
  menuItemId,
  currentImageUrl,
  currentImagePath,
}: {
  menuItemId: string;
  currentImageUrl: string | null;
  currentImagePath: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const path = `${menuItemId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setUploading(false);
      setError("تعذر رفع الصورة.");
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("menu-images").getPublicUrl(path);

    // Update the item first so the UI reflects the new image immediately...
    const { error: updateError } = await supabase
      .from("menu_items")
      .update({
        image_url: publicUrlData.publicUrl,
        image_path: path,
        updated_at: new Date().toISOString(),
      })
      .eq("id", menuItemId);

    // ...then clean up the previous file so orphaned images don't accumulate.
    if (currentImagePath) {
      await supabase.storage.from("menu-images").remove([currentImagePath]);
    }

    setUploading(false);
    if (updateError) {
      setError("تم رفع الصورة لكن تعذر ربطها بالصنف.");
      return;
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  async function handleRemove() {
    if (!confirm("هل تريد إزالة صورة هذا الصنف؟")) return;
    setUploading(true);
    setError(null);

    if (currentImagePath) {
      await supabase.storage.from("menu-images").remove([currentImagePath]);
    }

    const { error: updateError } = await supabase
      .from("menu_items")
      .update({ image_url: null, image_path: null, updated_at: new Date().toISOString() })
      .eq("id", menuItemId);

    setUploading(false);
    if (updateError) {
      setError("تعذر إزالة الصورة.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      {currentImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentImageUrl}
          alt=""
          className="h-14 w-14 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-cream-deep text-xs text-stone dark:bg-charcoal">
          لا صورة
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <label className="cursor-pointer rounded-full border border-stone-light/50 px-3 py-1.5 text-xs font-bold text-charcoal hover:border-brand-red hover:text-brand-red dark:text-cream">
            {uploading ? "جارٍ الرفع..." : currentImageUrl ? "استبدال" : "رفع صورة"}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>
          {currentImageUrl && (
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="rounded-full border border-stone-light/50 px-3 py-1.5 text-xs font-bold text-brand-red hover:bg-brand-red hover:text-white"
            >
              إزالة
            </button>
          )}
        </div>
        {error && <span className="text-xs font-bold text-brand-red">{error}</span>}
      </div>
    </div>
  );
}
