import { z } from "zod";

export const validationLoginSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, { message: "パスワードを入力してください" }),
});
