import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coffee Bean Ordering",
  description: "Online coffee bean ordering system"
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
              Coffee Order
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
