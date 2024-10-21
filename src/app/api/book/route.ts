import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { title, author, email } = data;

  try {
    // emailからuserIDを取得
    const user = await prisma.user.findUnique({
      where: {
        email: email, // ユーザーのメールアドレスで検索
      },
    });
    if (!user) throw new Error("User not found");
    if (user) {
      console.log(user.id);
      await prisma.book.create({
        data: {
          title,
          author,
          userId: user.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ message: "success" }, { status: 201 });
}
