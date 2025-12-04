"use client";

import { motion } from "framer-motion";

type DayStat = {
  date: string;
  total: number;
  completed: number;
};

type Props = {
  data: DayStat[];
};

export function WeeklyChart({ data }: Props) {
  // 确保最小高度，没有任务时也显示基础高度
  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="bg-white/65 backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(31,38,135,0.1)] border border-white/50 mb-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">📊 最近7天完成情况</h3>
      
      <div className="flex items-end justify-between gap-3 h-40">
        {data.map((day, i) => {
          const hasTask = day.total > 0;
          const height = hasTask ? Math.max((day.total / maxTotal) * 100, 30) : 15;
          const completedHeight = hasTask ? (day.completed / day.total) * 100 : 0;
          const rate = hasTask ? Math.round((day.completed / day.total) * 100) : 0;
          const isComplete = rate === 100 && hasTask;
          
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div 
                className={`text-xs font-semibold ${isComplete ? 'text-green-500' : 'text-slate-500'}`}
                animate={isComplete ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {rate}%
              </motion.div>
              <div 
                className="w-full relative rounded-lg bg-white/40 overflow-hidden shadow-inner"
                style={{ height: `${height}%`, minHeight: '24px' }}
              >
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 rounded-lg ${
                    isComplete 
                      ? 'bg-gradient-to-t from-green-500 to-emerald-400' 
                      : 'bg-gradient-to-t from-blue-500 to-indigo-400'
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: `${completedHeight}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                />
                {isComplete && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {day.date.slice(5)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-blue-500 to-indigo-400" />
          <span>进行中</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-green-500 to-emerald-400" />
          <span>已完成</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white/40 shadow-inner" />
          <span>未完成</span>
        </div>
      </div>
    </div>
  );
}
