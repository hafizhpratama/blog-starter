'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import GameChoice from './components/GameChoice'
import ScoreBoard from './components/ScoreBoard'
import BattleScreen from './components/BattleScreen'
import ResultOverlay from './components/ResultOverlay'

type Choice = 'rock' | 'paper' | 'scissors' | null

const choices: ('rock' | 'paper' | 'scissors')[] = ['rock', 'paper', 'scissors']

const emojis = {
    rock: '✊🏻',
    paper: '✋🏻',
    scissors: '✌🏻'
  } as const

const determineWinner = (user: Choice, robot: Choice): string => {
  if (user === robot) return "It's a tie!"
  if (
    (user === 'rock' && robot === 'scissors') ||
    (user === 'paper' && robot === 'rock') ||
    (user === 'scissors' && robot === 'paper')
  ) {
    return 'You win!'
  }
  return 'Robot wins!'
}

export default function RockPaperScissors() {
  const [mounted, setMounted] = useState(false)
  const [userChoice, setUserChoice] = useState<Choice>(null)
  const [robotChoice, setRobotChoice] = useState<Choice>(null)
  const [result, setResult] = useState<string | null>(null)
  const [userLives, setUserLives] = useState(5)
  const [robotLives, setRobotLives] = useState(5)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState({ user: 0, robot: 0 })
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleWin = () => {
    setRobotLives(prev => prev - 1)
    setScore(prev => ({ ...prev, user: prev.user + 1 }))
    setStreak(prev => prev + 1)
    triggerWinConfetti()
  }

  const handleLoss = () => {
    setUserLives(prev => prev - 1)
    setScore(prev => ({ ...prev, robot: prev.robot + 1 }))
    setStreak(0)
  }

  const resetChoices = () => {
    setUserChoice(null)
    setRobotChoice(null)
    setResult(null)
  }

  useEffect(() => {
    if (!userChoice || !robotChoice) return

    const outcome = determineWinner(userChoice, robotChoice)
    
    const resultTimer = setTimeout(() => {
      setResult(outcome)
      switch (outcome) {
        case 'You win!':
          handleWin()
          break
        case 'Robot wins!':
          handleLoss()
          break
      }
    }, 1000)

    const resetTimer = setTimeout(resetChoices, 3000)

    return () => {
      clearTimeout(resultTimer)
      clearTimeout(resetTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userChoice, robotChoice])

  useEffect(() => {
    if (userLives === 0 || robotLives === 0) {
      setGameOver(true)
      if (userLives > robotLives) {
        triggerVictoryConfetti()
      }
    }
  }, [userLives, robotLives])

  const triggerWinConfetti = () => {
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 50,
        spread: 30,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#14b8a6', '#0ea5e9']
      })
    }
  }

  const triggerVictoryConfetti = () => {
    if (typeof window !== 'undefined') {
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#22c55e', '#14b8a6', '#0ea5e9']
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#22c55e', '#14b8a6', '#0ea5e9']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }

  const handleUserChoice = (choice: Choice) => {
    setUserChoice(choice)
    setTimeout(() => {
      const randomChoice = choices[Math.floor(Math.random() * choices.length)]
      setRobotChoice(randomChoice)
    }, 500)
  }

  const resetGame = () => {
    setUserLives(5)
    setRobotLives(5)
    setGameOver(false)
    setUserChoice(null)
    setRobotChoice(null)
    setResult(null)
    setScore({ user: 0, robot: 0 })
    setStreak(0)
  }

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl space-y-8 mx-auto">
        <ScoreBoard
          userLives={userLives}
          robotLives={robotLives}
          score={score}
          streak={streak}
        />

        <div className="relative mt-8 md:mt-16">
          {!gameOver ? (
            <>
              {!userChoice && !robotChoice ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-3 gap-4 sm:gap-8"
                >
                {choices.map((choice) => (
                    <GameChoice
                        key={choice}
                        emoji={emojis[choice]}
                        onClick={() => handleUserChoice(choice)}
                        disabled={!!userChoice}
                    />
                ))}
                </motion.div>
              ) : (
                <BattleScreen
                    userChoice={userChoice}
                    robotChoice={robotChoice}
                    emojis={emojis}
                />
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="dark:text-gray-300 text-4xl font-bold text-neutral-800 mb-8"
              >
                {userLives > robotLives ? 'Victory!' : 'Game Over'}
              </motion.h2>
              <p className="text-xl text-neutral-600 mb-8 dark:text-gray-300">
                Final Score: You {score.user} - {score.robot} Robot
              </p>
              <Button
                onClick={resetGame}
                size="lg"
                variant="outline"
                className="dark:bg-white dark:text-black text-lg px-8 py-6"
              >
                Play Again
              </Button>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {result && !gameOver && <ResultOverlay result={result} />}
        </AnimatePresence>
      </div>
    </main>
  )
}