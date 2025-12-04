// 成就定义 - 可以在服务器端和客户端使用
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
