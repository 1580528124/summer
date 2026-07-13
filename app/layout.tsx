import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "回到2018",
  description: "一间 2018 年深夜房间形式的轻叙事互动游戏原型"
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
