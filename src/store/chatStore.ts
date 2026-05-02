/**
 * @fileoverview Zustand state management store for the Election Education chat interface.
 *
 * Manages the chat message history, typing indicator state, user preferences
 * (experience level, country), and current topic tracking. Integrates with
 * Firebase for real-time event logging.
 *
 * @module store/chatStore
 */

import { create } from "zustand";
import { logEventToFirestore } from "../lib/firebase";

/** Allowed roles for chat messages */
export type MessageRole = "user" | "assistant";

/** A quick-reply button option displayed after assistant messages */
export interface QuickReply {
  /** Display text shown on the button */
  label: string;
  /** Value sent as a user message when clicked */
  value: string;
}

/** A step in the election process timeline */
export interface TimelineStep {
  /** Unique identifier for the step */
  id: string;
  /** Human-readable title */
  title: string;
  /** Detailed description of this election phase */
  description: string;
  /** Educational context about why this step is important */
  whyItMatters: string;
  /** Current visual status in the timeline */
  status: "done" | "active" | "pending";
  /** Emoji icon representing the step */
  icon: string;
}

/** A single message in the chat conversation */
export interface ChatMessage {
  /** Unique message identifier */
  id: string;
  /** Whether the message is from the user or assistant */
  role: MessageRole;
  /** The text content of the message */
  content: string;
  /** When the message was created */
  timestamp: Date;
  /** Optional quick-reply buttons to display after this message */
  quickReplies?: QuickReply[];
  /** Optional timeline data embedded in the message */
  timeline?: TimelineStep[];
}

/**
 * Shape of the chat state managed by Zustand.
 * Includes all state values and action methods.
 */
interface ChatState {
  /** Array of all chat messages in chronological order */
  messages: ChatMessage[];
  /** Whether the assistant is currently generating a response */
  isTyping: boolean;
  /** User's self-reported experience level (beginner/intermediate/advanced) */
  userLevel: string | null;
  /** User's selected country for localized election content */
  country: string | null;
  /** The current election topic being discussed */
  currentTopic: string | null;

  /** Adds a new message to the chat history and logs it to Firebase */
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  /** Sets the typing indicator state */
  setTyping: (v: boolean) => void;
  /** Updates the user's experience level */
  setUserLevel: (level: string) => void;
  /** Updates the user's selected country */
  setCountry: (country: string) => void;
  /** Updates the current discussion topic */
  setCurrentTopic: (topic: string) => void;
  /** Resets the entire chat to its initial welcome state */
  clearChat: () => void;
}

/** Auto-incrementing counter for generating unique message IDs */
let msgCounter = 0;

/**
 * The initial welcome message displayed when the chat loads.
 * Includes quick-reply buttons for experience level selection.
 */
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

/**
 * Zustand store hook for managing the Election Education chat state.
 *
 * @example
 * ```tsx
 * const { messages, addMessage, isTyping } = useChatStore();
 * ```
 */
export const useChatStore = create<ChatState>((set) => ({
  messages: [WELCOME_MESSAGE],
  isTyping: false,
  userLevel: null,
  country: null,
  currentTopic: null,

  addMessage: (msg) => {
    // Log interaction to Firebase Analytics + Firestore in the background
    logEventToFirestore("chat_message_sent", {
      role: msg.role,
      contentLength: msg.content.length,
    });

    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: `msg-${++msgCounter}`, timestamp: new Date() },
      ],
    }));
  },

  setTyping: (isTyping) => set({ isTyping }),
  setUserLevel: (userLevel) => set({ userLevel }),
  setCountry: (country) => set({ country }),
  setCurrentTopic: (currentTopic) => set({ currentTopic }),
  clearChat: () =>
    set({
      messages: [WELCOME_MESSAGE],
      isTyping: false,
      userLevel: null,
      country: null,
      currentTopic: null,
    }),
}));
