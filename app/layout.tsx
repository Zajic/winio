import type { Metadata, Viewport } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBar } from "@/components/CookieBar";
import { Analytics } from "@/components/Analytics";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Winio – kurzy, kasina a bonusy v ČR",
  description:
    "Největší přehled kurzů, licencovaných kasin a bonusů. Informační portál 18+. U nás nelze sázet – jen srovnání a odkazy na provozovatele.",
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${outfit.variable} ${syne.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-sans bg-winio-navy text-slate-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBar />
        <Analytics />
      </body>
    </html>
  );
}
