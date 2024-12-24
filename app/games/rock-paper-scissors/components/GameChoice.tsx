'use client'

import { motion } from 'framer-motion'

interface GameChoiceProps {
  emoji: string
  onClick: () => void
  disabled: boolean
}

export default function GameChoice({ emoji, onClick, disabled }: GameChoiceProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative group ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="dark:bg-gray-800 border border-gray-100 dark:border-gray-700 dark:hover:border-gray-600 relative w-full aspect-square bg-white rounded-full shadow-sm transition-shadow hover:shadow-md flex items-center justify-center">
        <span className="text-5xl sm:text-6xl transform transition-transform duration-200 group-hover:scale-110">
          {emoji}
        </span>
      </div>
    </motion.button>
  )
}