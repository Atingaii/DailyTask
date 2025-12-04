"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ConfettiPiece = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
};

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#f43f5e", // rose
];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    rotation: Math.random() * 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 0.5,
  }));
}

export function Confetti({ trigger }: { trigger: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [show, setShow] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    // 只在 trigger 从 false 变成 true 时触发
    if (trigger && !triggeredRef.current) {
      triggeredRef.current = true;
      setPieces(generateConfetti(60));
      setShow(true);
      
      // 2.5秒后隐藏
      const timer = setTimeout(() => {
        setShow(false);
        triggeredRef.current = false;
      }, 2500);
      
      return () => clearTimeout(timer);
    }
    
    if (!trigger) {
      triggeredRef.current = false;
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* 彩色纸屑 */}
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                width: piece.size,
                height: piece.size * 0.6,
                backgroundColor: piece.color,
                borderRadius: "2px",
              }}
              initial={{
                y: piece.y,
                rotate: piece.rotation,
                opacity: 1,
              }}
              animate={{
                y: "100vh",
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0.5, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: [0.23, 1, 0.32, 1],
              }}
            />
          ))}
          
          {/* 中心庆祝 emoji */}
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2"
            initial={{ scale: 0, opacity: 0, y: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1, 0], y: -20 }}
            transition={{ duration: 2, times: [0, 0.2, 0.5, 1] }}
          >
            <div className="text-5xl sm:text-6xl">🎉</div>
          </motion.div>
          
          {/* 庆祝文字 */}
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.1, 1], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, times: [0, 0.15, 0.5, 1], delay: 0.1 }}
          >
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
              太棒了！
            </div>
            <div className="text-sm text-slate-600 mt-1 font-medium">
              今日任务全部完成！
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
