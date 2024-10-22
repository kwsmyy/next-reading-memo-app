import { z } from "zod";

export const validationMemoSchema = z.object({
  content: z
    .string()
    .min(1, { message: "メモを入力してください" })
    .max(1000, { message: "1000文字以内で入力してください" }),
});
