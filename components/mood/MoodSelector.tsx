"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type MoodType = {
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
};

const moods: MoodType[] = [
  { emoji: "☀️", label: "阳光明媚", color: "text-yellow-500", bgColor: "bg-yellow-50 hover:bg-yellow-100" },
  { emoji: "⛅", label: "多云转晴", color: "text-orange-400", bgColor: "bg-orange-50 hover:bg-orange-100" },
  { emoji: "☁️", label: "有点阴沉", color: "text-slate-400", bgColor: "bg-slate-50 hover:bg-slate-100" },
  { emoji: "🌧️", label: "心情低落", color: "text-blue-400", bgColor: "bg-blue-50 hover:bg-blue-100" },
  { emoji: "⚡", label: "暴风骤雨", color: "text-purple-500", bgColor: "bg-purple-50 hover:bg-purple-100" },
];

type Props = {
  currentMood?: string;
  onMoodSelect: (mood: string) => void;
  compact?: boolean;
};

export function MoodSelector({ currentMood, onMoodSelect, compact = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  const selectedMoodData = moods.find(m => m.emoji === currentMood);

  if (compact) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
            currentMood 
              ? `${selectedMoodData?.bgColor || 'bg-slate-50'}` 
              : 'bg-white/50 hover:bg-white/70'
          } border border-white/50 shadow-sm`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">{currentMood || "😊"}</span>
          <span className="text-xs text-slate-500">
            {currentMood ? selectedMoodData?.label : "记录心情"}
          </span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-full mt-2 left-0 z-50 bg-white/90 backdrop-blur-xl rounded-xl p-2 shadow-lg border border-white/50 flex gap-1"
              >
                {moods.map((mood) => (
                  <motion.button
                    key={mood.emoji}
                    onClick={() => {
                      onMoodSelect(mood.emoji);
                      setIsOpen(false);
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${mood.bgColor} ${
                      currentMood === mood.emoji ? 'ring-2 ring-blue-400' : ''
                    }`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setHoveredMood(mood.emoji)}
                    onMouseLeave={() => setHoveredMood(null)}
                  >
                    {mood.emoji}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="bg-white/65 backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(31,38,135,0.1)] border border-white/50">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">🌤️ 今日心情</h3>
      
      <div className="flex items-center justify-center gap-2">
        {moods.map((mood, i) => (
          <motion.button
            key={mood.emoji}
            onClick={() => onMoodSelect(mood.emoji)}
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${mood.bgColor} ${
              currentMood === mood.emoji 
                ? 'ring-2 ring-blue-400 shadow-md' 
                : 'opacity-70 hover:opacity-100'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredMood(mood.emoji)}
            onMouseLeave={() => setHoveredMood(null)}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className={`text-xs ${mood.color} font-medium`}>{mood.label}</span>
            
            {currentMood === mood.emoji && (
              <motion.div
                layoutId="mood-indicator"
                className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"
                initial={false}
                style={{ transform: 'translateX(-50%)' }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {hoveredMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-center"
          >
            <span className="text-xs text-slate-500">
              {moods.find(m => m.emoji === hoveredMood)?.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
