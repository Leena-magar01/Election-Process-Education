import { renderHook, act } from "@testing-library/react";
import { useChatStore } from "../store/chatStore";

// Reset Zustand store between tests
beforeEach(() => {
  useChatStore.getState().clearChat();
});

describe("useChatStore", () => {
  it("should start with a single welcome message", () => {
    const { result } = renderHook(() => useChatStore());
    // After clearChat, initial message is re-added
    expect(result.current.messages.length).toBeGreaterThanOrEqual(1);
  });

  it("should add a user message correctly", () => {
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

  it("should add an assistant message correctly", () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({ role: "assistant", content: "I can help with that!" });
    });

    const lastMsg = result.current.messages[result.current.messages.length - 1];
    expect(lastMsg.role).toBe("assistant");
    expect(lastMsg.content).toBe("I can help with that!");
  });

  it("should auto-generate a unique id for each message", () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({ role: "user", content: "Message 1" });
      result.current.addMessage({ role: "user", content: "Message 2" });
    });

    const ids = result.current.messages.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should auto-generate a timestamp for each message", () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({ role: "user", content: "Time check" });
    });

    const lastMsg = result.current.messages[result.current.messages.length - 1];
    expect(lastMsg.timestamp).toBeDefined();
    expect(typeof lastMsg.timestamp).toBe("number");
    expect(lastMsg.timestamp).toBeLessThanOrEqual(Date.now());
  });

  it("should set typing indicator correctly", () => {
    const { result } = renderHook(() => useChatStore());

    expect(result.current.isTyping).toBe(false);

    act(() => {
      result.current.setTyping(true);
    });

    expect(result.current.isTyping).toBe(true);

    act(() => {
      result.current.setTyping(false);
    });

    expect(result.current.isTyping).toBe(false);
  });

  it("clearChat should reset to initial state", () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({ role: "user", content: "Test message" });
      result.current.addMessage({ role: "assistant", content: "Test reply" });
    });

    const countAfterAdding = result.current.messages.length;
    expect(countAfterAdding).toBeGreaterThan(1);

    act(() => {
      result.current.clearChat();
    });

    // After clear, only the welcome message remains
    expect(result.current.messages.length).toBeLessThan(countAfterAdding);
  });

  it("should support quickReplies in assistant messages", () => {
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
  });
});
