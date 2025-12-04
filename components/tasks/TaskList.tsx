"use client";

import { AnimatePresence } from "framer-motion";
import { TaskItem, type Task } from "./TaskItem";
import { Achievement } from "@/components/gamification/Achievements";

type Props = {
  tasks: Task[];
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onAchievement?: (achievement: Achievement) => void;
};

export function TaskList({ tasks, onToggle, onDelete, onAchievement }: Props) {
  if (!tasks.length) {
    return (
      <div className="text-sm text-slate-400 text-center mt-6">
        还没有任务，写下你想专注的第一件事吧。
      </div>
    );
  }

  return (
    <div className="mt-4">
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggle={onToggle} 
            onDelete={onDelete}
            onAchievement={onAchievement}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
