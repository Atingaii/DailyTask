"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  isCompleted: boolean;
};

type DayData = {
  date: string;
  total: number;
  completed: number;
  mood?: string;
  tasks?: Task[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  date: string | null;
  dayData: DayData | null;
};

const moodLabels: Record<string, string> = {
  "☀️": "阳光明媚",
  "⛅": "多云转晴", 
  "☁️": "有点阴沉",
  "🌧️": "心情低落",
  "⚡": "暴风骤雨",
};

export function DayDetailModal({ isOpen, onClose, date, dayData }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && date && !dayData?.tasks) {
      setLoading(true);
      fetch(`/api/tasks/by-date?date=${date}`)
        .then(res => res.json())
        .then(data => {
          setTasks(data.tasks || []);
        })
        .finally(() => setLoading(false));
    } else if (dayData?.tasks) {
      setTasks(dayData.tasks);
    }
  }, [isOpen, date, dayData]);

  if (!date) return null;

  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const completionRate = dayData && dayData.total > 0 
    ? Math.round((dayData.completed / dayData.total) * 100) 
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden mx-4">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{formattedDate}</h2>
                    {dayData?.mood && (
                      <div className="flex items-center gap-2 mt-1 text-white/80 text-sm">
                        <span className="text-lg">{dayData.mood}</span>
                        <span>{moodLabels[dayData.mood] || "心情记录"}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Stats */}
              {dayData && dayData.total > 0 && (
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-700">{dayData.completed}</div>
                        <div className="text-xs text-slate-400">已完成</div>
                      </div>
                      <div className="text-slate-300">/</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-700">{dayData.total}</div>
                        <div className="text-xs text-slate-400">总任务</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        completionRate === 100 ? 'text-green-500' : 
                        completionRate >= 50 ? 'text-blue-500' : 'text-orange-500'
                      }`}>
                        {completionRate}%
                      </div>
                      <div className="text-xs text-slate-400">完成率</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        completionRate === 100 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                          : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Task list */}
              <div className="px-5 py-4 max-h-64 overflow-y-auto">
                <h3 className="text-sm font-medium text-slate-500 mb-3">📝 任务列表</h3>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                    />
                  </div>
                ) : tasks.length > 0 ? (
                  <div className="space-y-2">
                    {tasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          task.isCompleted 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                          task.isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-slate-300'
                        }`}>
                          {task.isCompleted && '✓'}
                        </span>
                        <span className={task.isCompleted ? 'line-through opacity-70' : ''}>
                          {task.title}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <div className="text-3xl mb-2">📭</div>
                    <div className="text-sm">这一天没有任务记录</div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={onClose}
                  className="w-full py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
