"use client";
import { useSession, signOut } from "next-auth/react";
import Loading from "./loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const books = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
    { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  ];

  return (
    <main className="flex items-center h-screen  w-full p-10 justify-center">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {books.map((book) => (
            <Card key={book.id}>
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{book.author}</p>
                <Link href={`/book/${book.id}`}>
                  <Button variant="outline" className="mt-4">
                    メモを見る
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
