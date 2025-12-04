import { prisma } from "@/lib/prisma";
import { tomorrow } from "@/lib/date";
import { DailyQuote } from "@/components/quotes/DailyQuote";
import { TopNav } from "@/components/layout/TopNav";
import TomorrowClient from "./TomorrowPageClient";

async function getTomorrowTasks() {
  const dateStr = tomorrow();
  const start = new Date(dateStr + "T00:00:00");
  const end = new Date(dateStr + "T23:59:59");

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
