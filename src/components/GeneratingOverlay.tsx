import React from 'react';
import { motion } from 'framer-motion';

interface GeneratingOverlayProps {
  isInitializing: boolean;
  prompt?: string;
}

const GeneratingOverlay: React.FC<GeneratingOverlayProps> = ({ prompt }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 4, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className="self-start"
    >
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 dark:from-orange-500/20 dark:to-pink-500/20 border border-orange-200/60 dark:border-orange-700/40 backdrop-blur-sm shadow-sm"
      >
      {/* Bouncing dots */}
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-orange-500"
            style={{ animation: `bounceDot 0.9s ease-in-out ${i * 0.18}s infinite` }}
          />
        ))}
      </div>

      <span className="text-[11px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
        Generating
      </span>

      {prompt && (
        <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
          · {prompt.slice(0, 40)}{prompt.length > 40 ? '…' : ''}
        </span>
      )}
      </motion.div>
    </motion.div>
  );
};

export default GeneratingOverlay;
