import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, QUIZ_QUESTIONS } from "@/lib/electionData";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// Global variables to track user's current quiz question and wrong answers
let currentQuizIndex = 0;
let score = 0;
let wrongAnswers: { question: string, explanation: string }[] = [];

/**
 * Generates a heuristic-based response when the AI model is unavailable or rate-limited.
 * Includes interactive conversational logic and a robust quiz engine.
 *
 * @param {string} userMessage - The most recent message from the user.
 * @param {Message[]} history - The conversation history context.
 * @returns {string} - The formatted markdown response with quick replies.
 */
function generateResponse(userMessage: string, history: Message[]): string {
  const msg = userMessage.toLowerCase();

  // If we are in quiz mode
  if (msg.includes("test your knowledge") || msg.includes("quiz me")) {
    currentQuizIndex = 0;
    score = 0;
    wrongAnswers = [];
    const q = QUIZ_QUESTIONS[0];
    return `🧩 **Welcome to the Election Knowledge Test!**

Let's see what you've learned. Here's Question 1 of ${QUIZ_QUESTIONS.length}:

**${q.question}**

[A] ${q.options[0].substring(3)}
[B] ${q.options[1].substring(3)}
[C] ${q.options[2].substring(3)}`;
  }

  // Handle quiz answers
  if (history.some(m => m.content.includes("Question")) && (msg === "a" || msg === "b" || msg === "c" || msg.match(/^\[?[a-c]\]?/))) {
    const q = QUIZ_QUESTIONS[currentQuizIndex];
    if (!q) return "The quiz is over! [A] Restart Quiz [B] Back to timeline";

    // Extract selected answer letter
    const selected = msg.match(/[a-c]/)?.[0].toUpperCase() || "";
    const isCorrect = selected === q.correct;
    
    if (isCorrect) {
      score++;
    } else {
      wrongAnswers.push({
        question: q.question,
        explanation: `The correct answer was **${q.correct}**: ${q.explanation}`
      });
    }

    let reply = isCorrect 
      ? `✅ **Correct!**\n\n${q.explanation}\n\n` 
      : `❌ **Not quite!** The correct answer was **${q.correct}**.\n\n${q.explanation}\n\n`;

    currentQuizIndex++;

    if (currentQuizIndex < QUIZ_QUESTIONS.length) {
      const nextQ = QUIZ_QUESTIONS[currentQuizIndex];
      reply += `**Question ${currentQuizIndex + 1} of ${QUIZ_QUESTIONS.length}:**\n\n**${nextQ.question}**\n\n`;
      reply += `[A] ${nextQ.options[0].substring(3)}\n[B] ${nextQ.options[1].substring(3)}\n[C] ${nextQ.options[2].substring(3)}`;
      return reply;
    } else {
      reply += `🏆 **Quiz Complete!**\n\nYou scored **${score} out of ${QUIZ_QUESTIONS.length}**.\n\n`;
      
      if (wrongAnswers.length > 0) {
        reply += `**📚 Let's review what you missed:**\n`;
        wrongAnswers.forEach((wa, idx) => {
          reply += `\n**${idx + 1}. ${wa.question}**\n*${wa.explanation}*\n`;
        });
      } else {
        reply += `**Perfect score! You're an election expert! 🌟**\n`;
      }

      reply += `\nWhat would you like to do next?\n\n[A] 🔄 Start over\n[B] 📖 View the timeline\n[C] 📊 Simulate Live Results`;
      currentQuizIndex = 0;
      return reply;
    }
  }

  // Live vote simulation
  if (msg.includes("simulate") || msg.includes("live result")) {
    return `📊 **Live Vote Counting Simulation**

Watch the votes roll in! This simulates how counting happens at election centers as precincts report their numbers.

[LIVE_VOTE_SIMULATION]

When counting finishes, the results become official.

[A] 🔄 Run another simulation
[B] 📖 View the full timeline
[C] 🧩 Test Your Knowledge`;
  }

  // Level selection with informative intro
  if (msg.includes("beginner") || msg.includes("explain everything")) {
    return `Great choice! 🌱 I'll keep things simple and easy to follow.

*Elections ensure fair representation and allow citizens to hold leaders accountable.*

**Which country's election process** would you like to explore? I'll adapt my examples to fit!

[A] 🇺🇸 United States
[B] 🇮🇳 India
[C] 🇬🇧 United Kingdom`;
  }

  if (msg.includes("intermediate") || msg.includes("some knowledge")) {
    return `Awesome! 📚 You've got some background — I'll go a bit deeper with details.

*Did you know that voting systems differ wildly, from First-Past-The-Post to Proportional Representation?*

**Which country** should we focus on?

[A] 🇺🇸 United States
[B] 🇮🇳 India
[C] 🇬🇧 United Kingdom`;
  }

  if (msg.includes("advanced") || msg.includes("detailed")) {
    return `Let's dive deep! 🎓 I'll cover the nuances and technical processes.

*Every democracy has complex safeguards to prevent fraud, like electronic verification and multi-stage counting.*

**Which country's system** would you like to explore?

[A] 🇺🇸 United States
[B] 🇮🇳 India
[C] 🇬🇧 United Kingdom`;
  }

  // Country selection
  if (msg.includes("united states") || msg.includes("usa") || msg.includes("🇺🇸")) {
    return `🇺🇸 **United States Elections** — Great choice!

The U.S. holds elections at **federal, state, and local levels**. The most prominent is the **Presidential Election** held every 4 years.

Here's what we can explore:
- **Registration** — How Americans register to vote
- **Primaries & Caucuses** — How parties pick candidates
- **The Electoral College** — The unique voting system
- **Election Day** — How voting works

What would you like to start with?

[A] 📋 Voter Registration
[B] 📝 Primaries & Nominations
[C] 📖 Show me the full timeline`;
  }

  if (msg.includes("india") || msg.includes("🇮🇳")) {
    return `🇮🇳 **Indian Elections** — Excellent!

India runs the **world's largest democracy** with over 900 million eligible voters! Elections are managed by the **Election Commission of India (ECI)**.

Key facts:
- **Lok Sabha** (Parliament) elections every 5 years
- **Electronic Voting Machines (EVMs)** are used
- Elections happen in **multiple phases** across states

What interests you most?

[A] 📋 Voter Registration & Voter ID
[B] 📝 How candidates are nominated
[C] 📖 Show me the full timeline`;
  }

  if (msg.includes("united kingdom") || msg.includes("uk") || msg.includes("🇬🇧")) {
    return `🇬🇧 **United Kingdom Elections** — Let's go!

The UK uses a **Parliamentary system** where citizens vote for **Members of Parliament (MPs)**. The leader of the winning party becomes **Prime Minister**.

Key points:
- **General Elections** every 5 years (max)
- **First Past the Post** voting system
- **650 constituencies** across the UK

Where shall we begin?

[A] 📋 How to register to vote
[B] 📝 How candidates stand for election
[C] 📖 Show me the full timeline`;
  }

  // Registration
  if (msg.includes("registration") || msg.includes("register")) {
    return `📋 **Voter Registration**

Registration is the **first step** in any election. It ensures only eligible citizens can vote.

**How it typically works:**
- You must meet age requirements (usually **18+**)
- Prove your **citizenship** and **residency**
- Register through government portals, by mail, or in person

*💡 Why it matters: Without registration, you can't vote — it's the foundation of democratic participation.*

✅ **Timeline Step: Registration** — This is Step 1 of 5.

What's next?

[A] 📝 Move to Nomination process
[B] 🌍 How does registration differ by country?
[C] 🧩 Test Your Knowledge`;
  }

  // Nomination
  if (msg.includes("nomination") || msg.includes("nominate") || msg.includes("primaries")) {
    return `📝 **Nomination Process**

This is where candidates **officially enter the race**!

**Key steps:**
- Candidates file **nomination papers** with election authorities
- They may need a minimum number of **supporter signatures**
- A **deposit fee** is often required (returned if they get enough votes)

*💡 Why it matters: Nomination ensures candidates meet eligibility standards and prevents unqualified individuals from contesting.*

✅ **Timeline Step: Nomination** — Step 2 of 5

What would you like to explore next?

[A] 📢 Move to Campaign phase
[B] 🔍 Deep dive into party selection
[C] 📖 Show the full timeline`;
  }

  // Campaign
  if (msg.includes("campaign")) {
    return `📢 **Election Campaigns**

The campaign period is when candidates **compete for your vote**!

**What happens during campaigns:**
- **Rallies & speeches** — candidates address crowds
- **Debates** — candidates face off on key issues
- **Advertising** — TV, radio, social media, billboards
- **Manifesto release** — parties publish their promises

*💡 Why it matters: Campaigns give voters the information they need to make informed choices — they're the heartbeat of democracy.*

✅ **Timeline Step: Campaign** — Step 3 of 5

What's next?

[A] 🗳️ Move to Voting Day
[B] 💰 How is campaign finance regulated?
[C] 🧩 Test Your Knowledge`;
  }

  // Voting
  if (msg.includes("voting") || msg.includes("vote") || msg.includes("ballot")) {
    return `🗳️ **Voting Day**

This is the big day when citizens make their choice!

**How voting works:**
- Go to your assigned **polling station**
- Present your **voter ID** or registration proof
- Receive your **ballot paper** or use an electronic machine
- Mark your choice in a **private booth** 🔒

*💡 Why it matters: Voting is the most direct way citizens shape their government — every single vote contributes to the final outcome.*

✅ **Timeline Step: Voting** — Step 4 of 5

What would you like to know next?

[A] 📊 Move to Results
[B] 🔐 How is vote secrecy ensured?
[C] 📖 Show the full timeline`;
  }

  // Results
  if (msg.includes("result") || msg.includes("count")) {
    return `📊 **Election Results**

After polls close, the **counting begins**!

**The process:**
- Ballot boxes are **sealed and transported** to counting centers
- **Official observers** from all parties watch the count
- Votes are tallied and results are **verified** by the election commission
- The **winner is declared** based on the voting system used

*💡 Why it matters: Transparent result counting builds public trust and legitimacy — it's what separates democracy from authoritarianism.*

✅ **Timeline Step: Results** — Step 5 of 5 🎉

You've completed the election journey! What's next?

[A] 🔄 Start over with a new country
[B] 🧩 Test Your Knowledge
[C] 🌍 Compare election systems`;
  }

  // Timeline request
  if (msg.includes("timeline") || msg.includes("full process") || msg.includes("all steps")) {
    return `📖 **The Complete Election Timeline**

Here's the full journey of an election, from start to finish:

**Step 1: 📋 Registration**
Citizens register as eligible voters

**Step 2: 📝 Nomination**
Candidates file to run for office

**Step 3: 📢 Campaign**
Candidates compete for votes through outreach

**Step 4: 🗳️ Voting**
Citizens cast their ballots on election day

**Step 5: 📊 Results**
Votes are counted and winners declared

Each step has safeguards to ensure **fairness and transparency**. The whole process can take anywhere from a few weeks to over a year!

[A] 📋 Deep dive into Registration
[B] 🧩 Test Your Knowledge
[C] 🌍 Compare timelines across countries`;
  }

  // Compare
  if (msg.includes("compare")) {
    return `🌍 **Comparing Election Systems**

| Feature | 🇺🇸 USA | 🇮🇳 India | 🇬🇧 UK |
|---------|---------|----------|--------|
| **System** | Presidential | Parliamentary | Parliamentary |
| **Voting** | Electoral College | First Past Post | First Past Post |
| **Frequency** | Every 4 years | Every 5 years | Every 5 years |
| **Voters** | ~160 million | ~900 million | ~47 million |
| **Method** | Paper/Electronic | EVMs | Paper ballots |

Each system has its own strengths and reflects the country's unique democratic traditions!

[A] 🇺🇸 Deep dive into US system
[B] 🇮🇳 Deep dive into Indian system
[C] 🧩 Test Your Knowledge`;
  }

  // Default / fallback
  return `Great question! 🤔 Let me help you explore that.

*Elections are the cornerstone of democracy, allowing peaceful transitions of power.*

Here are some areas I can help with:
- **📋 Registration** — How voters sign up
- **📝 Nomination** — How candidates enter the race
- **📢 Campaigns** — How candidates compete
- **🗳️ Voting** — How ballots are cast
- **📊 Results** — How winners are determined

What would you like to explore?

[A] 📋 Start from the beginning
[B] 📖 See the full timeline
[C] 🧩 Test Your Knowledge`;
}

/**
 * API Route Handler for POST requests to /api/chat.
 * Proxies messages to xAI's Grok API if available, otherwise falls back to the heuristic engine.
 *
 * @param {NextRequest} request - The incoming HTTP request containing the chat history and metadata.
 * @returns {Promise<NextResponse>} - The JSON response containing the assistant's reply.
 */
export async function POST(request: NextRequest) {
  try {
    const { messages, userLevel, country } = await request.json();

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // Build history context
    const history: Message[] = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Try Groq API if key exists
    if (process.env.GROQ_API_KEY) {
      try {
        const { default: OpenAI } = await import("openai");
        const groq = new OpenAI({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: "https://api.groq.com/openai/v1",
        });

        const systemMessage = `${SYSTEM_PROMPT}\n\nUser Level: ${userLevel || "not set"}\nCountry: ${country || "not set"}`;

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemMessage },
            ...history,
          ],
          max_tokens: 600,
          temperature: 0.7,
        });

        const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
        return NextResponse.json({ reply });
      } catch (error) {
        console.error("Groq API Error:", error);
        // Fall through to built-in engine
      }
    }

    // Built-in response engine
    const reply = generateResponse(lastUserMessage, history);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
