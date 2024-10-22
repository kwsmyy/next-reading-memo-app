import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="md:h-screen max-h-screen flex items-center justify-center ">
      <div className="text-center">
        <BookX
          className="mx-auto h-10 w-10 text-indigo-500 md:mt-0 mt-10"
          aria-hidden="true"
        />
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          404 - ページが見つかりません
        </h1>
        <p className="mt-3 text-md text-gray-600">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="mt-10">
          <Button asChild>
            <Link href="/" className="inline-flex items-center">
              ホームに戻る
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
