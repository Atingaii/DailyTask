import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, isCompleted } = body as { id: string; isCompleted: boolean };

  const task = await prisma.task.update({
    where: { id },
    data: { isCompleted },
  });

  return NextResponse.json({ task });
}
