"use client";

import { useState } from "react";
import { NeumorphicCard } from "@/components/ui/NeumorphicCard";

type Props = {
  onAdd: (title: string) => Promise<void> | void;
  placeholder?: string;
};

export function TaskEditor({ onAdd, placeholder = "写下你最重要的一件事..." }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    try {
      await onAdd(value.trim());
      setValue("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NeumorphicCard className="p-3 sm:p-4 mt-4 sticky bottom-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 min-w-0"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-60 flex-shrink-0"
        >
          添加
        </button>
      </form>
    </NeumorphicCard>
  );
}
