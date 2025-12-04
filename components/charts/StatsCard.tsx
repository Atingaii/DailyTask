"use client";

import { motion } from "framer-motion";

type Props = {
  totalTasks: number;
  completedTasks: number;
  streak: number;
};

export function StatsCard({ totalTasks, completedTasks, streak }: Props) {
  const rate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: "总任务数",
      value: totalTasks,
      icon: "📝",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "已完成",
      value: completedTasks,
      icon: "✅",
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "完成率",
      value: `${rate}%`,
      icon: "📈",
      color: "from-purple-500 to-indigo-600",
    },
    {
      label: "连续天数",
      value: streak,
      icon: "🔥",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center"
        >
          <div className="text-xl mb-1">{stat.icon}</div>
          <motion.div
            className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
          >
            {stat.value}
          </motion.div>
          <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
