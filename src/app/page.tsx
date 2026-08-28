import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { MenuSection } from "@/components/menu-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import type { Category, MenuItem } from "@/lib/types";

export const revalidate = 0; // always fetch fresh menu/availability data

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").order("sort_order"),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <MenuSection
          categories={(categories as Category[]) ?? []}
          items={(items as MenuItem[]) ?? []}
        />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
