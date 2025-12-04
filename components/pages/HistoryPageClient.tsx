"use client";

import { useEffect, useState } from "react";
import { TaskList } from "@/components/tasks/TaskList";

type Props = {
  initialDates: string[];
};

type Task = { id: string; title: string; isCompleted: boolean };

export default function HistoryClient({ initialDates }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialDates[0] ?? null
  );
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!selectedDate) return;
    (async () => {
      const res = await fetch(`/api/tasks/by-date?date=${selectedDate}`);
      const data = await res.json();
      const list = (data.tasks as any[]).map((t) => ({
        id: t.id,
        title: t.title,
        isCompleted: t.isCompleted,
      }));
      setTasks(list);
    })();
  }, [selectedDate]);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 overflow-x-auto text-xs mb-3 pb-1">
        {initialDates.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            className={`px-3 py-1.5 rounded-2xl border text-xs whitespace-nowrap transition-colors ${
              selectedDate === d
                ? "bg-slate-800 text-slate-50 border-slate-800"
                : "border-slate-200 text-slate-500 hover:bg-slate-200/60"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {selectedDate ? (
        <>
          <p className="text-xs text-slate-400 mb-1">{selectedDate} 的任务</p>
          <TaskList
            tasks={tasks}
            onToggle={() => {}}
            onDelete={() => {}}
          />
        </>
      ) : (
        <p className="text-sm text-slate-400 mt-4 text-center">
          暂时没有历史记录。
        </p>
      )}
    </div>
  );
}
