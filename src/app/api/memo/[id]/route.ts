import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memoId: number = parseInt(params.id);
    const deletedMemo = await prisma.comment.delete({
      where: {
        id: memoId,
      },
    });
    return NextResponse.json(
      { message: "memo deleted", deletedMemo },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
