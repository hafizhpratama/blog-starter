'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

type Emoji = '🍎' | '🍋' | '🍒' | '🎰' | '💎' | '7️⃣';
type Slot = Emoji | null;

const emojis: Emoji[] = ['🍎', '🍋', '🍒', '🎰', '💎', '7️⃣'];
const INITIAL_BALANCE = 1000;
const SPIN_COST = 50;

interface WinningCombinations {
  [key: string]: number;
}

const WINNING_COMBINATIONS: WinningCombinations = {
  '🍎🍎🍎': 200,
  '🍋🍋🍋': 300,
  '🍒🍒🍒': 400,
  '🎰🎰🎰': 500,
  '💎💎💎': 1000,
  '7️⃣7️⃣7️⃣': 2000,
};

interface ScoreDisplayProps {
  balance: number;
  lastWin: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ balance, lastWin }) => (
  <div className="grid grid-cols-2 gap-6 mb-12">
    <div className="text-center p-6 rounded-2xl bg-white shadow-sm">
      <p className="text-sm font-medium text-neutral-500 mb-1">Balance</p>
      <p className="text-3xl font-semibold text-neutral-900">💰 {balance}</p>
    </div>
    <div className="text-center p-6 rounded-2xl bg-white shadow-sm">
      <p className="text-sm font-medium text-neutral-500 mb-1">Last Win</p>
      <p className="text-3xl font-semibold text-neutral-900">🏆 {lastWin || 0}</p>
    </div>
  </div>
);

const SlotMachine: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [slots, setSlots] = useState<Emoji[]>(['🎰', '🎰', '🎰']);
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<number>(0);
  const [message, setMessage] = useState<string>('Ready to spin? 🎲');

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerWinConfetti = (): void => {
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ['#22c55e', '#14b8a6', '#0ea5e9'];

    const frame = (): void => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const checkWin = (currentSlots: Emoji[]): number => {
    const combination = currentSlots.join('');
    return WINNING_COMBINATIONS[combination] || 0;
  };

  const spin = (): void => {
    if (balance < SPIN_COST) {
      setMessage('Insufficient credits! 💔');
      return;
    }
    
    setIsSpinning(true);
    setBalance(prev => prev - SPIN_COST);
    setMessage('Spinning... 🎲');

    const spinDuration = 2000;
    const intervals = 10;
    let count = 0;

    const spinInterval = setInterval(() => {
      setSlots(slots.map(() => emojis[Math.floor(Math.random() * emojis.length)]));
      count++;

      if (count >= intervals) {
        clearInterval(spinInterval);
        const finalSlots = slots.map(() => emojis[Math.floor(Math.random() * emojis.length)]);
        setSlots(finalSlots);
        const winAmount = checkWin(finalSlots);
        
        if (winAmount > 0) {
          setBalance(prev => prev + winAmount);
          setLastWin(winAmount);
          setMessage(`Jackpot! ${winAmount} credits! 🎉`);
          triggerWinConfetti();
        } else {
          setLastWin(0);
          setMessage('Try again! 🎲');
        }
        
        setIsSpinning(false);
      }
    }, spinDuration / intervals);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-neutral-50">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <ScoreDisplay balance={balance} lastWin={lastWin} />

        <div className="relative">
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mb-12">
            {slots.map((emoji, index) => (
              <motion.div
                key={index}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-2xl flex items-center justify-center text-4xl sm:text-5xl md:text-6xl shadow-sm"
                animate={{
                  scale: isSpinning ? [1, 1.1, 1] : 1,
                  rotateX: isSpinning ? [0, 360] : 0,
                }}
                transition={{
                  duration: 0.3,
                  repeat: isSpinning ? Infinity : 0,
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mb-8"
            animate={{ scale: lastWin > 0 ? [1, 1.1, 1] : 1 }}
          >
            <p className="text-lg sm:text-xl font-medium text-neutral-600 mb-2">{message}</p>
            {lastWin > 0 && (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl sm:text-3xl font-bold text-green-500"
              >
                +{lastWin} 💰
              </motion.p>
            )}
          </motion.div>

          <Button
            onClick={spin}
            disabled={isSpinning || balance < SPIN_COST}
            size="lg"
            className={`w-full py-6 text-lg font-medium rounded-xl transition-colors ${
              isSpinning || balance < SPIN_COST
                ? 'bg-neutral-200 text-neutral-400'
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            {isSpinning ? 'Spinning...' : `Spin (${SPIN_COST} credits)`}
          </Button>

          <motion.div 
            className="mt-12 p-6 rounded-2xl bg-white shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Winning Combinations</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(WINNING_COMBINATIONS).map(([combo, prize]) => (
                <div key={combo} className="flex justify-between items-center text-neutral-600">
                  <span className="text-lg">{combo}</span>
                  <span className="font-medium">{prize} 💰</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default SlotMachine;