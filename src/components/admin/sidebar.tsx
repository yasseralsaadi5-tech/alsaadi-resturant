"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/admin/orders", label: "الطلبات", icon: "🧾" },
  { href: "/admin/menu", label: "الأصناف", icon: "🍽" },
  { href: "/admin/categories", label: "التصنيفات", icon: "📂" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col gap-2 border-b border-stone-light/40 bg-cream-deep p-4 dark:border-stone/20 dark:bg-charcoal-soft md:h-screen md:w-56 md:border-b-0 md:border-l">
      <h2 className="mb-4 px-2 font-display text-xl text-brand-red">لوحة السعدي</h2>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 font-bold transition ${
              pathname.startsWith(link.href)
                ? "bg-brand-red text-white"
                : "text-charcoal hover:bg-cream dark:text-cream dark:hover:bg-charcoal"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-between border-t border-stone-light/40 pt-3 dark:border-stone/20">
        <ThemeToggle />
        <button
          onClick={handleSignOut}
          className="rounded-full border border-stone-light/50 px-4 py-2 text-sm font-bold text-charcoal hover:border-brand-red hover:text-brand-red dark:text-cream"
        >
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
