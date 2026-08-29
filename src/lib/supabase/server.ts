// تأكد من عدم وجود "use server" هنا
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function createClient() {
  // ✅ الحل الحاسم: استدعاء ديناميكي لـ cookies لتجنب خطأ التجميع
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { cookies } = require("next/headers");
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // تجاهل الخطأ لأن Middleware سيقوم بتحديث الجلسة
          }
        },
      },
    }
  );
}
