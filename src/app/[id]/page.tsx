"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { BookData } from "../types/type";
import { MemoData } from "../types/type";
import { useState, useEffect } from "react";
import MemoList from "../components/memoList";

export default function BookMemosPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [book, setBook] = useState<BookData>();

  useEffect(() => {
    async function fetchBook() {
      const response = await fetch(`/api/book/${id}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const fetchedBooks: BookData = await response.json();
      console.log(fetchedBooks);
      setBook(fetchedBooks);
    }

    fetchBook();
  }, [id]);

  useEffect(() => {
    async function fetchMemos() {
      const response = await fetch(`/api/memo/${id}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch memos");
      }
      const fetchedMemos: MemoData[] = await response.json();
      console.log(fetchedMemos);
    }

    fetchMemos();
  }, [id]);

  return (
    <main className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{book?.title}</h1>
        <p className="text-gray-600">{book?.author}</p>
        <p className="text-gray-600">
          {book
            ? new Date(book.createdAt)
                .toLocaleString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })
                .slice(0, 18)
            : ""}
        </p>
      </div>
      <div className="mb-8 flex justify-between lg:w-1/2 mx-auto">
        <h2 className="text-2xl font-semibold">読書メモ</h2>
        <Link href={`/${book?.id}/add-memo`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            メモを追加
          </Button>
        </Link>
      </div>
      <MemoList />
    </main>
  );
}
