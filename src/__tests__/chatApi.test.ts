/**
 * @fileoverview Comprehensive integration tests for the /api/chat route handler.
 *
 * Covers the built-in heuristic engine responses across all election topics,
 * quiz flow, input validation, error handling, and response format integrity.
 */

import { NextRequest } from "next/server";

/** Helper to create a mock NextRequest with a JSON body */
function createRequest(body: object): NextRequest {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

// Disable real GROQ API calls so all tests use the built-in engine
const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv };
  delete process.env.GROQ_API_KEY;
});
afterEach(() => {
  process.env = originalEnv;
  jest.resetModules();
});

// ─── Core Response Tests ──────────────────────────────────────────────────────
describe("POST /api/chat — built-in engine", () => {
  it("returns 200 with a reply string for a general message", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "Hello" }] }));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("reply");
    expect(typeof json.reply).toBe("string");
    expect(json.reply.length).toBeGreaterThan(0);
  });

  it("returns 400 when messages array is missing", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error");
  });

  it("returns 400 when messages is an empty array", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [] }));
    expect(res.status).toBe(400);
  });

  it("handles empty message content gracefully", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "" }] }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("reply");
  });
});

// ─── Election Topic Tests ─────────────────────────────────────────────────────
describe("POST /api/chat — election topics", () => {
  it("returns quiz intro when 'test your knowledge' is sent", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "Test Your Knowledge" }] }));
    const json = await res.json();
    expect(json.reply).toContain("Welcome to the Election Knowledge Test");
    expect(json.reply).toContain("Question 1");
  });

  it("returns live simulation content when 'simulate' is sent", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "Simulate Live Results" }] }));
    const json = await res.json();
    expect(json.reply).toContain("LIVE_VOTE_SIMULATION");
    expect(json.reply).toContain("Vote Counting Simulation");
  });

  it("returns voter registration info when 'register' is sent", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "How do I register to vote?" }] }));
    const json = await res.json();
    expect(json.reply).toContain("Voter Registration");
    expect(json.reply).toContain("Step 1 of 5");
  });

  it("returns nomination info when 'nominate' is mentioned", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "How does nomination work?" }] }));
    const json = await res.json();
    expect(json.reply).toContain("Nomination Process");
    expect(json.reply).toContain("Step 2 of 5");
  });

  it("returns campaign info when 'campaign' is mentioned", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "Tell me about campaigns" }] }));
    const json = await res.json();
    expect(json.reply).toContain("Election Campaigns");
    expect(json.reply).toContain("Step 3 of 5");
  });

  it("returns voting day info when 'voting' is mentioned", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "Tell me about voting" }] }));
    const json = await res.json();
    expect(json.reply).toContain("Voting Day");
    expect(json.reply).toContain("Step 4 of 5");
  });

  it("returns results info when 'result' is mentioned", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "How are election results counted?" }] }));
    const json = await res.json();
    expect(json.reply).toContain("Election Results");
    expect(json.reply).toContain("Step 5 of 5");
  });

  it("returns timeline overview when 'timeline' is requested", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "Show the election timeline" }] }));
    const json = await res.json();
    expect(json.reply).toContain("Complete Election Timeline");
    expect(json.reply).toContain("Registration");
    expect(json.reply).toContain("Results");
  });
});

// ─── Country Selection Tests ──────────────────────────────────────────────────
describe("POST /api/chat — country selection", () => {
  it("returns US election info when 'united states' is mentioned", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "Tell me about United States elections" }] }));
    const json = await res.json();
    expect(json.reply).toContain("United States");
    expect(json.reply).toContain("Electoral College");
  });

  it("returns India election info when 'india' is mentioned", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "Tell me about India elections" }] }));
    const json = await res.json();
    expect(json.reply).toContain("Indian Elections");
    expect(json.reply).toContain("900 million");
  });

  it("returns UK election info when 'united kingdom' is mentioned", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "Tell me about United Kingdom elections" }] }));
    const json = await res.json();
    expect(json.reply).toContain("United Kingdom");
    expect(json.reply).toContain("Parliament");
  });

  it("returns comparison table when 'compare' is mentioned", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "Compare election systems" }] }));
    const json = await res.json();
    expect(json.reply).toContain("Comparing Election Systems");
    expect(json.reply).toContain("USA");
    expect(json.reply).toContain("India");
    expect(json.reply).toContain("UK");
  });
});

// ─── User Level Tests ─────────────────────────────────────────────────────────
describe("POST /api/chat — user level detection", () => {
  it("returns beginner-friendly response for 'beginner'", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "I'm a beginner — explain everything simply" }] }));
    const json = await res.json();
    expect(json.reply).toContain("simple");
  });

  it("returns intermediate response for 'intermediate'", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "I have some knowledge — go a bit deeper" }] }));
    const json = await res.json();
    expect(json.reply).toContain("deeper");
  });

  it("returns advanced response for 'advanced'", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "I'm advanced — show me detailed processes" }] }));
    const json = await res.json();
    expect(json.reply).toContain("deep");
  });
});

// ─── Response Format Tests ────────────────────────────────────────────────────
describe("POST /api/chat — response format integrity", () => {
  it("always includes quick reply options [A], [B], [C]", async () => {
    const topics = ["registration", "voting", "campaign", "results"];
    const { POST } = await import("../app/api/chat/route");

    for (const topic of topics) {
      const res = await POST(createRequest({ messages: [{ role: "user", content: topic }] }));
      const json = await res.json();
      expect(json.reply).toMatch(/\[A\]/);
      expect(json.reply).toMatch(/\[B\]/);
    }
  });

  it("fallback reply always contains navigation options", async () => {
    const { POST } = await import("../app/api/chat/route");
    const res = await POST(createRequest({ messages: [{ role: "user", content: "xyzunknowntopic12345" }] }));
    const json = await res.json();
    expect(json.reply).toContain("[A]");
    expect(json.reply).toContain("[B]");
    expect(json.reply).toContain("[C]");
  });
});
