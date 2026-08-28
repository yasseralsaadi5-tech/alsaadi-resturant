"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { ThemeToggle } from "./theme-toggle";
import { CartDrawer } from "./cart-drawer";

const links = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#menu", label: "المنيو" },
  { href: "#about", label: "من نحن" },
  { href: "#contact", label: "تواصل معنا" },
];

export function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-light/40 bg-cream/90 backdrop-blur dark:border-stone/20 dark:bg-charcoal/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="#hero" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="مطعم و مطبخ السعدي"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
              priority
            />
            <span className="font-display text-xl text-brand-red hidden sm:inline">
              مطعم و مطبخ السعدي
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-bold text-charcoal transition hover:text-brand-red dark:text-cream"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setCartOpen(true)}
              aria-label="سلة الطلبات"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-light/40 text-lg hover:border-brand-red dark:border-stone/40"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-1 -left-1 flex h-5 w-5 animate-cart-pop items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="القائمة"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-light/40 text-lg md:hidden dark:border-stone/40"
            >
              ☰
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="flex flex-col gap-1 border-t border-stone-light/40 bg-cream px-4 py-3 md:hidden dark:border-stone/20 dark:bg-charcoal">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 font-bold text-charcoal hover:bg-cream-deep dark:text-cream dark:hover:bg-charcoal-soft"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
