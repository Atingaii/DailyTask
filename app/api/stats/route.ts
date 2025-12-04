import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // 获取最近30天的所有任务
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const tasks = await prisma.task.findMany({
    where: {
      taskDate: { gte: thirtyDaysAgo },
    },
    orderBy: { taskDate: "desc" },
  });

  // 总统计
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: { isCompleted: boolean }) => t.isCompleted).length;

  // 按日期分组统计
  const dailyStats: Record<string, { total: number; completed: number }> = {};
  
  tasks.forEach((task: { taskDate: Date; isCompleted: boolean }) => {
    const dateStr = task.taskDate.toISOString().slice(0, 10);
    if (!dailyStats[dateStr]) {
      dailyStats[dateStr] = { total: 0, completed: 0 };
    }
    dailyStats[dateStr].total++;
    if (task.isCompleted) {
      dailyStats[dateStr].completed++;
    }
  });

  // 计算最近7天的数据
  const last7Days: { date: string; total: number; completed: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    last7Days.push({
      date: dateStr,
      total: dailyStats[dateStr]?.total ?? 0,
      completed: dailyStats[dateStr]?.completed ?? 0,
    });
  }

  // 计算连续完成天数 (streak)
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  
  for (let i = 0; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const stat = dailyStats[dateStr];
    
    // 如果当天有任务且全部完成，或者当天没有任务（跳过）
    if (stat && stat.total > 0) {
      if (stat.completed === stat.total) {
        streak++;
      } else {
        break;
      }
    } else if (i > 0) {
      // 跳过今天没有任务的情况，但之前的天数如果没任务就中断
      break;
    }
  }

  return NextResponse.json({
    totalTasks,
    completedTasks,
    streak,
    last7Days,
    dailyStats,
  });
}
