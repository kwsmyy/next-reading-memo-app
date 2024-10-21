import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import bcrypt from "bcrypt";
import { validationSignUpSchema } from "@/app/schemas/validationSignUpSchema";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { email, password } = data;

  const [user, validationResult] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    validationSignUpSchema.safeParse(data),
  ]);

  const errors = validationResult.success
    ? {}
    : validationResult.error.flatten().fieldErrors;

  if (user) {
    errors.email = [
      ...(errors.email || []),
      "このメールアドレスは既に使用されています",
    ];
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ message: "success" }, { status: 201 });
}
