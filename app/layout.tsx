import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Бронирование экскурсий - Ферма альпак ЛуЛу",
  description: "Забронируйте экскурсию на ферму альпак ЛуЛу. Знакомство с альпаками, фотосессии и незабываемые впечатления!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
