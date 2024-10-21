"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Loading from "./loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookData } from "./types/type";
import { PlusCircle } from "lucide-react";
import BookList from "./components/BookList";
import { Suspense } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  const [books, setBooks] = useState<BookData[]>([]);

  useEffect(() => {
    async function fetchBooks() {
      const response = await fetch("/api/book", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const fetchedBooks: BookData[] = await response.json();
      console.log(fetchedBooks);
      setBooks(fetchedBooks);
    }

    fetchBooks();
  }, []);

  return (
    <main className="flex items-center h-screen w-full p-10 justify-center">
      <div className="w-full mt-10">
        {status === "loading" ? <Loading /> : <div>{session?.user?.email}</div>}
        <div className="m-4 w-full">
          <button
            className="bg-blue-500 text-white py-4 px-2 rounded-md font-bold w-40"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </button>
        </div>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold mb-4">本の一覧</h1>
          <Link href="/add-book">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              本を追加
            </Button>
          </Link>
        </div>
        <Suspense fallback={<Loading />}>
          <BookList books={books} />
        </Suspense>
      </div>
    </main>
  );
}
