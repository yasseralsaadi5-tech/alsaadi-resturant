"use client";

import { useThemeStore } from "@/store/theme-store";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "light" ? "تفعيل الوضع الداكن" : "تفعيل الوضع الفاتح"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-light/40 text-lg transition hover:border-brand-red hover:text-brand-red dark:border-stone/40"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
