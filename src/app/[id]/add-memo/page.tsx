"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { validationMemoSchema } from "../../schemas/validationMemoSchema";
import { useRouter } from "next/navigation";
import { BookData } from "../../types/type";

export default function AddMemoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id;

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

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full lg:w-1/2 px-10">
        <h1 className="mb-2 text-3xl font-bold">{book?.title}</h1>
        <p className="mb-8 text-gray-600">{book?.author}</p>
        <form className="space-y-6" onSubmit={handleSubmit(handleAddBook)}>
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
        </form>
      </div>
    </main>
  );
}
