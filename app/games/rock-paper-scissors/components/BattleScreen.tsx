"use client";

import { motion } from "framer-motion";

interface BattleScreenProps {
  userChoice: string | null;
  robotChoice: string | null;
  emojis: Record<string, string>;
}

export default function BattleScreen({
  userChoice,
  robotChoice,
  emojis,
}: BattleScreenProps) {
  return (
    <div className="relative flex min-h-[200px] items-center justify-between px-4 sm:min-h-[300px] sm:px-12">
      {userChoice && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative flex h-32 w-32 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 sm:h-48 sm:w-48"
        >
          <span className="transform text-6xl transition-transform duration-200 sm:text-7xl">
            {emojis[userChoice]}
          </span>
        </motion.div>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div className="text-xl font-medium text-neutral-400 dark:text-gray-300 sm:text-2xl">
            vs
          </div>
        </motion.div>
      </div>

      {robotChoice && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative flex h-32 w-32 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 sm:h-48 sm:w-48"
        >
          <span className="transform text-6xl transition-transform duration-200 sm:text-7xl">
            {emojis[robotChoice]}
          </span>
        </motion.div>
      )}
    </div>
  );
}
