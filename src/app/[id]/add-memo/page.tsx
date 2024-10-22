"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image as ImageIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { validationMemoSchema } from "../../schemas/validationMemoSchema";
import { useRouter } from "next/navigation";
import { BookData } from "../../types/type";
import { supabase } from "@/utils/supabace";
import { v4 as uuidv4 } from "uuid";
import Loading from "../../loading";

export default function AddMemoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [book, setBook] = useState<BookData>();

  useEffect(() => {
    async function fetchBook() {
      const response = await fetch(`/api/book/${id}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const fetchedBook: BookData = await response.json();
      console.log(fetchedBook);
      setBook(fetchedBook);
    }

    fetchBook();
  }, [id]);

  //react-hook-formの定義
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof validationMemoSchema>>({
    mode: "onChange",
    resolver: zodResolver(validationMemoSchema),
  });

  async function handleAddBook(data: z.infer<typeof validationMemoSchema>) {
    const { content } = data;
    const email = session?.user?.email;
    console.log(content);

    await fetch("/api/memo", {
      body: JSON.stringify({ content, bookId: id, email }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    router.push(`/${id}`);
    router.refresh();
  }

  async function handleSendImage() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile as Blob);
    const pathName = `${session?.user?.email}/${uuidv4()}`;
    const { data, error } = await supabase.storage
      .from("memogami")
      .upload(pathName, formData, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) throw error;
    setSelectedFile(null);
    console.log(data?.path);
    setIsLoading(false);
  }

  return (
    <main className="md:h-screen max-h-screen flex items-center justify-center">
      <div className="w-full lg:w-1/2 lg:px-10 md:px-6 sm:px-4 lg:mt-0 md:mt-0 mt-5">
        <h1 className="mb-2 text-3xl font-bold">{book?.title}</h1>
        <p className="mb-8 text-gray-600">{book?.author}</p>
        <form className="space-y-6" onSubmit={handleSubmit(handleAddBook)}>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white  mt-8 mb-8">
              <TabsTrigger
                value="text"
                className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                テキストで入力
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className=" data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                AIで画像から読み取る
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <div className="space-y-2">
                <Label htmlFor="memo">読書メモ</Label>
                <Textarea
                  id="memo"
                  placeholder="メモを入力してください"
                  rows={6}
                  className="bg-white"
                  {...register("content")}
                />
              </div>
              <div className="text-xs font-bold text-red-400 mb-2">
                {errors.content?.message as React.ReactNode}
              </div>
              <Button type="submit" className="w-full">
                メモを追加
              </Button>
            </TabsContent>
            <TabsContent value="image">
              {isLoading ? (
                <Loading />
              ) : (
                <div>
                  <Label htmlFor="file-upload">
                    写真をアップロードしてAIに読み取らせる
                  </Label>
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="w-full p-3 relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span className="text-center">ファイルを選択</span>
                          <Input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) =>
                              setSelectedFile(e?.target?.files?.[0] || null)
                            }
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  {selectedFile && (
                    <div className="mt-4 flex justify-center">
                      <h3 className="text-lg font-medium">
                        選択されたファイル:
                      </h3>
                    </div>
                  )}
                  <div className="mt-4 flex justify-center">
                    {selectedFile && (
                      <img
                        className="w-[150px] h-[150px]"
                        src={URL.createObjectURL(selectedFile as Blob)}
                        alt="selectedFile"
                      />
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Button
                      disabled={!selectedFile}
                      className={`w-1/3 mt-4 mb-4`}
                      onClick={handleSendImage}
                    >
                      画像を送信
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </main>
  );
}
