import { ELECTION_TIMELINE, QUIZ_QUESTIONS, TOPIC_SUGGESTIONS } from "../lib/electionData";

// ─── Election Timeline Data Tests ────────────────────────────────────────────
describe("ELECTION_TIMELINE", () => {
  it("should contain exactly 5 steps", () => {
    expect(ELECTION_TIMELINE).toHaveLength(5);
  });

  it("each step should have an id, title, description, and whyItMatters", () => {
    ELECTION_TIMELINE.forEach((step) => {
      expect(step).toHaveProperty("id");
      expect(step).toHaveProperty("title");
      expect(step).toHaveProperty("description");
      expect(step).toHaveProperty("whyItMatters");
      expect(step.id).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
      expect(step.whyItMatters).toBeTruthy();
    });
  });

  it("should have steps in the correct order", () => {
    const expectedIds = ["registration", "nomination", "campaign", "voting", "results"];
    const actualIds = ELECTION_TIMELINE.map((s) => s.id);
    expect(actualIds).toEqual(expectedIds);
  });

  it("Registration step should be first", () => {
    expect(ELECTION_TIMELINE[0].id).toBe("registration");
  });

  it("Results step should be last", () => {
    expect(ELECTION_TIMELINE[4].id).toBe("results");
  });
});

// ─── Quiz Questions Tests ─────────────────────────────────────────────────────
describe("QUIZ_QUESTIONS", () => {
  it("should have at least 5 questions", () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(5);
  });

  it("each question should have valid options, a correct answer, and explanation", () => {
    QUIZ_QUESTIONS.forEach((q, index) => {
      expect(q).toHaveProperty("question");
      expect(q).toHaveProperty("options");
      expect(q).toHaveProperty("correct");
      expect(q).toHaveProperty("explanation");

      expect(q.question).toBeTruthy();
      expect(q.options).toHaveLength(3);
      expect(["A", "B", "C"]).toContain(q.correct);
      expect(q.explanation).toBeTruthy();

      // Each option must be non-empty
      q.options.forEach((opt) => {
        expect(opt.trim()).toBeTruthy();
      });
    });
  });

  it("should have unique questions", () => {
    const questions = QUIZ_QUESTIONS.map((q) => q.question);
    const uniqueQuestions = new Set(questions);
    expect(uniqueQuestions.size).toBe(questions.length);
  });
});

// ─── Topic Suggestions Tests ──────────────────────────────────────────────────
describe("TOPIC_SUGGESTIONS", () => {
  it("should be a non-empty array", () => {
    expect(TOPIC_SUGGESTIONS.length).toBeGreaterThan(0);
  });

  it("each topic should have label and value", () => {
    TOPIC_SUGGESTIONS.forEach((topic) => {
      expect(topic).toHaveProperty("label");
      expect(topic).toHaveProperty("value");
      expect(topic.label).toBeTruthy();
      expect(topic.value).toBeTruthy();
    });
  });

  it("should contain a Test Your Knowledge topic", () => {
    const hasQuiz = TOPIC_SUGGESTIONS.some((t) =>
      t.label.toLowerCase().includes("knowledge") || t.label.toLowerCase().includes("quiz")
    );
    expect(hasQuiz).toBe(true);
  });
});
