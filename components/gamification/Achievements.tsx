"use client";

import { motion } from "framer-motion";
import { Achievement, ACHIEVEMENTS } from "@/lib/achievements";

// 重新导出供其他组件使用
export type { Achievement };
export { ACHIEVEMENTS };

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
