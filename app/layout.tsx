import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBar } from "@/components/CookieBar";

export const metadata: Metadata = {
  title: "Winio – informace o sázkách a kurzech",
  description:
    "Informační web o sázkách, kurzech a licencovaných sázkových kancelářích. Pouze informace, u nás nelze sázet ani hrát.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBar />
      </body>
    </html>
  );
}
