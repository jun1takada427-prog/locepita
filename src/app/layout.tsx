import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ロケピタ | 飲食店開業支援・規制 比較ナビ｜東京都23区",
  description: "東京23区の飲食店開業支援・補助金・規制を比較できるナビゲーションサービス",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
