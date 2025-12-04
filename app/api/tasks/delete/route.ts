import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { id } = body as { id: string };

  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
