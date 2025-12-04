import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tomorrow } from "@/lib/date";

export async function POST(req: Request) {
  const body = await req.json();
  const title: string = body.title;
  const dateStr = tomorrow();
  const date = new Date(dateStr + "T12:00:00");

  const task = await prisma.task.create({
    data: {
      title,
      taskDate: date,
    },
  });

  return NextResponse.json({ task });
}
