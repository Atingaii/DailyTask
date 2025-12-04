"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

type DayData = {
  date: string;
  total: number;
  completed: number;
  mood?: string;
  tasks?: { id: string; title: string; isCompleted: boolean }[];
};

type Props = {
  data: Record<string, DayData>;
  onDayClick?: (date: string, dayData: DayData | null) => void;
};

// 获取过去一年的所有日期
function getLastYearDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  // 调整到周日开始
  oneYearAgo.setDate(oneYearAgo.getDate() - oneYearAgo.getDay());
  
  const current = new Date(oneYearAgo);
  while (current <= today) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

// 根据完成数量获取颜色强度
function getColorLevel(completed: number, total: number): number {
  if (total === 0) return 0;
  const rate = completed / total;
  if (rate === 0) return 0;
  if (rate < 0.25) return 1;
  if (rate < 0.5) return 2;
  if (rate < 0.75) return 3;
  if (rate < 1) return 4;
  return 5; // 100% 完成
}

// 颜色等级对应的样式
const colorClasses = [
  "bg-slate-100", // 0 - 无数据
  "bg-blue-100",  // 1
  "bg-blue-200",  // 2
  "bg-blue-400",  // 3
  "bg-blue-500",  // 4
  "bg-blue-600",  // 5 - 全部完成
];

const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

export function ContributionGraph({ data, onDayClick }: Props) {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  const dates = useMemo(() => getLastYearDates(), []);
  
  // 按周组织数据
  const weeks = useMemo(() => {
    const result: string[][] = [];
    let currentWeek: string[] = [];
    
    dates.forEach((date, i) => {
      const dayOfWeek = new Date(date).getDay();
      
      // 第一周可能不完整，填充空格
      if (i === 0 && dayOfWeek !== 0) {
        for (let j = 0; j < dayOfWeek; j++) {
          currentWeek.push("");
        }
      }
      
      currentWeek.push(date);
      
      if (dayOfWeek === 6) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // 最后一周
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    
    return result;
  }, [dates]);

  // 计算月份标签位置
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstValidDate = week.find(d => d);
      if (firstValidDate) {
        const month = new Date(firstValidDate).getMonth();
        if (month !== lastMonth) {
          labels.push({ month: months[month], weekIndex });
          lastMonth = month;
        }
      }
    });
    
    return labels;
  }, [weeks]);

  // 统计数据
  const stats = useMemo(() => {
    let totalCompleted = 0;
    let totalTasks = 0;
    let activeDays = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    
    // 按日期排序
    const sortedDates = Object.keys(data).sort();
    
    sortedDates.forEach(date => {
      const day = data[date];
      totalCompleted += day.completed;
      totalTasks += day.total;
      if (day.total > 0) activeDays++;
    });
    
    // 计算连续天数（从今天往回数）
    const today = new Date().toISOString().slice(0, 10);
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().slice(0, 10);
      const dayData = data[dateStr];
      
      if (dayData && dayData.completed > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return { totalCompleted, totalTasks, activeDays, currentStreak };
  }, [data]);

  const handleMouseEnter = (date: string, e: React.MouseEvent) => {
    setHoveredDay(date);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const handleClick = (date: string) => {
    if (onDayClick) {
      onDayClick(date, data[date] || null);
    }
  };

  return (
    <div className="bg-white/65 backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(31,38,135,0.1)] border border-white/50 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">📅 年度贡献图</h3>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>🔥 连续 {stats.currentStreak} 天</span>
          <span>✅ 完成 {stats.totalCompleted} 个任务</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        {/* 月份标签行 */}
        <div className="flex mb-1">
          <div className="w-6 flex-shrink-0"></div>
          <div className="flex">
            {weeks.map((week, weekIndex) => {
              const label = monthLabels.find(l => l.weekIndex === weekIndex);
              return (
                <div key={weekIndex} className="w-[14px] text-xs text-slate-400">
                  {label ? label.month : ""}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-[3px]">
          {/* 星期标签 */}
          <div className="flex flex-col gap-[3px] text-xs text-slate-400 flex-shrink-0 w-5">
            {weekdays.map((day, i) => (
              <div key={day} className="h-[11px] leading-[11px] text-right pr-1">
                {i % 2 === 1 ? day : ""}
              </div>
            ))}
          </div>

          {/* 格子图 */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((date, dayIndex) => {
                  if (!date) {
                    return <div key={`empty-${dayIndex}`} className="w-[11px] h-[11px]" />;
                  }
                  
                  const dayData = data[date];
                  const level = dayData 
                    ? getColorLevel(dayData.completed, dayData.total)
                    : 0;
                  const hasData = dayData && dayData.total > 0;
                  const isToday = date === new Date().toISOString().slice(0, 10);
                  
                  return (
                    <motion.div
                      key={date}
                      className={`w-[11px] h-[11px] rounded-sm cursor-pointer transition-all duration-200 ${colorClasses[level]} ${
                        isToday ? "ring-2 ring-blue-400 ring-offset-1" : ""
                      } ${hasData ? "hover:ring-2 hover:ring-slate-300" : ""}`}
                      whileHover={{ scale: 1.3 }}
                      onMouseEnter={(e) => handleMouseEnter(date, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(date)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-end gap-1 mt-3 text-xs text-slate-400">
        <span>少</span>
        {colorClasses.map((cls, i) => (
          <div key={i} className={`w-[11px] h-[11px] rounded-sm ${cls}`} />
        ))}
        <span>多</span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="fixed z-50 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg pointer-events-none"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 45,
              transform: "translateX(-50%)",
            }}
          >
            <div className="font-medium">{hoveredDay}</div>
            {data[hoveredDay] ? (
              <div className="text-slate-300">
                {data[hoveredDay].completed}/{data[hoveredDay].total} 已完成
                {data[hoveredDay].mood && ` ${data[hoveredDay].mood}`}
              </div>
            ) : (
              <div className="text-slate-400">无数据</div>
            )}
            <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-slate-800 transform -translate-x-1/2 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
