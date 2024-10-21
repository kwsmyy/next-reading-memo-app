"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";

export default function Header() {
  const { data: session } = useSession();
  if (!session) {
    return <></>;
  } else {
    return (
      <div className="border-b border-gray-700 px-4 py-3 md:py-6 lg:px-6 bg-white">
        <div className="flex items-center space-x-10 md:space-x-5 sm:space-x-2">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter mr-4 hover:text-gray-200"
          >
            Next Auth Home
          </Link>
          <Link href="/about" className="hover:text-gray-200">
            About
          </Link>
          <Link href="/about" className="hover:text-gray-200">
            About
          </Link>
          <Link href="/about" className="hover:text-gray-200">
            About
          </Link>
        </div>
      </div>
    );
  }
}
