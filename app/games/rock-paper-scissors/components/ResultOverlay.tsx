"use client";

import { motion } from "framer-motion";

interface ResultOverlayProps {
  result: string;
}

export default function ResultOverlay({ result }: ResultOverlayProps) {
  const getResultColor = (result: string) => {
    switch (result) {
      case "You win!":
        return "bg-emerald-500";
      case "Robot wins!":
        return "bg-sky-500";
      default:
        return "bg-neutral-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="pointer-events-none fixed inset-0 flex items-center justify-center"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className={`${getResultColor(
          result
        )} rounded-full px-8 py-4 text-2xl font-medium text-white shadow-lg`}
      >
        {result}
      </motion.div>
    </motion.div>
  );
}
