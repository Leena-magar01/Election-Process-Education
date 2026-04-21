import { create } from "zustand";

export type MessageRole = "user" | "assistant";

export interface QuickReply {
  label: string;
  value: string;
}

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  status: "done" | "active" | "pending";
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
  timeline?: TimelineStep[];
}

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  userLevel: string | null;
  country: string | null;
  currentTopic: string | null;

  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setTyping: (v: boolean) => void;
  setUserLevel: (level: string) => void;
  setCountry: (country: string) => void;
  setCurrentTopic: (topic: string) => void;
  clearChat: () => void;
}

let msgCounter = 0;

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-0",
  role: "assistant",
  content:
    "👋 **Welcome to the Election Education Assistant!**\n\nI'm here to guide you through how elections work — from voter registration all the way to results day.\n\nLet's start! What's your experience level with elections?",
  timestamp: new Date(),
  quickReplies: [
    { label: "🌱 Beginner", value: "I'm a beginner — explain everything simply" },
    { label: "📚 Intermediate", value: "I have some knowledge — go a bit deeper" },
    { label: "🎓 Advanced", value: "I'm advanced — show me detailed processes" },
  ],
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [WELCOME_MESSAGE],
  isTyping: false,
  userLevel: null,
  country: null,
  currentTopic: null,

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: `msg-${++msgCounter}`, timestamp: new Date() },
      ],
    })),

  setTyping: (isTyping) => set({ isTyping }),
  setUserLevel: (userLevel) => set({ userLevel }),
  setCountry: (country) => set({ country }),
  setCurrentTopic: (currentTopic) => set({ currentTopic }),
  clearChat: () => set({ messages: [WELCOME_MESSAGE], isTyping: false, userLevel: null, country: null, currentTopic: null }),
}));
