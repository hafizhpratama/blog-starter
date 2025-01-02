'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'

type Emoji = '🍎' | '🍋' | '🍒' | '🎰' | '💎' | '7️⃣'
type WinningCombination = '🍎🍎🍎' | '🍋🍋🍋' | '🍒🍒🍒' | '🎰🎰🎰' | '💎💎💎' | '7️⃣7️⃣7️⃣';

const emojis: Emoji[] = ['🍎', '🍋', '🍒', '🎰', '💎', '7️⃣']
const INITIAL_BALANCE = 1000
const SPIN_COST = 50

const WINNING_COMBINATIONS = {
  '🍎🍎🍎': 200,
  '🍋🍋🍋': 300,
  '🍒🍒🍒': 400,
  '🎰🎰🎰': 500,
  '💎💎💎': 1000,
  '7️⃣7️⃣7️⃣': 2000,
}

const SYMBOL_HEIGHT = 100

function SlotReel({ 
  startSymbol,
  finalSymbol,
  isSpinning, 
  stopDelay 
}: { 
  startSymbol: Emoji
  finalSymbol: Emoji
  isSpinning: boolean
  stopDelay: number
}) {
  const generateReelSymbols = () => {
    const fullSetCount = 4;
    let symbols = [startSymbol];
    
    for (let i = 0; i < fullSetCount; i++) {
      symbols = [...symbols, ...emojis];
    }
    
    const finalIndex = emojis.indexOf(finalSymbol);
    if (finalIndex !== -1) {
      symbols = [...symbols, ...emojis.slice(0, finalIndex + 1)];
    }
    
    return symbols;
  };

  const reelSymbols = generateReelSymbols();
  const finalPosition = -(reelSymbols.length - 1) * SYMBOL_HEIGHT;

  return (
    <div 
      className="relative w-24 h-[100px] sm:w-32 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-neutral-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="absolute inset-0">
        <motion.div
          className="flex flex-col"
          initial={{ y: 0 }}
          animate={isSpinning ? {
            y: [0, finalPosition],
            transition: {
              duration: 2,
              ease: [0.45, 0.05, 0.55, 0.95],
              delay: stopDelay,
            }
          } : {
            y: 0,
            transition: {
              duration: 0
            }
          }}
        >
          {reelSymbols.map((symbol, i) => (
            <div
              key={i}
              className="h-[100px] w-24 sm:w-32 flex items-center justify-center text-5xl sm:text-6xl select-none"
              style={{ transform: 'translateZ(0)' }}
            >
              {symbol}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20 dark:from-white/10 dark:to-white/10" />
      </div>
    </div>
  )
}

function ScoreBoard({ balance, lastWin }: { balance: number; lastWin: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-between items-center px-6 py-4 rounded-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800 border border-neutral-200 dark:border-gray-700"
    >
      <div>
        <p className="text-sm text-neutral-500 dark:text-gray-400">Balance</p>
        <p className="text-2xl font-medium text-neutral-900 dark:text-white">{balance}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-neutral-500 dark:text-gray-400">Win</p>
        <p className="text-2xl font-medium text-neutral-900 dark:text-white">{lastWin || '-'}</p>
      </div>
    </motion.div>
  )
}

export default function SlotMachine() {
  const [mounted, setMounted] = useState(false)
  const [hasSpunOnce, setHasSpunOnce] = useState(false)
  const [startSymbols, setStartSymbols] = useState<Emoji[]>(['🍎', '🍎', '🍎'])
  const [finalSymbols, setFinalSymbols] = useState<Emoji[]>(['🍎', '🍎', '🍎'])
  const [balance, setBalance] = useState(INITIAL_BALANCE)
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWin, setLastWin] = useState(0)
  const [showWinPopup, setShowWinPopup] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  const triggerWinConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const checkWin = (symbols: Emoji[]): number => {
    const combination = symbols.join('') as WinningCombination;
    return WINNING_COMBINATIONS[combination] || 0;
  }

  const spin = async () => {
    if (balance < SPIN_COST || isSpinning) return
    
    setIsSpinning(true)
    setBalance(prev => prev - SPIN_COST)
    setLastWin(0)

    const results = Array.from({ length: 3 }, () => 
      emojis[Math.floor(Math.random() * emojis.length)]
    )
    setFinalSymbols(results)

    setTimeout(() => {
      setStartSymbols(results)
      setHasSpunOnce(true)

      const winAmount = checkWin(results)
      if (winAmount > 0) {
        setBalance(prev => prev + winAmount)
        setLastWin(winAmount)
        triggerWinConfetti()
      }

      setIsSpinning(false)
    }, 3500)
  }

  useEffect(() => {
    if (lastWin > 0) {
      setShowWinPopup(true);
      const timer = setTimeout(() => {
        setShowWinPopup(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastWin]);

  if (!mounted) return null

  return (
    <div className="w-full flex items-center justify-center pt-24 pb-16 px-4 sm:px-6">
      <div className="w-full max-w-lg space-y-8">
        <ScoreBoard balance={balance} lastWin={lastWin} />

        <div className="flex justify-between gap-3">
          {[0, 1, 2].map((index) => (
            <SlotReel
              key={index}
              startSymbol={hasSpunOnce ? startSymbols[index] : '🍎'}
              finalSymbol={finalSymbols[index]}
              isSpinning={isSpinning}
              stopDelay={index * 0.5}
            />
          ))}
        </div>

        <AnimatePresence>
          {showWinPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-full text-lg font-medium">
                +{lastWin}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <Button
            onClick={spin}
            disabled={isSpinning || balance < SPIN_COST}
            className={`w-full py-6 text-lg font-medium rounded-xl transition-colors
              ${isSpinning || balance < SPIN_COST
                ? 'bg-neutral-600 text-neutral-100 dark:bg-neutral-50 dark:text-neutral-600'
                : 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black'
              }`}
          >
            {isSpinning ? 'Spinning...' : `Spin (${SPIN_COST})`}
          </Button>
        </div>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full p-6 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-neutral-200 dark:border-gray-700"
          >
            <p className="text-sm text-neutral-500 dark:text-gray-400 mb-2">Prize</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(WINNING_COMBINATIONS).map(([combo, prize]) => (
                <motion.div
                  key={combo}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <span className="text-2xl">{combo}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {prize.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      coins
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
      </div>
    </div>
  )
}