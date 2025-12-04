import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - 获取热力图数据（过去一年）
export async function GET(req: NextRequest) {
  try {
    // 获取一年前的日期
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // 获取任务数据
    const tasks = await prisma.task.findMany({
      where: {
        taskDate: { gte: oneYearAgo },
      },
      select: {
        taskDate: true,
        isCompleted: true,
      },
    });

    // 获取心情数据
    const moods = await prisma.dailyMood.findMany({
      where: {
        moodDate: { gte: oneYearAgo },
      },
      select: {
        moodDate: true,
        mood: true,
      },
    });

    // 按日期聚合任务数据
    const dailyData: Record<string, { total: number; completed: number; mood?: string }> = {};

    tasks.forEach((task: { taskDate: Date; isCompleted: boolean }) => {
      const dateStr = task.taskDate.toISOString().slice(0, 10);
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { total: 0, completed: 0 };
      }
      dailyData[dateStr].total++;
      if (task.isCompleted) {
        dailyData[dateStr].completed++;
      }
    });

    // 合并心情数据
    moods.forEach((m: { moodDate: Date; mood: string }) => {
      const dateStr = m.moodDate.toISOString().slice(0, 10);
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { total: 0, completed: 0 };
      }
      dailyData[dateStr].mood = m.mood;
    });

    // 计算统计
    const totalDays = Object.keys(dailyData).length;
    const totalTasks = Object.values(dailyData).reduce((sum, d) => sum + d.total, 0);
    const totalCompleted = Object.values(dailyData).reduce((sum, d) => sum + d.completed, 0);
    
    // 计算连续天数
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().slice(0, 10);
      const dayData = dailyData[dateStr];
      
      if (dayData && dayData.completed > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return NextResponse.json({
      data: dailyData,
      stats: {
        totalDays,
        totalTasks,
        totalCompleted,
        currentStreak,
        completionRate: totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("获取热力图数据失败:", error);
    return NextResponse.json({ error: "获取数据失败" }, { status: 500 });
  }
}
