/**
 * @fileoverview Comprehensive unit tests for the Zustand chat state store.
 *
 * Tests all state management actions including message handling, typing indicator,
 * user preference settings, store reset, and quick-reply attachment integrity.
 *
 * Firebase Firestore calls are mocked to keep tests fast and offline.
 */

import { renderHook, act } from "@testing-library/react";
import { useChatStore } from "../store/chatStore";

// Mock Firebase to prevent real network calls in tests
jest.mock("../lib/firebase", () => ({
  logEventToFirestore: jest.fn().mockResolvedValue(undefined),
  logPageView: jest.fn(),
  analytics: null,
}));

// Reset Zustand store between tests for isolation
beforeEach(() => {
  useChatStore.getState().clearChat();
});

// ─── Initial State Tests ──────────────────────────────────────────────────────
describe("useChatStore — initial state", () => {
  it("starts with a welcome message", () => {
    const { result } = renderHook(() => useChatStore());
    expect(result.current.messages.length).toBeGreaterThanOrEqual(1);
    expect(result.current.messages[0].role).toBe("assistant");
  });

  it("has typing indicator off by default", () => {
    const { result } = renderHook(() => useChatStore());
    expect(result.current.isTyping).toBe(false);
  });

  it("has null user preferences by default", () => {
    const { result } = renderHook(() => useChatStore());
    expect(result.current.userLevel).toBeNull();
    expect(result.current.country).toBeNull();
    expect(result.current.currentTopic).toBeNull();
  });

  it("welcome message has quick reply options", () => {
    const { result } = renderHook(() => useChatStore());
    const welcome = result.current.messages[0];
    expect(welcome.quickReplies).toBeDefined();
    expect(welcome.quickReplies!.length).toBeGreaterThan(0);
  });
});

// ─── addMessage Tests ─────────────────────────────────────────────────────────
describe("useChatStore — addMessage", () => {
  it("adds a user message correctly", () => {
    const { result } = renderHook(() => useChatStore());
    const initialCount = result.current.messages.length;

    act(() => {
      result.current.addMessage({ role: "user", content: "Hello World" });
    });

    expect(result.current.messages).toHaveLength(initialCount + 1);
    const lastMsg = result.current.messages[result.current.messages.length - 1];
    expect(lastMsg.role).toBe("user");
    expect(lastMsg.content).toBe("Hello World");
  });

  it("adds an assistant message correctly", () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({ role: "assistant", content: "I can help with that!" });
    });

    const lastMsg = result.current.messages[result.current.messages.length - 1];
    expect(lastMsg.role).toBe("assistant");
    expect(lastMsg.content).toBe("I can help with that!");
  });

  it("auto-generates a unique id for each message", () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({ role: "user", content: "Message 1" });
      result.current.addMessage({ role: "user", content: "Message 2" });
      result.current.addMessage({ role: "user", content: "Message 3" });
    });

    const ids = result.current.messages.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("auto-generates a timestamp for each message", () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({ role: "user", content: "Time check" });
    });

    const lastMsg = result.current.messages[result.current.messages.length - 1];
    expect(lastMsg.timestamp).toBeDefined();
    expect(lastMsg.timestamp).toBeInstanceOf(Date);
    expect(lastMsg.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("preserves quickReplies in assistant messages", () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({
        role: "assistant",
        content: "Pick an option",
        quickReplies: [
          { label: "A) Option A", value: "Option A" },
          { label: "B) Option B", value: "Option B" },
        ],
      });
    });

    const lastMsg = result.current.messages[result.current.messages.length - 1];
    expect(lastMsg.quickReplies).toHaveLength(2);
    expect(lastMsg.quickReplies![0].value).toBe("Option A");
    expect(lastMsg.quickReplies![1].label).toBe("B) Option B");
  });

  it("appends messages in order", () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({ role: "user", content: "First" });
      result.current.addMessage({ role: "assistant", content: "Second" });
      result.current.addMessage({ role: "user", content: "Third" });
    });

    const msgs = result.current.messages;
    const userMsgs = msgs.filter((m) => m.role === "user");
    expect(userMsgs[0].content).toBe("First");
    expect(userMsgs[1].content).toBe("Third");
  });
});

// ─── Typing Indicator Tests ───────────────────────────────────────────────────
describe("useChatStore — setTyping", () => {
  it("sets typing indicator to true", () => {
    const { result } = renderHook(() => useChatStore());
    act(() => { result.current.setTyping(true); });
    expect(result.current.isTyping).toBe(true);
  });

  it("sets typing indicator back to false", () => {
    const { result } = renderHook(() => useChatStore());
    act(() => { result.current.setTyping(true); });
    act(() => { result.current.setTyping(false); });
    expect(result.current.isTyping).toBe(false);
  });
});

// ─── User Preference Tests ────────────────────────────────────────────────────
describe("useChatStore — user preferences", () => {
  it("sets userLevel correctly", () => {
    const { result } = renderHook(() => useChatStore());
    act(() => { result.current.setUserLevel("beginner"); });
    expect(result.current.userLevel).toBe("beginner");
  });

  it("sets country correctly", () => {
    const { result } = renderHook(() => useChatStore());
    act(() => { result.current.setCountry("India"); });
    expect(result.current.country).toBe("India");
  });

  it("sets currentTopic correctly", () => {
    const { result } = renderHook(() => useChatStore());
    act(() => { result.current.setCurrentTopic("voting"); });
    expect(result.current.currentTopic).toBe("voting");
  });

  it("allows updating preferences multiple times", () => {
    const { result } = renderHook(() => useChatStore());
    act(() => { result.current.setCountry("India"); });
    act(() => { result.current.setCountry("USA"); });
    expect(result.current.country).toBe("USA");
  });
});

// ─── clearChat Tests ──────────────────────────────────────────────────────────
describe("useChatStore — clearChat", () => {
  it("resets messages to only the welcome message", () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({ role: "user", content: "Test 1" });
      result.current.addMessage({ role: "assistant", content: "Reply 1" });
    });

    const countAfterAdding = result.current.messages.length;
    expect(countAfterAdding).toBeGreaterThan(1);

    act(() => { result.current.clearChat(); });

    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].role).toBe("assistant");
  });

  it("resets typing indicator to false", () => {
    const { result } = renderHook(() => useChatStore());
    act(() => { result.current.setTyping(true); });
    act(() => { result.current.clearChat(); });
    expect(result.current.isTyping).toBe(false);
  });

  it("resets all user preferences to null", () => {
    const { result } = renderHook(() => useChatStore());
    act(() => {
      result.current.setUserLevel("advanced");
      result.current.setCountry("UK");
      result.current.setCurrentTopic("results");
    });
    act(() => { result.current.clearChat(); });

    expect(result.current.userLevel).toBeNull();
    expect(result.current.country).toBeNull();
    expect(result.current.currentTopic).toBeNull();
  });
});
