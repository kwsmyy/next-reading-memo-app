"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Loading from "./loading";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <main className="flex justify-center items-center flex-col h-screen">
      <div>
        <h1>Next Auth Home</h1>
      </div>
      <div className="m-2">ログイン中のユーザー</div>
      {status === "loading" ? <Loading /> : <div>{session?.user?.name}</div>}
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white py-4 px-2 rounded-md font-bold w-40"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
