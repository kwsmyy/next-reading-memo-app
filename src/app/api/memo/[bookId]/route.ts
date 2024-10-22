import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { getServerSession } from "next-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    // セッションの取得
    const session = await getServerSession();
    if (!session?.user?.email) throw new Error("User not found");

    // emailからuserを取得
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    if (!user) throw new Error("User not found");

    // bookIdとuserIdにマッチするコメントを取得
    const memos = await prisma.comment.findMany({
      where: {
        bookId: params.bookId, // 直接paramsからbookIdを取得
        userId: user.id,
      },
    });

    // コメント一覧を返す
    return NextResponse.json(memos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
