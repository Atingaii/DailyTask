"use client";

import { motion } from "framer-motion";

// 成就定义
export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
  unlockedAt?: string;
};

// 所有成就列表
export const ACHIEVEMENTS: Omit<Achievement, "unlocked" | "unlockedAt">[] = [
  {
    id: "first_task",
    name: "初出茅庐",
    description: "完成第一个任务",
    icon: "🌱",
    condition: "complete_first_task",
  },
  {
    id: "streak_3",
    name: "三日之约",
    description: "连续打卡 3 天",
    icon: "🔥",
    condition: "streak_3",
  },
  {
    id: "streak_7",
    name: "坚持不懈",
    description: "连续打卡 7 天",
    icon: "💪",
    condition: "streak_7",
  },
  {
    id: "streak_30",
    name: "月度冠军",
    description: "连续打卡 30 天",
    icon: "👑",
    condition: "streak_30",
  },
  {
    id: "daily_10",
    name: "爆肝战士",
    description: "一天内完成 10 个任务",
    icon: "⚔️",
    condition: "daily_10",
  },
  {
    id: "daily_5",
    name: "效率达人",
    description: "一天内完成 5 个任务",
    icon: "🚀",
    condition: "daily_5",
  },
  {
    id: "night_owl",
    name: "守夜人",
    description: "在凌晨 2-4 点完成任务",
    icon: "🦉",
    condition: "night_owl",
  },
  {
    id: "early_bird",
    name: "早起鸟儿",
    description: "在早上 5-6 点完成任务",
    icon: "🐦",
    condition: "early_bird",
  },
  {
    id: "total_50",
    name: "半百任务",
    description: "累计完成 50 个任务",
    icon: "🎯",
    condition: "total_50",
  },
  {
    id: "total_100",
    name: "百战百胜",
    description: "累计完成 100 个任务",
    icon: "🏆",
    condition: "total_100",
  },
  {
    id: "weekend_warrior",
    name: "周末战士",
    description: "在周末完成任务",
    icon: "🎮",
    condition: "weekend_warrior",
  },
];

type BadgeProps = {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
};

export function Badge({ achievement, size = "md", showTooltip = true }: BadgeProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-lg",
    lg: "w-10 h-10 text-xl",
  };

  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${
          achievement.unlocked
            ? "bg-gradient-to-br from-yellow-100 to-orange-100 shadow-sm border border-yellow-200"
            : "bg-slate-100 grayscale opacity-40"
        }`}
      >
        <span className={achievement.unlocked ? "" : "opacity-50"}>
          {achievement.icon}
        </span>
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          <div className="font-medium">{achievement.name}</div>
          <div className="text-slate-300 text-[10px]">{achievement.description}</div>
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="text-yellow-400 text-[10px] mt-1">
              ✨ {achievement.unlockedAt} 获得
            </div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </motion.div>
  );
}

// 成就解锁弹窗
type AchievementUnlockProps = {
  achievement: Achievement | null;
  onClose: () => void;
};

export function AchievementUnlock({ achievement, onClose }: AchievementUnlockProps) {
  if (!achievement) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 20 }}
        className="bg-white rounded-2xl p-6 shadow-2xl text-center max-w-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="text-5xl mb-3"
        >
          {achievement.icon}
        </motion.div>
        <div className="text-xs text-yellow-600 font-medium mb-1">🎉 成就解锁！</div>
        <div className="text-lg font-bold text-slate-800 mb-1">{achievement.name}</div>
        <div className="text-sm text-slate-500 mb-4">{achievement.description}</div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow"
        >
          太棒了！
        </button>
      </motion.div>
    </motion.div>
  );
}

// 徽章展示栏（用于头部显示）
type BadgeBarProps = {
  achievements: Achievement[];
  maxShow?: number;
};

export function BadgeBar({ achievements, maxShow = 5 }: BadgeBarProps) {
  const unlocked = achievements.filter((a) => a.unlocked);
  const displayBadges = unlocked.slice(0, maxShow);
  const remaining = unlocked.length - maxShow;

  if (unlocked.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {displayBadges.map((achievement) => (
        <Badge key={achievement.id} achievement={achievement} size="sm" />
      ))}
      {remaining > 0 && (
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-medium">
          +{remaining}
        </div>
      )}
    </div>
  );
}
