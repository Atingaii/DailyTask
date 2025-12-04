import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ tasks: [] });

  const start = new Date(date + "T00:00:00");
  const end = new Date(date + "T23:59:59");

  const tasks = await prisma.task.findMany({
    where: { taskDate: { gte: start, lte: end } },
    orderBy: { orderIndex: "asc" },
  });

  return NextResponse.json({ tasks });
}
