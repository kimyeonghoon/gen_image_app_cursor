import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "타투 디자인 생성기 - AI 기반 맞춤 타투 디자인",
  description: "OpenAI DALL·E 3를 활용한 맞춤형 타투 디자인 생성 플랫폼입니다. 스타일, 크기, 위치, 테마를 선택하여 고품질 타투 이미지를 생성하세요.",
  keywords: ["타투", "디자인", "AI", "DALL-E", "생성", "맞춤형"],
  authors: [{ name: "타투 디자인 생성기 팀" }],
  openGraph: {
    title: "타투 디자인 생성기",
    description: "AI 기반 맞춤 타투 디자인 생성 플랫폼",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
