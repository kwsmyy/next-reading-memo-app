import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_JP } from "next/font/google";
import Header_new from "./components/Header_new";
import Sidebar from "./components/Sidebar";
import NextAuthProvider from "../../src/lib/NextAuthProvider";
import { Button } from "@/components/ui/button";
import { List, BookOpen } from "lucide-react";

const notojp = Noto_Sans_JP({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "memo gAmI",
  description: "memo gAmI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <NextAuthProvider>
        <body
          className={`${notojp.className} antialiased min-h-screen bg-gray-100`}
        >
          <Header_new />
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4">{children}</main>
          </div>
        </body>
      </NextAuthProvider>
    </html>
  );
}
