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
  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">📊 最近7天完成情况</h3>
      
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((day, i) => {
          const height = (day.total / maxTotal) * 100;
          const completedHeight = day.total > 0 ? (day.completed / day.total) * height : 0;
          const rate = day.total > 0 ? Math.round((day.completed / day.total) * 100) : 0;
          
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs text-slate-500 font-medium">{rate}%</div>
              <div 
                className="w-full relative rounded-t-lg bg-slate-100 overflow-hidden"
                style={{ height: `${height}%`, minHeight: day.total > 0 ? '20px' : '4px' }}
              >
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-lg"
                  initial={{ height: 0 }}
                  animate={{ height: `${(completedHeight / height) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {day.date.slice(5)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-blue-500 to-indigo-400" />
          <span>已完成</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-100" />
          <span>未完成</span>
        </div>
      </div>
    </div>
  );
}
