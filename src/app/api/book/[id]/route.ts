import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const bookId: string = params.id;
  const bookData = await prisma.book.findUnique({
    where: {
      id: bookId.toString(),
    },
  });
  return NextResponse.json(bookData);
}
