"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-3"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chat-border flex items-center justify-center text-sm mr-2 mt-1">
        🏛️
      </div>
      <div className="bubble-assistant flex items-center gap-1.5 px-5 py-4">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </motion.div>
  );
}
