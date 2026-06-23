import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CH Coffee Lab 咖啡豆訂購",
  description: "CH Coffee Lab 咖啡豆線上訂購系統"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        <header className="border-b border-coffee-100 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold tracking-wide text-coffee-900">
              CH Coffee Lab 訂購
            </Link>
            <div className="flex gap-4 text-sm font-medium text-coffee-700">
              <Link href="/" className="hover:text-coffee-500">
                商品
              </Link>
              <Link href="/order" className="hover:text-coffee-500">
                下單
              </Link>
              <Link href="/admin/orders" className="hover:text-coffee-500">
                管理後台
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
