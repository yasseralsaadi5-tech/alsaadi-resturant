"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError("بيانات الدخول غير صحيحة.");
        return;
      }
      router.push("/admin/orders");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setInfo(
        "تم إنشاء الحساب. لتفعيل صلاحيات الإدارة، يجب ربط هذا الحساب بجدول profiles من قبل مالك المشروع."
      );
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-center font-display text-3xl text-brand-red">
        لوحة تحكم مطعم السعدي
      </h1>

      <div className="mb-4 flex rounded-full border border-stone-light/40 p-1">
        <button
          onClick={() => setMode("signin")}
          className={`flex-1 rounded-full py-2 text-sm font-bold ${
            mode === "signin" ? "bg-brand-red text-white" : "text-charcoal dark:text-cream"
          }`}
        >
          تسجيل الدخول
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full py-2 text-sm font-bold ${
            mode === "signup" ? "bg-brand-red text-white" : "text-charcoal dark:text-cream"
          }`}
        >
          إنشاء حساب
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          dir="ltr"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-stone-light/40 px-4 py-2"
        />
        <input
          type="password"
          required
          dir="ltr"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-stone-light/40 px-4 py-2"
        />

        {error && <p className="text-sm font-bold text-brand-red">{error}</p>}
        {info && <p className="text-sm text-stone dark:text-stone-light">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-brand-red py-2 font-bold text-white disabled:opacity-60"
        >
          {loading ? "جارٍ التحقق..." : mode === "signin" ? "دخول" : "إنشاء الحساب"}
        </button>
      </form>
    </div>
  );
}
