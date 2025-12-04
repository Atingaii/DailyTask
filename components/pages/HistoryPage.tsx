import { prisma } from "@/lib/prisma";
import { DailyQuote } from "@/components/quotes/DailyQuote";
import { TopNav } from "@/components/layout/TopNav";
import HistoryClient from "./HistoryPageClient";

export default async function HistoryPage() {
  const latestTasks = await prisma.task.findMany({
    orderBy: { taskDate: "desc" },
    take: 20,
  });

  const dates = Array.from(
    new Set(latestTasks.map((t) => t.taskDate.toISOString().slice(0, 10)))
  );

  return (
    <main className="min-h-screen bg-[var(--bg-soft)] text-slate-800 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-2xl">
        <DailyQuote />
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight">历史回顾</h1>
          <p className="text-xs text-slate-400">查看过去某天的完成情况</p>
        </div>
        <TopNav current="history" />

        <HistoryClient initialDates={dates} />
      </div>
    </main>
  );
}
