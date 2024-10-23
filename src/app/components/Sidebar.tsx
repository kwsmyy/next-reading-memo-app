"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, List, PlusCircle, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Poiret_One } from "next/font/google";

const poiret = Poiret_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function Sidebar() {
  const { data: session } = useSession();
  if (!session) {
    return <></>;
  } else {
    return (
      <aside
        className={`sticky top-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 sm:translate-x-0 md:block hidden`}
      >
        <div className="flex h-20 items-center justify-center border-b">
          <BookOpen className="mr-2 h-8 w-8 text-indigo-600" />
          <span
            className={`text-2xl font-bold text-[#6366F1] ${poiret.className}`}
          >
            memo gAmI
          </span>
        </div>
        <nav className="mt-6">
          <Link
            href="/"
            className="block px-4 py-2 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700"
          >
            <List className="mr-2 inline-block h-5 w-5" />
            本の一覧
          </Link>
          <Link
            href="/add-book"
            className="block px-4 py-2 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700"
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
    );
  }
}
