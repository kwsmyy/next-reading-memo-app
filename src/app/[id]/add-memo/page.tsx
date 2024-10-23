"use client";
import React, { useState, useEffect, useRef } from "react";
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
  const [difyData, setDifyData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

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
      if (!fetchedBook) {
        router.push("/404");
      }
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

  async function handleAddMemo(data: z.infer<typeof validationMemoSchema>) {
    const { content } = data;
    const email = session?.user?.email;

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
    try {
      setIsLoading(true);

      // ファイルが選択されているかチェック
      if (!selectedFile) {
        throw new Error("ファイルが選択されていません。");
      }

      const formData = new FormData();
      formData.append("file", selectedFile as Blob);

      // UUIDの生成
      let uuid;
      try {
        uuid = uuidv4();
        if (!uuid) {
          throw new Error("UUIDの生成に失敗しました。");
        }
      } catch (uuidError) {
        console.error("UUID生成エラー:", uuidError);
        setIsLoading(false);
        return; // エラーが発生した場合、処理を中断
      }

      const fileType: string[] = selectedFile?.type.split("/");
      const pathName = `${session?.user?.email}/${uuid}.${fileType[1]}`;

      // Supabaseストレージにファイルをアップロード
      const { data, error } = await supabase.storage
        .from("memogami")
        .upload(pathName, formData, {
          cacheControl: "3600",
          upsert: true,
        });

      // エラーチェック
      if (error) {
        throw new Error(
          `ファイルのアップロードに失敗しました: ${error.message}`
        );
      }

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${data?.path}`;

      const difyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DIFY_API_URL}`,
        {
          body: JSON.stringify({
            inputs: {
              FileURL: {
                type: "image",
                transfer_method: "remote_url",
                url: url,
                remote_url: url,
              },
            },
            user: "abc-123",
            response_mode: "blocking",
          }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY_NEW}`,
            // prettier-ignore
          },
          method: "POST",
        }
      );

      const difyData = await difyResponse.json();

      setDifyData(difyData?.data?.outputs?.result);
    } catch (error) {
      console.error("エラー:", { error: error as Error });
    } finally {
      setSelectedFile(null);
      setIsLoading(false);
    }
  }

  /* エラーハンドリングしてなかった処理
  async function handleSendImage() {
    console.log(selectedFile?.name);

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile as Blob);
    const uuid = await uuidv4();
    const pathName = `${session?.user?.email}/${uuid}-${selectedFile?.name}`;
    const { data, error } = await supabase.storage
      .from("memogami")
      .upload(pathName, formData, {
        cacheControl: "3600",
        upsert: true,
      });
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${data?.path}`;
    console.log(url);



    const difyResponse = await fetch("http://localhost/v1/workflows/run", {
      body: JSON.stringify({
        inputs: {
          FileURL: {
            type: "image",
            transfer_method: "remote_url",
            url: url,
            remote_url: url,
          },
        },
        user: "abc-123",
        response_mode: "blocking",
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${}`, //APIキーを変更すること
        // prettier-ignore
      },
      method: "POST",
    });

    const difyData = await difyResponse.json();
    console.log(difyData?.data?.outputs?.result);
    setDifyData(difyData?.data?.outputs?.result);

    setSelectedFile(null);
    setIsLoading(false);
  }
  */

  return (
    <main className="md:h-screen max-h-screen flex items-center justify-center">
      <div className="w-full lg:w-1/2 md:w-full lg:px-10 md:px-6 sm:px-4 lg:mt-0 md:mt-0 mt-5">
        <h1 className="mb-2 text-3xl font-bold">{book?.title}</h1>
        <p className="mb-8 text-gray-600">{book?.author}</p>
        <form className="space-y-6" onSubmit={handleSubmit(handleAddMemo)}>
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
                AIで画像をOCR
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <div className="space-y-2">
                <Label htmlFor="memo">読書メモ</Label>
                <Textarea
                  id="memo"
                  placeholder="メモを入力してください"
                  rows={10}
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
                <>
                  <div className="flex justify-center">
                    <p className="text-lg mb-4">AIが画像を読み込み中です...</p>
                  </div>
                  <Loading />
                </>
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
                  {difyData && (
                    <>
                      <div className="space-y-2 mb-2 mt-4">
                        <Label htmlFor="memo">AIが読み取った読書メモ</Label>
                        <Textarea
                          id="memo"
                          ref={textAreaRef}
                          placeholder="メモを入力してください"
                          className="bg-white min-h-[200px] max-h-[400px] resize-none"
                          value={difyData}
                          onChange={(e) => {
                            setDifyData(e.target.value);
                            if (textAreaRef.current) {
                              textAreaRef.current.style.height = "auto"; // 一旦高さをリセットしてから再計算
                              textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
                            }
                          }}
                        />
                      </div>

                      <Button
                        onClick={() => {
                          handleAddMemo({ content: difyData });
                        }}
                        className="w-full mb-10"
                      >
                        メモを追加
                      </Button>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </main>
  );
}
