import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_JP } from "next/font/google";
import Header from "./components/Header";
import NextAuthProvider from "../../src/lib/NextAuthProvider";

const notojp = Noto_Sans_JP({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next Auth",
  description: "Next Auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <NextAuthProvider>
        <body className={`${notojp.className} antialiased`}>
          <Header />
          {children}
        </body>
      </NextAuthProvider>
    </html>
  );
}
