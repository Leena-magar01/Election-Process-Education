/**
 * @fileoverview Comprehensive tests for the Google Cloud integration utilities.
 * Tests cloudLog, toBigQueryRecord, and VERTEX_AI_CONFIG.
 */

import { cloudLog, toBigQueryRecord, VERTEX_AI_CONFIG } from "../lib/googleCloud";

describe("cloudLog", () => {
  let stdoutSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    delete process.env.K_SERVICE;
  });

  it("should write structured JSON to stdout when running on Cloud Run", () => {
    process.env.K_SERVICE = "election-education-assistant";
    cloudLog("INFO", "Test message", { key: "value" });
    expect(stdoutSpy).toHaveBeenCalledTimes(1);
    const written = stdoutSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(written.trim());
    expect(parsed.severity).toBe("INFO");
    expect(parsed.message).toBe("Test message");
    expect(parsed.metadata).toEqual({ key: "value" });
    expect(parsed.serviceContext.service).toBe("election-education-assistant");
    expect(parsed.timestamp).toBeDefined();
  });

  it("should call console.error for ERROR severity in local dev", () => {
    cloudLog("ERROR", "Critical error", { code: 500 });
    expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]", "Critical error", { code: 500 });
  });

  it("should call console.warn for WARNING severity in local dev", () => {
    cloudLog("WARNING", "Rate limit warning");
    expect(consoleWarnSpy).toHaveBeenCalledWith("[WARNING]", "Rate limit warning", "");
  });

  it("should not write to stdout in local dev environment", () => {
    cloudLog("INFO", "Info message");
    expect(stdoutSpy).not.toHaveBeenCalled();
  });

  it("should include K_REVISION from env in serviceContext when on Cloud Run", () => {
    process.env.K_SERVICE = "test-service";
    process.env.K_REVISION = "v42";
    cloudLog("INFO", "Revision test");
    const written = stdoutSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(written.trim());
    expect(parsed.serviceContext.version).toBe("v42");
    delete process.env.K_REVISION;
  });
});

describe("toBigQueryRecord", () => {
  it("should produce a record with event_name and event_timestamp", () => {
    const record = toBigQueryRecord("quiz_completed", { score: 8, total: 8 });
    expect(record.event_name).toBe("quiz_completed");
    expect(record.score).toBe(8);
    expect(record.total).toBe(8);
    expect(typeof record.event_timestamp).toBe("string");
    expect(record.platform).toBe("web");
  });

  it("should include event_date in YYYY-MM-DD format", () => {
    const record = toBigQueryRecord("page_view", {});
    expect(record.event_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should include app_version", () => {
    const record = toBigQueryRecord("user_action", {});
    expect(record.app_version).toBe("1.0.0");
  });

  it("should merge custom data into the record", () => {
    const record = toBigQueryRecord("custom_event", { userId: "abc", topic: "voting" });
    expect(record.userId).toBe("abc");
    expect(record.topic).toBe("voting");
  });

  it("should handle empty data object", () => {
    const record = toBigQueryRecord("empty_event", {});
    expect(record.event_name).toBe("empty_event");
    expect(record).not.toHaveProperty("undefined");
  });
});

describe("VERTEX_AI_CONFIG", () => {
  it("should specify the correct Cloud Run region", () => {
    expect(VERTEX_AI_CONFIG.location).toBe("us-central1");
  });

  it("should use a Gemini model", () => {
    expect(VERTEX_AI_CONFIG.model).toContain("gemini");
  });

  it("should have sensible safety settings for educational content", () => {
    expect(VERTEX_AI_CONFIG.safetySettings.blockNone).toBe(false);
    expect(VERTEX_AI_CONFIG.safetySettings.maxOutputTokens).toBeGreaterThan(0);
    expect(VERTEX_AI_CONFIG.safetySettings.temperature).toBeGreaterThanOrEqual(0);
    expect(VERTEX_AI_CONFIG.safetySettings.temperature).toBeLessThanOrEqual(1);
  });
});
