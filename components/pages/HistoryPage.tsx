import { prisma } from "@/lib/prisma";
import { DailyQuote } from "@/components/quotes/DailyQuote";
import { TopNav } from "@/components/layout/TopNav";
import HistoryClient from "./HistoryPageClient";

// 禁用缓存，确保每次都获取最新数据
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getHistoryData() {
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
  const completedTasks = tasks.filter((t) => t.isCompleted).length;

  // 按日期分组统计
  const dailyStats: Record<string, { total: number; completed: number }> = {};
  
  tasks.forEach((task) => {
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

  // 计算连续完成天数
  let streak = 0;
  for (let i = 0; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const stat = dailyStats[dateStr];
    
    if (stat && stat.total > 0) {
      if (stat.completed === stat.total) {
        streak++;
      } else {
        break;
      }
    } else if (i > 0) {
      break;
    }
  }

  // 获取有任务的日期列表
  const dates = Object.keys(dailyStats).sort((a, b) => b.localeCompare(a));

  return {
    totalTasks,
    completedTasks,
    streak,
    last7Days,
    dates,
  };
}

export default async function HistoryPage() {
  const { totalTasks, completedTasks, streak, last7Days, dates } = await getHistoryData();

  return (
    <main className="min-h-screen text-slate-800 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-2xl">
        <DailyQuote />
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight">历史回顾</h1>
          <p className="text-xs text-slate-400">查看过去的完成情况和统计数据</p>
        </div>
        <TopNav current="history" />

        <HistoryClient 
          initialDates={dates}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          streak={streak}
          last7Days={last7Days}
        />
      </div>
    </main>
  );
}
