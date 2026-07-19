import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Future",
  description: "Future：关于以后、回忆与重新开口的互动叙事"
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
