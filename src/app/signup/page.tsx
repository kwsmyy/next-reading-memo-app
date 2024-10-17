"use client";
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { validationSignUpSchema } from "../schemas/validationSignUpSchema";

type Error = {
  email: [];
  password: [];
  passwordConfirm: [];
};

export default function SignUpPage() {
  const { data: session, status } = useSession();

  //apiからのエラーメッセージ
  const [responseError, setResponseError] = useState<Error>();

  //react-hook-formの定義
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof validationSignUpSchema>>({
    mode: "onChange",
    resolver: zodResolver(validationSignUpSchema),
  });

  // セッションがある場合はリダイレクト
  if (session) redirect("/");

  async function handleSignUp(data: z.infer<typeof validationSignUpSchema>) {
    const { email, password } = data;
    console.log(email, password);
    const response = await fetch("/api/signup", {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    if (response.ok) {
      signIn("credentials", { email, password });
    } else {
      const error = await response.json();
      console.log(error);
      setResponseError(error.errors);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-xs font-bold text-red-400 mb-4">
          {responseError as React.ReactNode}
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            SignUp
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSignUp)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email"
                type="text"
                {...register("email")}
                className="appearance-none rounded-md relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
              />
              <div className="text-xs font-bold text-red-400 mb-2">
                {errors.email?.message as React.ReactNode}
                {responseError?.email?.map((error, index) => {
                  return <p key={index}>{error}</p>;
                })}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="appearance-none rounded-md relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
              />
              <div className="text-xs font-bold text-red-400 mb-2">
                {errors.password?.message as React.ReactNode}
                {responseError?.password?.map((error, index) => {
                  return <p key={index}>{error}</p>;
                })}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                再確認パスワード
              </label>
              <input
                id="passwordConfirm"
                type="password"
                {...register("passwordConfirm")}
                className="appearance-none rounded-md relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード（確認用）"
              />
              <div className="text-xs font-bold text-red-400 mb-2">
                {errors.passwordConfirm?.message as React.ReactNode}
                {responseError?.passwordConfirm?.map((error, index) => {
                  return <p key={index}>{error}</p>;
                })}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              新規登録
            </button>
          </div>
        </form>
        <div className="w-full text-center">
          <Link
            href="/login"
            className="text-indigo-700 hover:text-indigo-900 underline"
          >
            ログインはこちらから
          </Link>
        </div>
      </div>
    </div>
  );
}
