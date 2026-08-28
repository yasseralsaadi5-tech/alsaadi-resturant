import type { Metadata } from "next";
import { Lalezar, Tajawal, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const displayFont = Lalezar({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-display",
});

const bodyFont = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-body",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "مطعم و مطبخ السعدي | اللقمة اللذيذة",
  description:
    "مطعم و مطبخ السعدي - درعا الصنمين. شاورما، وجبات عربية وغربية، ومقبلات. اطلب الآن أونلاين.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
