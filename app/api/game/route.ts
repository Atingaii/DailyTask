import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS } from "@/lib/achievements";

// 获取游戏进度
export async function GET() {
  try {
    // 目前使用单用户模式，获取第一个用户或创建默认用户
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: { displayName: "Player" },
      });
    }

    let progress = await prisma.gameProgress.findUnique({
      where: { userId: user.id },
    });

    if (!progress) {
      progress = await prisma.gameProgress.create({
        data: {
          userId: user.id,
          xp: 0,
          totalCompleted: 0,
          streak: 0,
          achievements: "{}",
          dailyCompleted: "{}",
          completedTaskIds: "[]",
        },
      });
    }

    // 从数据库统计实际完成的任务数
    const actualCompleted = await prisma.task.count({
      where: { isCompleted: true },
    });

    return NextResponse.json({
      xp: progress.xp,
      totalCompleted: actualCompleted, // 使用实际统计
      streak: progress.streak,
      lastActiveDate: progress.lastActiveDate?.toISOString().slice(0, 10) || null,
      achievements: JSON.parse(progress.achievements),
      dailyCompleted: JSON.parse(progress.dailyCompleted),
    });
  } catch (error) {
    console.error("Failed to get game progress:", error);
    return NextResponse.json({ error: "Failed to get game progress" }, { status: 500 });
  }
}

// 完成任务时更新游戏进度
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, taskId } = body;

    if (action !== "complete_task") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // 获取或创建用户
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { displayName: "Player" },
      });
    }

    // 获取或创建游戏进度
    let progress = await prisma.gameProgress.findUnique({
      where: { userId: user.id },
    });

    if (!progress) {
      progress = await prisma.gameProgress.create({
        data: {
          userId: user.id,
          xp: 0,
          totalCompleted: 0,
          streak: 0,
          achievements: "{}",
          dailyCompleted: "{}",
          completedTaskIds: "[]",
        },
      });
    }

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    // 解析现有数据
    const achievements: Record<string, { unlocked: boolean; unlockedAt: string }> = 
      JSON.parse(progress.achievements);
    const dailyCompleted: Record<string, number> = JSON.parse(progress.dailyCompleted);
    
    // 解析已完成的任务 ID 列表（防止重复计算）
    let completedTaskIds: string[] = [];
    try {
      completedTaskIds = JSON.parse((progress as any).completedTaskIds || "[]");
    } catch {
      completedTaskIds = [];
    }

    // 检查这个任务是否已经被计算过
    if (taskId && completedTaskIds.includes(taskId)) {
      // 已经计算过了，不重复加 XP
      return NextResponse.json({
        xpGained: 0,
        newXP: progress.xp,
        totalCompleted: progress.totalCompleted,
        streak: progress.streak,
        newAchievements: [],
        alreadyCounted: true,
      });
    }

    // 增加 XP
    const xpGained = 10;
    const newXP = progress.xp + xpGained;
    const newTotalCompleted = progress.totalCompleted + 1;

    // 记录这个任务已被计算
    if (taskId) {
      completedTaskIds.push(taskId);
    }

    // 更新当日完成数
    dailyCompleted[today] = (dailyCompleted[today] || 0) + 1;

    // 计算连续天数
    let newStreak = progress.streak;
    const lastActiveStr = progress.lastActiveDate?.toISOString().slice(0, 10);
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastActiveStr === yesterdayStr) {
      newStreak += 1;
    } else if (lastActiveStr !== today) {
      newStreak = 1;
    }

    // 检查成就
    const newAchievements: string[] = [];
    const todayFormatted = now.toLocaleDateString("zh-CN");

    const checkAchievement = (id: string) => {
      if (!achievements[id]?.unlocked) {
        achievements[id] = { unlocked: true, unlockedAt: todayFormatted };
        newAchievements.push(id);
      }
    };

    // 第一个任务
    if (newTotalCompleted === 1) checkAchievement("first_task");

    // 连续天数成就
    if (newStreak >= 3) checkAchievement("streak_3");
    if (newStreak >= 7) checkAchievement("streak_7");
    if (newStreak >= 30) checkAchievement("streak_30");

    // 当日完成数
    const todayCount = dailyCompleted[today] || 0;
    if (todayCount >= 5) checkAchievement("daily_5");
    if (todayCount >= 10) checkAchievement("daily_10");

    // 总完成数
    if (newTotalCompleted >= 50) checkAchievement("total_50");
    if (newTotalCompleted >= 100) checkAchievement("total_100");

    // 时间相关成就
    if (hour >= 2 && hour < 4) checkAchievement("night_owl");
    if (hour >= 5 && hour < 6) checkAchievement("early_bird");

    // 周末战士
    if (dayOfWeek === 0 || dayOfWeek === 6) checkAchievement("weekend_warrior");

    // 更新数据库
    await prisma.gameProgress.update({
      where: { userId: user.id },
      data: {
        xp: newXP,
        totalCompleted: newTotalCompleted,
        streak: newStreak,
        lastActiveDate: now,
        achievements: JSON.stringify(achievements),
        dailyCompleted: JSON.stringify(dailyCompleted),
        completedTaskIds: JSON.stringify(completedTaskIds),
      },
    });

    // 返回新解锁的成就详情
    const unlockedAchievements = newAchievements.map((id) => {
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      return def ? { ...def, unlocked: true, unlockedAt: todayFormatted } : null;
    }).filter(Boolean);

    return NextResponse.json({
      xpGained,
      newXP,
      totalCompleted: newTotalCompleted,
      streak: newStreak,
      newAchievements: unlockedAchievements,
    });
  } catch (error) {
    console.error("Failed to update game progress:", error);
    return NextResponse.json({ error: "Failed to update game progress" }, { status: 500 });
  }
}
