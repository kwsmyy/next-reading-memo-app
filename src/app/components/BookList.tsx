import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookData } from "../types/type";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
type Props = {
  books: BookData[];
  handleDelete: (bookId: string) => void;
};

export default function BookList({ books, handleDelete }: Props) {
  const router = useRouter();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {books.map((book: BookData) => (
        <Card key={book.id}>
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-600">
              {new Date(book.createdAt)
                .toLocaleString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })
                .slice(0, 19)}
            </p>
            <div className="flex justify-between">
              <Link href={`/${book.id}`}>
                <Button
                  variant="outline"
                  className="mt-4 hover:bg-indigo-500 hover:text-white"
                >
                  メモを見る
                </Button>
              </Link>
              <Button
                variant="outline"
                className="mt-4 hover:bg-red-400 hover:text-white"
                onClick={() => handleDelete(book.id.toString())}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
