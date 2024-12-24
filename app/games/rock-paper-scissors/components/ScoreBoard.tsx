'use client'

import { motion } from 'framer-motion'

interface ScoreBoardProps {
  userLives: number
  robotLives: number
  score: { user: number; robot: number }
  streak: number
}

export default function ScoreBoard({ userLives, robotLives, score, streak }: ScoreBoardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dark:bg-gray-800 bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 dark:hover:border-gray-600"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-neutral-800 text-base sm:text-xl font-medium dark:text-gray-300">Player</h2>
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`user-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    i < userLives ? 'bg-emerald-500' : 'bg-neutral-200'
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-gray-300">{score.user}</div>
        </div>

        <div className="text-center px-8">
          {streak > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-500 font-medium mb-2"
            >
              {streak} Streak
            </motion.div>
          )}
          <div className="text-neutral-400 font-medium dark:text-gray-300">vs</div>
        </div>

        <div className="space-y-1 sm:space-y-2 text-right">
          <h2 className="text-neutral-800 text-base sm:text-xl font-medium dark:text-gray-300">Robot</h2>
          <div className="flex gap-1.5 justify-end">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`robot-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    i < robotLives ? 'bg-sky-500' : 'bg-neutral-200'
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-gray-300">{score.robot}</div>
        </div>
      </div>
    </motion.div>
  )
}

