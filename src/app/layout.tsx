// src/app/layout.tsx (正しいレイアウトのコード)

import type { Metadata } from "next";
// 'next/font/google' はプロジェクトのフォント設定に合わせてください
// デフォルトの 'Inter' を使っていると仮定します
import { Inter } from "next/font/google"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CosPose Navi", // ページのタイトル
  description: "コスプレポーズ検索サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // ★ これが app/page.tsx などの中身です
}>) {
  return (
    <html lang="ja">
      {/* <body className={inter.className}> 
        もし inter 以外のフォントを使っている場合は、
        <body className="bg-slate-800 text-white"> のように変更してもOKです
      */}
      <body className={inter.className}>
        {children} {/* ★ この {children} が最も重要です */}
      </body>
    </html>
  );
}