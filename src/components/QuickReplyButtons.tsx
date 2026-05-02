"use client";

/**
 * QuickReplyButtons component — renders interactive suggestion buttons
 * that users can click to quickly send predefined messages.
 *
 * Used after assistant messages to provide guided conversation flow.
 *
 * @param {Object} props
 * @param {QuickReply[]} props.replies - Array of quick reply options
 * @param {Function} props.onSelect - Callback when a reply is selected
 * @param {boolean} [props.disabled] - Whether buttons are disabled (e.g., while typing)
 * @returns {JSX.Element} A row of animated, accessible quick-reply buttons
 */

import { motion } from "framer-motion";
import { QuickReply } from "@/store/chatStore";

interface Props {
  replies: QuickReply[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export default function QuickReplyButtons({ replies, onSelect, disabled }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="flex flex-wrap gap-2 mb-3 ml-10"
      role="group"
      aria-label="Quick reply options"
    >
      {replies.map((reply, idx) => (
        <motion.button
          key={reply.value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * idx + 0.2 }}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => !disabled && onSelect(reply.value)}
          disabled={disabled}
          className="qr-btn disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label={`Select: ${reply.label}`}
        >
          {reply.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
