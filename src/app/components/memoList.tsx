import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MemoList() {
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
  );
}
