import { prisma } from "@/lib/prisma";
import { tomorrow } from "@/lib/date";
import { DailyQuote } from "@/components/quotes/DailyQuote";
import { TopNav } from "@/components/layout/TopNav";
import TomorrowClient from "./TomorrowPageClient";

// 禁用缓存，确保每次都获取最新数据
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getTomorrowTasks() {
  const dateStr = tomorrow();
  // 使用 UTC 时间查询，确保与数据库一致
  const start = new Date(dateStr + "T00:00:00.000Z");
  const end = new Date(dateStr + "T23:59:59.999Z");

  const tasks = await prisma.task.findMany({
    where: { taskDate: { gte: start, lte: end } },
    orderBy: { orderIndex: "asc" },
  });

  return tasks;
}

export default async function TomorrowPage() {
  const tasks = await getTomorrowTasks();

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-2xl">
        <DailyQuote />
        
        <div className="mb-4">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">明日计划</h1>
          <p className="text-xs text-slate-400">{tomorrow()} · 提前为明天排好优先级</p>
        </div>
        
        <TopNav current="tomorrow" />
        <TomorrowClient initialTasks={tasks} />
      </div>
    </main>
  );
}
