import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function GET(
  req: NextRequest,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId: string = params.id;
    const deletedBook = await prisma.book.delete({
      where: {
        id: bookId.toString(),
      },
    });
    return NextResponse.json(
      { message: "Book deleted", deletedBook },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
