import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemoData } from "../types/type";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MemoList({ memos }: { memos: MemoData[] }) {
  const router = useRouter();
  async function handleDelete(id: string) {
    if (confirm("本当に削除しますか？")) {
      await fetch(`/api/memo/${id}`, {
        method: "DELETE",
      });
      router.refresh();
    }
  }
  return (
    <div className="space-y-4 lg:w-1/2 mx-auto">
      {memos.map((memo) => (
        <Card key={memo.id}>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-gray-500">
              {new Date(memo.createdAt)
                .toLocaleString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })
                .slice(0, 19)}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="whitespace-pre-wrap">{memo.content}</p>
            <Button
              variant="outline"
              className="mt-4 hover:bg-red-400 hover:text-white absolute bottom-2 right-2"
              onClick={() => handleDelete(memo.id.toString())}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
