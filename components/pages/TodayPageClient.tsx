"use client";

import { useState, useEffect, useRef } from "react";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskEditor } from "@/components/tasks/TaskEditor";
import { ProgressRing } from "@/components/tasks/ProgressRing";
import { Confetti } from "@/components/effects/Confetti";
import { MoodSelector } from "@/components/mood/MoodSelector";
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
      <div className="flex items-center justify-between mb-4">
        <MoodSelector 
          currentMood={todayMood} 
          onMoodSelect={handleMoodSelect}
          compact
        />
        <ProgressRing total={total} completed={completed} />
      </div>
      <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
      <TaskEditor onAdd={handleAdd} placeholder="写下你今天最重要的一件事..." />
    </div>
  );
}
