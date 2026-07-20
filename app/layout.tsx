import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_REACT_APP_TITLE,
  description: "RGB・HEX・HSLのカラーコードを生成して配色を確認できるカラーパレットツール",
};

/**
 * アプリ全体のルートレイアウト。
 * 全ページ共通の`<html>`/`<body>`とフォント設定を提供する(Next.js App Routerの規約に基づくファイル)。
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
