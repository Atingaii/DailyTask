"use client";

import { useEffect, useState, useCallback } from "react";
import { TaskList } from "@/components/tasks/TaskList";
import { WeeklyChart } from "@/components/charts/WeeklyChart";
import { StatsCard } from "@/components/charts/StatsCard";
import { ContributionGraph } from "@/components/charts/ContributionGraph";
import { MoodChart } from "@/components/charts/MoodChart";
import { DayDetailModal } from "@/components/modals/DayDetailModal";

type DayStat = {
  date: string;
  total: number;
  completed: number;
};

type DayData = {
  date: string;
  total: number;
  completed: number;
  mood?: string;
  tasks?: { id: string; title: string; isCompleted: boolean }[];
};

type MoodData = {
  date: string;
  mood: string;
};

type Props = {
  initialDates: string[];
  totalTasks: number;
  completedTasks: number;
  streak: number;
  last7Days: DayStat[];
};

type Task = { id: string; title: string; isCompleted: boolean };

export default function HistoryClient({ 
  initialDates, 
  totalTasks, 
  completedTasks, 
  streak, 
  last7Days 
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialDates[0] ?? null
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // 热力图数据
  const [contributionData, setContributionData] = useState<Record<string, DayData>>({});
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  
  // 弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [modalDayData, setModalDayData] = useState<DayData | null>(null);

  // 加载热力图数据
  useEffect(() => {
    fetch('/api/contribution')
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setContributionData(data.data);
        }
      })
      .catch(console.error);
  }, []);

  // 加载心情数据
  useEffect(() => {
    fetch('/api/mood?days=365')
      .then(res => res.json())
      .then(data => {
        if (data.moods) {
          setMoodData(data.moods);
        }
      })
      .catch(console.error);
  }, []);

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

  // 热力图点击处理
  const handleDayClick = useCallback((date: string, dayData: DayData | null) => {
    setModalDate(date);
    setModalDayData(dayData ? { ...dayData, date } : { date, total: 0, completed: 0 });
    setModalOpen(true);
  }, []);

  return (
    <div className="mt-4">
      {/* 统计卡片 */}
      <StatsCard 
        totalTasks={totalTasks} 
        completedTasks={completedTasks} 
        streak={streak} 
      />

      {/* GitHub 风格热力图 */}
      <ContributionGraph 
        data={contributionData} 
        onDayClick={handleDayClick}
      />

      {/* 心情曲线图 */}
      <MoodChart data={moodData} />

      {/* 周统计图表 */}
      <WeeklyChart data={last7Days} />

      {/* 日期选择和任务列表 */}
      <div className="bg-white/65 backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(31,38,135,0.1)] border border-white/50">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">📅 按日期查看</h3>
        
        <div className="flex items-center gap-2 overflow-x-auto text-xs mb-4 pb-1">
          {initialDates.length > 0 ? (
            initialDates.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-200 ${
                  selectedDate === d
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200"
                    : "bg-white/50 text-slate-600 hover:bg-white/70"
                }`}
              >
                {d.slice(5)}
              </button>
            ))
          ) : (
            <p className="text-slate-400">暂无历史数据</p>
          )}
        </div>

        {selectedDate ? (
          <>
            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
              <span>📋</span>
              <span>{selectedDate} 的任务</span>
              <span className="ml-auto text-blue-500">
                {tasks.filter(t => t.isCompleted).length}/{tasks.length} 已完成
              </span>
            </p>
            <TaskList
              tasks={tasks}
              onToggle={() => {}}
              onDelete={() => {}}
            />
          </>
        ) : (
          <p className="text-sm text-slate-400 mt-4 text-center py-8">
            选择一个日期查看任务详情
          </p>
        )}
      </div>

      {/* 日期详情弹窗 */}
      <DayDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        date={modalDate}
        dayData={modalDayData}
      />
    </div>
  );
}
