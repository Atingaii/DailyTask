"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type MoodData = {
  date: string;
  mood: string;
};

type Props = {
  data: MoodData[];
};

const moodValues: Record<string, number> = {
  "☀️": 5,
  "⛅": 4,
  "☁️": 3,
  "🌧️": 2,
  "⚡": 1,
};

const moodEmojis = ["⚡", "🌧️", "☁️", "⛅", "☀️"];

export function MoodChart({ data }: Props) {
  const chartData = useMemo(() => {
    // 获取最近14天
    const days: { date: string; mood: string | null; value: number }[] = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const moodEntry = data.find(m => m.date === dateStr);
      
      days.push({
        date: dateStr,
        mood: moodEntry?.mood || null,
        value: moodEntry ? (moodValues[moodEntry.mood] || 3) : 0,
      });
    }
    
    return days;
  }, [data]);

  // 计算心情统计
  const stats = useMemo(() => {
    const validMoods = data.filter(d => d.mood);
    const avgValue = validMoods.length > 0
      ? validMoods.reduce((sum, d) => sum + (moodValues[d.mood] || 3), 0) / validMoods.length
      : 0;
    
    const moodCounts: Record<string, number> = {};
    validMoods.forEach(d => {
      moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
    });
    
    const mostCommon = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    return {
      avgValue,
      avgMood: avgValue >= 4.5 ? "☀️" : avgValue >= 3.5 ? "⛅" : avgValue >= 2.5 ? "☁️" : avgValue >= 1.5 ? "🌧️" : "⚡",
      mostCommon: mostCommon ? mostCommon[0] : null,
      totalRecords: validMoods.length,
    };
  }, [data]);

  const maxValue = 5;
  const chartHeight = 120;

  return (
    <div className="bg-white/65 backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(31,38,135,0.1)] border border-white/50 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">🌤️ 心情气象站</h3>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {stats.totalRecords > 0 && (
            <>
              <span>平均 {stats.avgMood}</span>
              <span>·</span>
              <span>记录 {stats.totalRecords} 天</span>
            </>
          )}
        </div>
      </div>

      {/* Y轴标签 + 图表 */}
      <div className="flex gap-2">
        {/* Y轴 emoji 标签 */}
        <div className="flex flex-col justify-between h-[120px] text-sm">
          {moodEmojis.map((emoji) => (
            <div key={emoji} className="leading-none">{emoji}</div>
          ))}
        </div>

        {/* 图表区域 */}
        <div className="flex-1 relative">
          {/* 网格线 */}
          <div className="absolute inset-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute w-full border-t border-slate-100"
                style={{ top: `${(i / 5) * 100}%` }}
              />
            ))}
          </div>

          {/* 数据点和连线 */}
          <svg className="w-full h-[120px] relative z-10">
            {/* 连接线 */}
            <motion.path
              d={chartData.map((d, i) => {
                if (d.value === 0) return '';
                const x = (i / (chartData.length - 1)) * 100;
                const y = 100 - ((d.value / maxValue) * 100);
                
                // 找到前一个有效点
                let prevIndex = i - 1;
                while (prevIndex >= 0 && chartData[prevIndex].value === 0) {
                  prevIndex--;
                }
                
                if (prevIndex < 0) {
                  return `M ${x}% ${y}%`;
                }
                
                return `L ${x}% ${y}%`;
              }).join(' ')}
              fill="none"
              stroke="url(#moodGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            <defs>
              <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* 数据点 */}
            {chartData.map((d, i) => {
              if (d.value === 0) return null;
              const x = (i / (chartData.length - 1)) * 100;
              const y = 100 - ((d.value / maxValue) * 100);
              
              return (
                <motion.g key={d.date}>
                  <motion.circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill="white"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05, type: "spring" }}
                  />
                </motion.g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* X轴日期标签 */}
      <div className="flex justify-between mt-2 ml-8 text-xs text-slate-400">
        {chartData.filter((_, i) => i % 2 === 0).map((d) => (
          <span key={d.date}>{d.date.slice(5)}</span>
        ))}
      </div>

      {/* 底部统计 */}
      {stats.totalRecords > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>最常出现:</span>
            <span className="text-lg">{stats.mostCommon}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>平均心情:</span>
            <span className="text-lg">{stats.avgMood}</span>
            <span>({stats.avgValue.toFixed(1)}分)</span>
          </div>
        </div>
      )}

      {stats.totalRecords === 0 && (
        <div className="text-center py-4 text-slate-400 text-sm">
          还没有心情记录，开始记录你的每日心情吧！
        </div>
      )}
    </div>
  );
}
