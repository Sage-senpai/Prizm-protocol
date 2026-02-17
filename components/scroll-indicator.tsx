'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 mt-16"
      animate={{ y: [0, 8, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <p className="text-white/50 text-sm font-medium">Scroll to explore</p>
      <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-center justify-center">
        <motion.div
          className="w-1 h-2 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.div>
  );
}
