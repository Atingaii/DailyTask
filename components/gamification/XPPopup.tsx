"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type XPPopupProps = {
  show: boolean;
  xp?: number;
  onComplete?: () => void;
};

export function XPPopup({ show, xp = 10, onComplete }: XPPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -30, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none z-10"
        >
          <span className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">
            +{xp} XP ✨
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
