"use client";

import { motion } from "framer-motion";

interface GameChoiceProps {
  emoji: string;
  onClick: () => void;
  disabled: boolean;
}

export default function GameChoice({
  emoji,
  onClick,
  disabled,
}: GameChoiceProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`group relative ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="relative flex aspect-square w-full items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
        <span className="transform text-5xl transition-transform duration-200 group-hover:scale-110 sm:text-6xl">
          {emoji}
        </span>
      </div>
    </motion.button>
  );
}
