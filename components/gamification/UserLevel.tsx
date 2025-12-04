"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchGameData, getLevel, getAllAchievementsAsync } from "@/lib/gameSystem";
import { BadgeBar, Achievement } from "@/components/gamification/Achievements";

type Props = {
  className?: string;
};

export function UserLevel({ className = "" }: Props) {
  const [mounted, setMounted] = useState(false);
  const [xp, setXp] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setMounted(true);
    // 从服务器获取数据
    fetchGameData().then((data) => {
      setXp(data.xp);
    });
    getAllAchievementsAsync().then(setAchievements);
  }, []);

  if (!mounted) return null;

  const { level, currentXP, nextLevelXP } = getLevel(xp);
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 等级徽章 */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-white font-bold text-sm">Lv.{level}</span>
        </div>
        {/* XP 进度环 */}
        <svg
          className="absolute inset-0 w-10 h-10 -rotate-90"
          viewBox="0 0 36 36"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${progress}, 100`}
            initial={{ strokeDasharray: "0, 100" }}
            animate={{ strokeDasharray: `${progress}, 100` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* 徽章展示 */}
      <BadgeBar achievements={achievements} maxShow={4} />
    </div>
  );
}
