"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskEditor } from "@/components/tasks/TaskEditor";
import { ProgressRing } from "@/components/tasks/ProgressRing";
import { Confetti } from "@/components/effects/Confetti";
import { MoodSelector } from "@/components/mood/MoodSelector";
import { UserLevel } from "@/components/gamification/UserLevel";
import { AchievementUnlock, Achievement } from "@/components/gamification/Achievements";
import type { Task as DbTask } from "@prisma/client";

type Props = {
  initialTasks: DbTask[];
};

export default function TodayClient({ initialTasks }: Props) {
  const [tasks, setTasks] = useState(
    initialTasks.map((t) => ({ id: t.id, title: t.title, isCompleted: t.isCompleted }))
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [todayMood, setTodayMood] = useState<string | undefined>();
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  const [userLevelKey, setUserLevelKey] = useState(0);
  const prevCompletedRef = useRef(0);

  const completed = tasks.filter((t) => t.isCompleted).length;
  const total = tasks.length;

  // 加载今日心情
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    fetch(`/api/mood?date=${today}`)
      .then(res => res.json())
      .then(data => {
        if (data.mood) {
          setTodayMood(data.mood.mood);
        }
      })
      .catch(console.error);
  }, []);

  // 检测是否刚刚达到100%完成
  useEffect(() => {
    const wasComplete = prevCompletedRef.current === total && total > 0;
    const isNowComplete = completed === total && total > 0;
    
    // 只有从未完成变成完成时才触发礼花
    if (!wasComplete && isNowComplete && prevCompletedRef.current < completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100);
    }
    
    prevCompletedRef.current = completed;
  }, [completed, total]);

  // 成就解锁回调
  const handleAchievement = useCallback((achievement: Achievement) => {
    setPendingAchievement(achievement);
    // 触发 UserLevel 更新
    setUserLevelKey(k => k + 1);
  }, []);

  const handleMoodSelect = async (mood: string) => {
    setTodayMood(mood);
    const today = new Date().toISOString().slice(0, 10);
    await fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today, mood }),
    });
  };

  const handleToggle = async (id: string, current: boolean) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !current } : t))
    );
    // 触发 UserLevel 更新（因为 XP 变了）
    if (!current) {
      setUserLevelKey(k => k + 1);
    }
    await fetch("/api/tasks/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isCompleted: !current }),
    });
  };

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch("/api/tasks/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const handleAdd = async (title: string) => {
    const res = await fetch("/api/tasks/add-today", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    const task = data.task as DbTask;
    setTasks((prev) => [...prev, { id: task.id, title: task.title, isCompleted: task.isCompleted }]);
  };

  return (
    <div>
      <Confetti trigger={showConfetti} />
      
      {/* 成就解锁弹窗 */}
      <AnimatePresence>
        {pendingAchievement && (
          <AchievementUnlock 
            achievement={pendingAchievement} 
            onClose={() => setPendingAchievement(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MoodSelector 
            currentMood={todayMood} 
            onMoodSelect={handleMoodSelect}
            compact
          />
          <UserLevel key={userLevelKey} />
        </div>
        <ProgressRing total={total} completed={completed} />
      </div>
      <TaskList 
        tasks={tasks} 
        onToggle={handleToggle} 
        onDelete={handleDelete}
        onAchievement={handleAchievement}
      />
      <TaskEditor onAdd={handleAdd} placeholder="写下你今天最重要的一件事..." />
    </div>
  );
}
