"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TOPIC_SUGGESTIONS } from "@/lib/electionData";
import { useChatStore } from "@/store/chatStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTopicSelect: (value: string) => void;
}

export default function Sidebar({ isOpen, onClose, onTopicSelect }: Props) {
  const clearChat = useChatStore((s) => s.clearChat);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar panel */}
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-chat-surface border-r border-chat-border z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-chat-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-chat-border flex items-center justify-center">
                    🏛️
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Election Guide</h2>
                    <p className="text-[10px] text-slate-500">AI-Powered</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-chat-bubble flex items-center justify-center text-slate-400 hover:text-white hover:bg-chat-border transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Topics */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Quick Topics
              </p>
              <div className="space-y-1.5">
                {TOPIC_SUGGESTIONS.map((topic, idx) => (
                  <motion.button
                    key={topic.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => {
                      onTopicSelect(topic.value);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-primary-600/20 hover:text-primary-300 transition-all duration-150 flex items-center gap-2"
                  >
                    {topic.label}
                  </motion.button>
                ))}
              </div>

              {/* Election facts */}
              <div className="mt-6 p-4 rounded-xl bg-chat-bubble border border-chat-border">
                <p className="text-xs font-semibold text-primary-400 mb-2">💡 Did you know?</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  India conducts the world&apos;s largest election with over 900 million eligible voters and 1 million polling stations!
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-chat-border">
              <button
                onClick={() => {
                  clearChat();
                  onClose();
                }}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 flex items-center justify-center gap-2"
              >
                🗑️ Clear Chat
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
