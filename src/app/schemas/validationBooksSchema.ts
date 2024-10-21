import { z } from "zod";

export const validationBooksSchema = z.object({
  title: z.string().min(1, { message: "タイトルを入力してください" }),
  author: z.string().min(1, { message: "著者を入力してください" }),
});
