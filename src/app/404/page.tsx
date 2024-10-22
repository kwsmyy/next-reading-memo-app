import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <BookX
          className="mx-auto h-24 w-24 text-indigo-500"
          aria-hidden="true"
        />
        <h1 className="mt-6 text-4xl font-bold text-gray-900">
          404 - ページが見つかりません
        </h1>
        <p className="mt-3 text-lg text-gray-600">
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
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500">
          お探しのページが見つからない場合は、
          <a
            href="/contact"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            お問い合わせ
          </a>
          ください。
        </p>
      </div>
    </main>
  );
}
