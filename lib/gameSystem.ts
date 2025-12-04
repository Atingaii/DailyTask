"use client";

import { ACHIEVEMENTS, Achievement } from "@/components/gamification/Achievements";

export type GameData = {
  xp: number;
  level: number;
  totalCompleted: number;
  achievements: Record<string, { unlocked: boolean; unlockedAt: string }>;
  dailyCompleted: Record<string, number>; // date -> count
  streak: number;
  lastActiveDate: string | null;
};

// XP 升级公式：每级需要更多 XP
export function xpForLevel(level: number): number {
  return level * 50; // 1级需要50, 2级需要100...
}

export function getLevel(xp: number): { level: number; currentXP: number; nextLevelXP: number } {
  let level = 1;
  let remainingXP = xp;
  
  while (remainingXP >= xpForLevel(level)) {
    remainingXP -= xpForLevel(level);
    level++;
  }
  
  return {
    level,
    currentXP: remainingXP,
    nextLevelXP: xpForLevel(level),
  };
}

// 从服务器获取游戏数据
export async function fetchGameData(): Promise<GameData> {
  try {
    const res = await fetch('/api/game');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return {
      xp: data.xp || 0,
      level: getLevel(data.xp || 0).level,
      totalCompleted: data.totalCompleted || 0,
      achievements: data.achievements || {},
      dailyCompleted: data.dailyCompleted || {},
      streak: data.streak || 0,
      lastActiveDate: data.lastActiveDate || null,
    };
  } catch {
    return createDefaultGameData();
  }
}

// 创建默认数据
function createDefaultGameData(): GameData {
  return {
    xp: 0,
    level: 1,
    totalCompleted: 0,
    achievements: {},
    dailyCompleted: {},
    streak: 0,
    lastActiveDate: null,
  };
}

// 完成任务时调用（异步版本，调用 API）
export async function completeTaskAsync(): Promise<{ 
  xpGained: number; 
  newAchievements: Achievement[];
  levelUp: boolean;
  newLevel: number;
}> {
  try {
    const res = await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete_task' }),
    });
    
    if (!res.ok) throw new Error('Failed to update');
    
    const data = await res.json();
    const oldLevel = getLevel(data.newXP - data.xpGained).level;
    const newLevel = getLevel(data.newXP).level;
    
    return {
      xpGained: data.xpGained,
      newAchievements: data.newAchievements || [],
      levelUp: newLevel > oldLevel,
      newLevel,
    };
  } catch {
    return {
      xpGained: 0,
      newAchievements: [],
      levelUp: false,
      newLevel: 1,
    };
  }
}

// 获取所有成就（包含解锁状态）- 异步版本
export async function getAllAchievementsAsync(): Promise<Achievement[]> {
  const data = await fetchGameData();
  
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: data.achievements[a.id]?.unlocked || false,
    unlockedAt: data.achievements[a.id]?.unlockedAt,
  }));
}

// 获取已解锁的成就
export async function getUnlockedAchievementsAsync(): Promise<Achievement[]> {
  const all = await getAllAchievementsAsync();
  return all.filter((a) => a.unlocked);
}
