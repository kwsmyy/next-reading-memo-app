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
import { Book } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [books, setBooks] = useState<BookData[]>([]);

  async function handleDelete(id: string) {
    if (window.confirm("削除しますか？")) {
      await fetch(`/api/book/${id}`, {
        method: "DELETE",
      });
      router.push("/");
      router.refresh();
    }
  }

  useEffect(() => {
    async function fetchBooks() {
      const response = await fetch("/api/book", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const fetchedBooks: BookData[] = await response.json();
      setBooks(fetchedBooks);
    }

    fetchBooks();
  }, []);

  return (
    <main className="lg:p-10 md:p-5 sm:p-2 mb-[200px]">
      <div className="w-full mt-10">
        <div className="m-4 w-full"></div>
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center justify-center gap-2">
            <Book className="h-10 w-10 text-indigo-500" aria-hidden="true" />
            <h1 className="text-2xl font-bold">本の一覧</h1>
          </div>
          <Link href="/add-book">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              本を追加
            </Button>
          </Link>
        </div>
        <Suspense fallback={<Loading />}>
          <BookList books={books} handleDelete={handleDelete} />
        </Suspense>
      </div>
    </main>
  );
}
