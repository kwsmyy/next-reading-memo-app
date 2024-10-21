"use client";
import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { validationLoginSchema } from "../schemas/validationLoginSchema";

export default function LoginPage() {
  const { data: session } = useSession();

  //apiからのエラーメッセージ
  const [responseError, setResponseError] = useState<Error>();

  //react-hook-formの定義
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof validationLoginSchema>>({
    mode: "onChange",
    resolver: zodResolver(validationLoginSchema),
  });

  // セッションがある場合はリダイレクト
  if (session) redirect("/");

  async function handleLogin(data: z.infer<typeof validationLoginSchema>) {
    const { email, password } = data;
    console.log(email, password);
    const response = await fetch("/api/login", {
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
      setResponseError(error.error);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
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
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ログイン
            </button>
          </div>
          <div className="text-xs font-bold text-red-400 mb-4  text-center">
            {responseError as React.ReactNode}
          </div>
        </form>
        {/* 
        <div>
          <button
            onClick={() => {
              signIn("github");
            }}
            className="w-full py-2 px-4 bg-gray-400 rounded-md text-white hover:bg-gray-700 text-sm font-medium"
          >
            githubでログイン
          </button>
        </div>
        */}
        <div>
          <button
            onClick={() => {
              signIn("google");
            }}
            className="w-full py-2 px-4 bg-gray-400 rounded-md text-white hover:bg-gray-700 text-sm font-medium"
          >
            googleでログイン
          </button>
        </div>
        <div className="w-full text-center">
          <Link
            href="/signup"
            className="text-indigo-700 hover:text-indigo-900 underline"
          >
            新規登録はこちらから
          </Link>
        </div>
      </div>
    </div>
  );
}
