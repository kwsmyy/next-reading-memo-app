"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { validationBooksSchema } from "../schemas/validationBooksSchema";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session } = useSession();

  //react-hook-formの定義
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof validationBooksSchema>>({
    mode: "onChange",
    resolver: zodResolver(validationBooksSchema),
  });

  async function handleAddBook(data: z.infer<typeof validationBooksSchema>) {
    const { title, author } = data;
    const email = session?.user?.email;
    console.log(title, author, email);

    const response = await fetch("/api/book", {
      body: JSON.stringify({ title, author, email }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-10">
        <h1 className="mb-4 text-3xl font-bold">新しい本を追加</h1>
        <form className="space-y-6" onSubmit={handleSubmit(handleAddBook)}>
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              placeholder="本のタイトルを入力"
              {...register("title")}
            />
          </div>
          <div className="text-xs font-bold text-red-400 mb-2">
            {errors.title?.message as React.ReactNode}
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">著者</Label>
            <Input
              id="author"
              placeholder="著者名を入力"
              {...register("author")}
            />
          </div>
          <div className="text-xs font-bold text-red-400 mb-2">
            {errors.author?.message as React.ReactNode}
          </div>
          <Button type="submit" className="w-full">
            本を追加
          </Button>
        </form>
      </div>
    </main>
  );
}
