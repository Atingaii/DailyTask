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

// 勾选图标 SVG
const CheckIcon = () => (
  <svg
    className="w-3 h-3 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    viewBox="0 0 24 24"
  >
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const handleClick = () => onToggle(task.id, task.isCompleted);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
    >
      <NeumorphicCard
        className={`flex items-center justify-between px-4 py-3.5 mb-3 cursor-pointer transition-all duration-300 ${
          task.isCompleted ? "bg-gradient-to-r from-blue-50 to-indigo-50" : ""
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              task.isCompleted
                ? "bg-gradient-to-br from-blue-500 to-indigo-500 border-transparent shadow-md shadow-blue-200"
                : "border-slate-300 hover:border-blue-400"
            }`}
            animate={
              task.isCompleted
                ? { scale: [1, 1.15, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
          >
            {task.isCompleted && <CheckIcon />}
          </motion.div>
          <motion.div
            className={`text-sm font-medium transition-colors duration-300 ${
              task.isCompleted ? "line-through text-slate-400" : "text-slate-700"
            }`}
            animate={{ opacity: task.isCompleted ? 0.7 : 1 }}
          >
            {task.title}
          </motion.div>
        </div>
        <motion.button
          className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          删除
        </motion.button>
      </NeumorphicCard>
    </motion.div>
  );
}
