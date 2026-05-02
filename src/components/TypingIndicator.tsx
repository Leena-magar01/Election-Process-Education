"use client";

/**
 * TypingIndicator component — displays an animated "thinking" indicator
 * when the assistant is generating a response.
 *
 * Includes an aria-live announcement so screen readers inform users
 * that a response is being generated.
 *
 * @returns {JSX.Element} Animated typing dots with accessibility support
 */

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-3"
      role="status"
      aria-label="Assistant is typing a response"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chat-border flex items-center justify-center text-sm mr-2 mt-1" aria-hidden="true">
        🏛️
      </div>
      <div className="bubble-assistant flex items-center gap-1.5 px-5 py-4">
        <div className="typing-dot" aria-hidden="true" />
        <div className="typing-dot" aria-hidden="true" />
        <div className="typing-dot" aria-hidden="true" />
        <span className="sr-only">Assistant is typing...</span>
      </div>
    </motion.div>
  );
}
