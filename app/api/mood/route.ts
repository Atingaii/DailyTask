import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - 获取心情记录
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const days = searchParams.get("days");

    if (date) {
      // 获取特定日期的心情
      const mood = await prisma.dailyMood.findFirst({
        where: {
          moodDate: new Date(date),
        },
      });
      return NextResponse.json({ mood });
    }

    if (days) {
      // 获取最近N天的心情
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      
      const moods = await prisma.dailyMood.findMany({
        where: {
          moodDate: { gte: daysAgo },
        },
        orderBy: { moodDate: "desc" },
      });

      return NextResponse.json({ 
        moods: moods.map((m: { moodDate: Date; mood: string; note: string | null }) => ({
          date: m.moodDate.toISOString().slice(0, 10),
          mood: m.mood,
          note: m.note,
        }))
      });
    }

    // 默认获取所有心情记录
    const moods = await prisma.dailyMood.findMany({
      orderBy: { moodDate: "desc" },
    });

    return NextResponse.json({ 
      moods: moods.map((m: { moodDate: Date; mood: string; note: string | null }) => ({
        date: m.moodDate.toISOString().slice(0, 10),
        mood: m.mood,
        note: m.note,
      }))
    });
  } catch (error) {
    console.error("获取心情失败:", error);
    return NextResponse.json({ error: "获取心情失败" }, { status: 500 });
  }
}

// POST - 记录心情
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, mood, note } = body;

    if (!date || !mood) {
      return NextResponse.json({ error: "日期和心情是必填项" }, { status: 400 });
    }

    const moodDate = new Date(date);

    // 使用 upsert 来创建或更新
    const result = await prisma.dailyMood.upsert({
      where: {
        moodDate: moodDate,
      },
      update: {
        mood,
        note,
      },
      create: {
        moodDate,
        mood,
        note,
      },
    });

    return NextResponse.json({ 
      success: true, 
      mood: {
        date: result.moodDate.toISOString().slice(0, 10),
        mood: result.mood,
        note: result.note,
      }
    });
  } catch (error) {
    console.error("记录心情失败:", error);
    return NextResponse.json({ error: "记录心情失败" }, { status: 500 });
  }
}
