"use client";

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
          className="qr-btn disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {reply.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
