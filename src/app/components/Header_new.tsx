"use client";

import { Button } from "@/components/ui/button";
import { List, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Poiret_One } from "next/font/google";

const poiret = Poiret_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});
export default function Header_new() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const { data: session } = useSession();

  if (!session) {
    return <></>;
  } else {
    return (
      <>
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-white px-4 shadow-sm md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            onClick={toggleSidebar}
          >
            <List className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-indigo-600" aria-hidden="true" />
            <span
              className={`text-xl font-bold text-[#6366F1] ${poiret.className}`}
            >
              memo gAmI
            </span>
          </div>
          <div className="w-6" />
        </header>
        {/* サイドバー */}
        {isSidebarOpen ? (
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex h-20 items-center justify-center border-b">
              <BookOpen className="mr-2 h-8 w-8 text-indigo-600" />
              <span
                className={`text-xl font-bold text-[#6366F1] ${poiret.className}`}
              >
                memo gAmI
              </span>
            </div>
            <nav className="mt-6">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700"
                onClick={closeSidebar}
              >
                <List className="mr-2 inline-block h-5 w-5" />
                本の一覧
              </Link>
              <Link
                href="/add-book"
                className="block px-4 py-2 text-gray-600 hover:bg-indigo-100 hover:text-indugo-700"
                onClick={closeSidebar}
              >
                <PlusCircle className="mr-2 inline-block h-5 w-5" />
                本を追加
              </Link>
            </nav>
            <div className="absolute bottom-0 w-full border-t p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Button>
            </div>
          </aside>
        ) : (
          <></>
        )}

        {/* オーバーレイを追加 */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={closeSidebar}
          />
        )}
      </>
    );
  }
}
