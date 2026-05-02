"use client";

/**
 * @fileoverview Main chat page for the Election Education Assistant.
 *
 * Renders the full chat UI including the message history, quick-reply buttons,
 * election timeline panel, sidebar navigation, and input area. Manages
 * communication with the /api/chat backend and integrates with Firebase
 * Analytics for tracking user engagement.
 *
 * @module app/page
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatStore, QuickReply } from "@/store/chatStore";
import { logPageView } from "@/lib/firebase";
import dynamic from "next/dynamic";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import QuickReplyButtons from "@/components/QuickReplyButtons";
import ChatInput from "@/components/ChatInput";

// Dynamically import heavy components to reduce initial bundle size
const ElectionTimeline = dynamic(() => import("@/components/ElectionTimeline"), { ssr: false });
const Sidebar = dynamic(() => import("@/components/Sidebar"), { ssr: false });

/**
 * Home page component — the primary Election Education chat interface.
 * Handles message sending, API communication, timeline state, and accessibility.
 *
 * @returns {JSX.Element} The full chat interface
 */
export default function Home() {
  const { messages, isTyping, addMessage, setTyping } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [activeStep, setActiveStep] = useState<string | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Log initial page view to Firebase Analytics
    logPageView("Election Education Chat");
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  /**
   * Parses [A]/[B]/[C] formatted options from assistant messages
   * into structured QuickReply objects for interactive buttons.
   *
   * @param {string} content - The assistant message text to parse
   * @returns {QuickReply[]} Array of parsed quick-reply options
   */
  const parseQuickReplies = (content: string): QuickReply[] => {
    const regex = /\[([A-C])\]\s*(.+)/g;
    const replies: QuickReply[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      replies.push({ label: `${match[1]}) ${match[2].trim()}`, value: match[2].trim() });
    }
    return replies;
  };

  /**
   * Detects which election timeline step is being discussed
   * and updates the active step indicator accordingly.
   *
   * @param {string} content - The assistant's reply text to analyze
   */
  const detectTimelineStep = useCallback((content: string) => {
    const lower = content.toLowerCase();
    if (lower.includes("registration") || lower.includes("register")) setActiveStep("registration");
    else if (lower.includes("nomination") || lower.includes("nominate")) setActiveStep("nomination");
    else if (lower.includes("campaign")) setActiveStep("campaign");
    else if (lower.includes("voting") || lower.includes("vote")) setActiveStep("voting");
    else if (lower.includes("result") || lower.includes("count")) setActiveStep("results");

    if (lower.includes("timeline") || lower.includes("full process")) {
      setShowTimeline(true);
    }
  }, []);

  /**
   * Handles sending a user message to the API and processing the response.
   * Manages typing indicators, error handling, and quick-reply parsing.
   *
   * @param {string} text - The user's message text
   */
  const handleSend = async (text: string) => {
    addMessage({ role: "user", content: text });
    setTyping(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      chatHistory.push({ role: "user", content: text });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "Sorry, something went wrong.";

      // Simulate natural typing delay for better UX
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

      const quickReplies = parseQuickReplies(reply);
      addMessage({
        role: "assistant",
        content: reply,
        quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
      });

      detectTimelineStep(reply);
    } catch {
      addMessage({
        role: "assistant",
        content: "⚠️ Something went wrong. Please try again!",
      });
    } finally {
      setTyping(false);
    }
  };

  // Last message quick replies
  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
  const lastQuickReplies = lastAssistantMsg?.quickReplies;

  if (!isMounted) return <div className="h-full bg-chat-bg" />; // Prevent hydration mismatch

  return (
    <div className="h-full flex flex-col bg-chat-bg relative overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onTopicSelect={handleSend}
      />

      {/* Header with app branding and timeline toggle */}
      <header
        className="relative z-10 border-b border-chat-border bg-chat-surface/80 backdrop-blur-xl"
        role="banner"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-xl bg-chat-bubble border border-chat-border flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
              id="sidebar-toggle"
              aria-label="Open topic sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="15" y2="12" />
                <line x1="3" y1="18" x2="18" y2="18" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-xl bg-chat-border flex items-center justify-center text-lg" role="img" aria-label="Election building icon">
              🏛️
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">
                Election Education Assistant
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" aria-hidden="true" />
                <span className="text-[11px] text-slate-500">Always online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTimeline((v) => !v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                showTimeline
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                  : "bg-chat-bubble border border-chat-border text-slate-400 hover:text-white hover:border-primary-500"
              }`}
              id="timeline-toggle"
              aria-label={showTimeline ? "Hide Election Timeline" : "Show Election Timeline"}
              aria-expanded={showTimeline}
              aria-controls="timeline-panel"
            >
              📊 Timeline
            </button>
          </div>
        </div>
      </header>

      {/* Timeline Panel */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            id="timeline-panel"
            role="region"
            aria-label="Election Process Timeline"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-chat-border"
          >
            <div className="max-w-3xl mx-auto px-4 py-4">
              <ElectionTimeline
                activeStepId={activeStep}
                onStepClick={(step) => {
                  handleSend(`Tell me about ${step.title} in the election process`);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area — the main chat content */}
      <main
        id="main-content"
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 relative z-10"
        aria-label="Chat conversation"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <div key={msg.id}>
              <MessageBubble message={msg} />
              {/* Show quick replies after the last assistant message */}
              {msg.role === "assistant" &&
                msg.quickReplies &&
                msg.id === lastAssistantMsg?.id && (
                  <QuickReplyButtons
                    replies={msg.quickReplies}
                    onSelect={handleSend}
                    disabled={isTyping}
                  />
                )}
            </div>
          ))}

          {/* Parsed quick replies from [A]/[B]/[C] in last message */}
          {lastAssistantMsg &&
            !lastQuickReplies &&
            parseQuickReplies(lastAssistantMsg.content).length > 0 && (
              <QuickReplyButtons
                replies={parseQuickReplies(lastAssistantMsg.content)}
                onSelect={handleSend}
                disabled={isTyping}
              />
            )}

          <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
        </div>
      </main>

      {/* Chat input area */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
