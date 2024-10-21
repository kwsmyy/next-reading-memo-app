"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { BookData } from "../types/type";
import { useState, useEffect } from "react";
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

  const bookMemos = {
    id: 1,
    title: "1984",
    author: "George Orwell",
    memos: [
      {
        id: 1,
        content: "ビッグブラザーは全てを見ている...",
        date: "2023-05-15",
      },
      {
        id: 2,
        content: "自由とは、2+2=4と言える自由である。",
        date: "2023-05-16",
      },
    ],
  };

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
      <div className="mb-8 flex justify-between">
        <h2 className="text-2xl font-semibold">読書メモ</h2>
        <Link href={`/book/${book?.id}/add-memo`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            メモを追加
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {bookMemos.memos.map((memo) => (
          <Card key={memo.id}>
            <CardHeader>
              <CardTitle className="text-sm font-normal text-gray-500">
                {memo.date}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{memo.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
