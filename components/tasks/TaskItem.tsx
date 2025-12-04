"use client";

import { motion } from "framer-motion";
import { NeumorphicCard } from "@/components/ui/NeumorphicCard";

export type Task = {
  id: string;
  title: string;
  isCompleted: boolean;
};

type Props = {
  task: Task;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const handleClick = () => onToggle(task.id, task.isCompleted);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <NeumorphicCard
        className="flex items-center justify-between px-4 py-3 mb-3 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center"
            animate={
              task.isCompleted
                ? { scale: [1, 0.85, 1], backgroundColor: "#3b82f6", borderColor: "#3b82f6" }
                : { scale: 1, backgroundColor: "transparent", borderColor: "#cbd5e1" }
            }
            transition={{ duration: 0.25 }}
          >
            {task.isCompleted && (
              <motion.span className="w-2.5 h-2.5 bg-white rounded-full" layoutId="dot" />
            )}
          </motion.div>
          <div
            className={`text-sm ${
              task.isCompleted ? "line-through text-slate-400" : "text-slate-700"
            }`}
          >
            {task.title}
          </div>
        </div>
        <button
          className="text-xs text-slate-400 hover:text-red-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          删除
        </button>
      </NeumorphicCard>
    </motion.div>
  );
}
