"use client";

import { motion } from "framer-motion";

interface ScoreBoardProps {
  userLives: number;
  robotLives: number;
  score: { user: number; robot: number };
  streak: number;
}

export default function ScoreBoard({
  userLives,
  robotLives,
  score,
  streak,
}: ScoreBoardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-base font-medium text-neutral-800 dark:text-gray-300 sm:text-xl">
            Player
          </h2>
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`user-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`h-3 w-3 rounded-full ${
                    i < userLives ? "bg-emerald-500" : "bg-neutral-200"
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <div className="text-xl font-semibold text-neutral-900 dark:text-gray-300 sm:text-2xl">
            {score.user}
          </div>
        </div>

        <div className="px-8 text-center">
          {streak > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 font-medium text-emerald-500"
            >
              {streak} Streak
            </motion.div>
          )}
          <div className="font-medium text-neutral-400 dark:text-gray-300">
            vs
          </div>
        </div>

        <div className="space-y-1 text-right sm:space-y-2">
          <h2 className="text-base font-medium text-neutral-800 dark:text-gray-300 sm:text-xl">
            Robot
          </h2>
          <div className="flex justify-end gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`robot-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`h-3 w-3 rounded-full ${
                    i < robotLives ? "bg-sky-500" : "bg-neutral-200"
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <div className="text-xl font-semibold text-neutral-900 dark:text-gray-300 sm:text-2xl">
            {score.robot}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
