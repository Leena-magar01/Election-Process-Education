"use client";

import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ChatMessage } from "@/store/chatStore";
import LiveVoteSimulation from "./LiveVoteSimulation";

interface Props {
  message: ChatMessage;
}

const MessageBubble = React.memo(function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chat-border flex items-center justify-center text-sm mr-2 mt-1">
          🏛️
        </div>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className={isUser ? "bubble-user" : "bubble-assistant"}>
          <div className="whitespace-pre-wrap">
            {renderContent(message.content)}
          </div>
        </div>
        <span suppressHydrationWarning className="text-[10px] text-slate-500 mt-1 px-2">
          {format(new Date(message.timestamp), "h:mm a")}
        </span>
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chat-user flex items-center justify-center text-sm ml-2 mt-1">
          👤
        </div>
      )}
    </motion.div>
  );
});

export default MessageBubble;

function renderContent(text: string) {
  // Simple markdown-like rendering
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.trim() === "[LIVE_VOTE_SIMULATION]") {
      return <LiveVoteSimulation key={i} />;
    }

    // Bold text
    let processed: React.ReactNode = line;
    const boldParts = line.split(/\*\*(.*?)\*\*/g);
    if (boldParts.length > 1) {
      processed = boldParts.map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-white font-semibold">{part}</strong>
        ) : (
          <span key={j}>{part}</span>
        )
      );
    }

    // Bullet points
    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      return (
        <div key={i} className="flex gap-2 ml-1 my-0.5">
          <span className="text-primary-400">•</span>
          <span>{typeof processed === "string" ? processed.replace(/^[-•]\s*/, "") : processed}</span>
        </div>
      );
    }

    // Table rows
    if (line.trim().startsWith("|")) {
      const cells = line.split("|").filter(c => c.trim() && !c.trim().match(/^[-:]+$/));
      if (cells.length > 0 && !line.includes("---")) {
        return (
          <div key={i} className="flex gap-3 text-xs py-0.5">
            {cells.map((cell, j) => (
              <span key={j} className="flex-1 truncate">{cell.trim()}</span>
            ))}
          </div>
        );
      }
      return null;
    }

    // Empty lines
    if (line.trim() === "") return <div key={i} className="h-2" />;

    return <div key={i}>{processed}</div>;
  });
}
