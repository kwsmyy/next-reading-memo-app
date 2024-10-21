import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookData } from "../types/type";
type Props = {
  books: BookData[];
};

export default function BookList({ books }: Props) {
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
                .slice(0, 18)}
            </p>
            <Link href={`/${book.id}`}>
              <Button variant="outline" className="mt-4">
                メモを見る
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
