"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";
import { useCartStore } from "@/store/cart-store";
import { useLastOrderStore } from "@/store/last-order-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  // All three stores use `skipHydration: true` so their FIRST client render
  // matches the server-rendered HTML exactly (default state). We manually
  // rehydrate from localStorage only after mount, which updates state via a
  // normal React update — never compared against server HTML — avoiding the
  // "Hydration failed" mismatch that persisted Zustand stores cause with SSR.
  useEffect(() => {
    useThemeStore.persist.rehydrate();
    useCartStore.persist.rehydrate();
    useLastOrderStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
