"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const handleClick = () => onToggle(task.id, task.isCompleted);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 600);
  };

  return (
    <AnimatePresence mode="popLayout">
      {!isDeleting ? (
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ 
            scale: 0,
            rotate: 720,
            opacity: 0,
            filter: "blur(10px)",
            transition: { duration: 0.5, ease: [0.32, 0, 0.67, 0] }
          }}
          transition={{ duration: 0.25 }}
        >
          <NeumorphicCard
            className={`flex items-center justify-between px-4 py-3.5 mb-3 cursor-pointer transition-all duration-300 ${
              task.isCompleted ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/80" : ""
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
              className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
            >
              删除
            </motion.button>
          </NeumorphicCard>
        </motion.div>
      ) : (
        <motion.div
          key="deleting"
          className="relative mb-3 overflow-hidden"
          initial={{ height: "auto", opacity: 1 }}
          animate={{ 
            height: 0, 
            opacity: 0,
            scale: 0,
            rotateX: 90,
          }}
          transition={{ duration: 0.5, ease: [0.32, 0, 0.67, 0] }}
        >
          <div className="h-14 flex items-center justify-center">
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800"
              animate={{ 
                scale: [1, 0],
                rotate: [0, 360],
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
