import { NextRequest } from "next/server";

// Helper to create a mock NextRequest
function createRequest(body: object): NextRequest {
  return new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Mocking the environment variable — no real API key needed for testing
const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv };
  delete process.env.GROQ_API_KEY;
});
afterEach(() => {
  process.env = originalEnv;
});

describe("API /api/chat (built-in engine)", () => {
  it("should return 200 with a reply for a general message", async () => {
    const { POST } = await import("../app/api/chat/route");
    const req = createRequest({ messages: [{ role: "user", content: "Hello" }] });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("reply");
    expect(typeof json.reply).toBe("string");
    expect(json.reply.length).toBeGreaterThan(0);
  });

  it("should return quiz intro when 'test your knowledge' is sent", async () => {
    const { POST } = await import("../app/api/chat/route");
    const req = createRequest({
      messages: [{ role: "user", content: "Test Your Knowledge" }],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(json.reply).toContain("Welcome to the Election Knowledge Test");
  });

  it("should return live simulation content when 'simulate' is sent", async () => {
    const { POST } = await import("../app/api/chat/route");
    const req = createRequest({
      messages: [{ role: "user", content: "Simulate Live Results" }],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(json.reply).toContain("LIVE_VOTE_SIMULATION");
  });

  it("should return voter registration info when 'register' is sent", async () => {
    const { POST } = await import("../app/api/chat/route");
    const req = createRequest({
      messages: [{ role: "user", content: "How do I register to vote?" }],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(json.reply).toContain("Registration");
  });

  it("should return voting day info when 'voting' is sent", async () => {
    const { POST } = await import("../app/api/chat/route");
    const req = createRequest({
      messages: [{ role: "user", content: "Tell me about voting" }],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(json.reply).toContain("Voting Day");
  });

  it("should return US election info when 'united states' is mentioned", async () => {
    const { POST } = await import("../app/api/chat/route");
    const req = createRequest({
      messages: [{ role: "user", content: "Tell me about United States elections" }],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(json.reply).toContain("United States");
  });

  it("should handle empty message gracefully", async () => {
    const { POST } = await import("../app/api/chat/route");
    const req = createRequest({
      messages: [{ role: "user", content: "" }],
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("reply");
  });
});
