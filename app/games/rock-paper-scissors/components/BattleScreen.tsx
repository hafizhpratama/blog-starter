'use client'

import { motion } from 'framer-motion'

interface BattleScreenProps {
  userChoice: string | null
  robotChoice: string | null
  emojis: Record<string, string>
}

export default function BattleScreen({ userChoice, robotChoice, emojis }: BattleScreenProps) {
  return (
    <div className="relative flex justify-between items-center min-h-[200px] sm:min-h-[300px] px-4 sm:px-12">
      {userChoice && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-full shadow-sm flex items-center justify-center"
        >
          <span className="text-6xl sm:text-7xl transform transition-transform duration-200">
            {emojis[userChoice]}
          </span>
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="text-xl sm:text-2xl font-medium text-neutral-400">vs</div>
      </motion.div>

      {robotChoice && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-full shadow-sm flex items-center justify-center"
        >
          <span className="text-6xl sm:text-7xl transform transition-transform duration-200">
            {emojis[robotChoice]}
          </span>
        </motion.div>
      )}
    </div>
  )
}