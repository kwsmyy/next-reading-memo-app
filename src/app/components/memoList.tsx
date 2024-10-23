import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemoData } from "../types/type";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
type Props = {
  memos: MemoData[];
  handleDelete: Function;
};

export default function MemoList({ memos, handleDelete }: Props) {
  const router = useRouter();

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
          <CardContent>
            <p className="whitespace-pre-wrap">{memo.content}</p>
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="mt-4 hover:bg-red-400 hover:text-white"
                onClick={() => handleDelete(memo.id.toString())}
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
