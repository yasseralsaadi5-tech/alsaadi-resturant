"use client"
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated users away from /admin,
  // but we double-check here (defense in depth) and also verify the user
  // actually has an admin profile row — being logged in is not enough.
  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-bold text-charcoal dark:text-cream">
          هذا الحساب غير مفعّل كحساب إدارة بعد.
        </p>
        <p className="text-sm text-stone dark:text-stone-light">
          يجب على مالك المشروع ربط هذا الحساب بجدول profiles من لوحة Supabase
          قبل أن تتمكن من الوصول إلى لوحة التحكم.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row-reverse">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
