"use client";

import { useState } from "react";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskEditor } from "@/components/tasks/TaskEditor";
import { ProgressRing } from "@/components/tasks/ProgressRing";
import type { Task as DbTask } from "@prisma/client";

type Props = {
  initialTasks: DbTask[];
};

export default function TodayClient({ initialTasks }: Props) {
  const [tasks, setTasks] = useState(
    initialTasks.map((t) => ({ id: t.id, title: t.title, isCompleted: t.isCompleted }))
  );

  const completed = tasks.filter((t) => t.isCompleted).length;

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
      <div className="flex items-center justify-end mb-4">
        <ProgressRing total={tasks.length} completed={completed} />
      </div>
      <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
      <TaskEditor onAdd={handleAdd} placeholder="写下你今天最重要的一件事..." />
    </div>
  );
}
