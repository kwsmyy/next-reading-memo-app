"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, FileText, Image as ImageIcon } from "lucide-react";

export default function AddMemoPage({
  params,
}: {
  params?: { bookId?: string };
}) {
  const router = useRouter();
  const bookId = 1;
  const [memo, setMemo] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!bookId) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <h1 className="mb-4 text-2xl font-bold text-red-600">エラー</h1>
        <p className="mb-4">本のIDが見つかりません。</p>
        <Button onClick={() => router.push("/books")}>本の一覧に戻る</Button>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Adding memo for book with ID: ${bookId}`);
    console.log("Memo:", memo);
    console.log("Files:", files);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(event.target.files || []),
      ]);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(event.dataTransfer.files),
      ]);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">新しいメモを追加</h1>
      <p className="mb-4">Book ID: {bookId}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">
              <FileText className="mr-2 h-4 w-4" />
              テキスト
            </TabsTrigger>
            <TabsTrigger value="image">
              <ImageIcon className="mr-2 h-4 w-4" />
              画像
            </TabsTrigger>
          </TabsList>
          <TabsContent value="text"></TabsContent>
          <TabsContent value="image"></TabsContent>
        </Tabs>
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">選択された画像:</h3>
            <ul className="mt-2 divide-y divide-gray-200">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <span className="truncate">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(file)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button type="submit">メモを保存</Button>
      </form>
    </div>
  );
}
