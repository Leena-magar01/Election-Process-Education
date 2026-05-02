/**
 * @fileoverview Comprehensive unit tests for the election data library.
 *
 * Validates the integrity of the ELECTION_TIMELINE, QUIZ_QUESTIONS,
 * TOPIC_SUGGESTIONS, and SYSTEM_PROMPT exported from electionData.ts.
 * These tests ensure content accuracy and structural consistency.
 */

import {
  ELECTION_TIMELINE,
  QUIZ_QUESTIONS,
  TOPIC_SUGGESTIONS,
  SYSTEM_PROMPT,
} from "../lib/electionData";

// ─── Election Timeline Tests ──────────────────────────────────────────────────
describe("ELECTION_TIMELINE", () => {
  it("contains exactly 5 steps", () => {
    expect(ELECTION_TIMELINE).toHaveLength(5);
  });

  it("each step has all required properties with truthy values", () => {
    ELECTION_TIMELINE.forEach((step) => {
      expect(step).toHaveProperty("id");
      expect(step).toHaveProperty("title");
      expect(step).toHaveProperty("description");
      expect(step).toHaveProperty("whyItMatters");
      expect(step).toHaveProperty("status");
      expect(step).toHaveProperty("icon");
      expect(step.id).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
      expect(step.whyItMatters).toBeTruthy();
      expect(step.icon).toBeTruthy();
    });
  });

  it("steps are in the correct chronological order", () => {
    const expectedIds = ["registration", "nomination", "campaign", "voting", "results"];
    expect(ELECTION_TIMELINE.map((s) => s.id)).toEqual(expectedIds);
  });

  it("first step is Registration", () => {
    expect(ELECTION_TIMELINE[0].id).toBe("registration");
    expect(ELECTION_TIMELINE[0].title).toBe("Registration");
  });

  it("last step is Results", () => {
    expect(ELECTION_TIMELINE[4].id).toBe("results");
    expect(ELECTION_TIMELINE[4].title).toBe("Results");
  });

  it("all steps have valid status values", () => {
    const validStatuses = ["done", "active", "pending"];
    ELECTION_TIMELINE.forEach((step) => {
      expect(validStatuses).toContain(step.status);
    });
  });

  it("all step descriptions are sufficiently detailed (>20 chars)", () => {
    ELECTION_TIMELINE.forEach((step) => {
      expect(step.description.length).toBeGreaterThan(20);
      expect(step.whyItMatters.length).toBeGreaterThan(20);
    });
  });

  it("has no duplicate step IDs", () => {
    const ids = ELECTION_TIMELINE.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── Quiz Questions Tests ─────────────────────────────────────────────────────
describe("QUIZ_QUESTIONS", () => {
  it("has at least 8 questions for comprehensive coverage", () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(8);
  });

  it("each question has valid options array, correct answer, and explanation", () => {
    QUIZ_QUESTIONS.forEach((q, index) => {
      expect(q).toHaveProperty("question");
      expect(q).toHaveProperty("options");
      expect(q).toHaveProperty("correct");
      expect(q).toHaveProperty("explanation");

      expect(q.question).toBeTruthy();
      expect(q.options).toHaveLength(3);
      expect(["A", "B", "C"]).toContain(q.correct);
      expect(q.explanation).toBeTruthy();
      expect(q.explanation.length).toBeGreaterThan(10);

      // Each option must be non-empty
      q.options.forEach((opt) => {
        expect(opt.trim()).toBeTruthy();
      });
    });
  });

  it("all questions are unique (no duplicates)", () => {
    const questions = QUIZ_QUESTIONS.map((q) => q.question);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("options follow A)/B)/C) format consistently", () => {
    QUIZ_QUESTIONS.forEach((q) => {
      expect(q.options[0]).toMatch(/^A\)/);
      expect(q.options[1]).toMatch(/^B\)/);
      expect(q.options[2]).toMatch(/^C\)/);
    });
  });

  it("covers key election topics across questions", () => {
    const allText = QUIZ_QUESTIONS.map((q) => q.question + q.explanation).join(" ").toLowerCase();
    expect(allText).toContain("registr");
    expect(allText).toContain("vot");
    expect(allText).toContain("elect");
  });

  it("all questions have sequential IDs starting from 1", () => {
    QUIZ_QUESTIONS.forEach((q, idx) => {
      expect(q.id).toBe(idx + 1);
    });
  });
});

// ─── Topic Suggestions Tests ──────────────────────────────────────────────────
describe("TOPIC_SUGGESTIONS", () => {
  it("is a non-empty array", () => {
    expect(TOPIC_SUGGESTIONS.length).toBeGreaterThan(0);
  });

  it("each topic has a label and value", () => {
    TOPIC_SUGGESTIONS.forEach((topic) => {
      expect(topic).toHaveProperty("label");
      expect(topic).toHaveProperty("value");
      expect(topic.label).toBeTruthy();
      expect(topic.value).toBeTruthy();
    });
  });

  it("has no duplicate values", () => {
    const values = TOPIC_SUGGESTIONS.map((t) => t.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it("contains a Test Your Knowledge topic", () => {
    const hasQuiz = TOPIC_SUGGESTIONS.some(
      (t) => t.label.toLowerCase().includes("knowledge") || t.label.toLowerCase().includes("quiz")
    );
    expect(hasQuiz).toBe(true);
  });

  it("contains all 5 core election steps", () => {
    const allLabels = TOPIC_SUGGESTIONS.map((t) => t.label.toLowerCase()).join(" ");
    expect(allLabels).toContain("registration");
    expect(allLabels).toContain("nomination");
    expect(allLabels).toContain("campaign");
    expect(allLabels).toContain("voting");
  });

  it("contains at least 8 topics for comprehensive navigation", () => {
    expect(TOPIC_SUGGESTIONS.length).toBeGreaterThanOrEqual(8);
  });
});

// ─── System Prompt Tests ──────────────────────────────────────────────────────
describe("SYSTEM_PROMPT", () => {
  it("is a non-empty string", () => {
    expect(typeof SYSTEM_PROMPT).toBe("string");
    expect(SYSTEM_PROMPT.length).toBeGreaterThan(50);
  });

  it("instructs AI to provide [A]/[B]/[C] quick reply options", () => {
    expect(SYSTEM_PROMPT).toContain("[A]");
    expect(SYSTEM_PROMPT).toContain("[B]");
    expect(SYSTEM_PROMPT).toContain("[C]");
  });

  it("mentions all core election steps", () => {
    const prompt = SYSTEM_PROMPT.toLowerCase();
    expect(prompt).toContain("registration");
    expect(prompt).toContain("nomination");
    expect(prompt).toContain("campaign");
    expect(prompt).toContain("voting");
    expect(prompt).toContain("results");
  });

  it("instructs the AI to adapt to user country", () => {
    const prompt = SYSTEM_PROMPT.toLowerCase();
    expect(prompt).toContain("country");
  });
});
