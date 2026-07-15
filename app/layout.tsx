import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "《离别》南京版",
  description: "根据《离别》剧情完整文档改写的南京版互动叙事原型"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
