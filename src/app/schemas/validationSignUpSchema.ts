import { z } from "zod";

export const validationSignUpSchema = z
  .object({
    email: z.string().email("メールアドレスの形式が正しくありません"),
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    passwordConfirm: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください"),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードが一致しません",
        path: ["passwordConfirm"],
      });
    }
  });
