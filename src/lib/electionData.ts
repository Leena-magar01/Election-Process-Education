import { TimelineStep } from "@/store/chatStore";

export const ELECTION_TIMELINE: TimelineStep[] = [
  {
    id: "registration",
    title: "Registration",
    description: "Citizens register as eligible voters by verifying their identity, age (18+), and residency through government portals or in person.",
    whyItMatters: "Without registration, you can't vote — it's the foundation of democratic participation and ensures only eligible citizens cast ballots.",
    status: "pending",
    icon: "📋",
  },
  {
    id: "nomination",
    title: "Nomination",
    description: "Candidates officially file their nomination papers, gather supporter signatures, and pay deposit fees to be listed on the ballot.",
    whyItMatters: "Nomination ensures candidates meet eligibility standards and prevents unqualified individuals from contesting elections.",
    status: "pending",
    icon: "📝",
  },
  {
    id: "campaign",
    title: "Campaign",
    description: "Candidates compete for votes through rallies, TV debates, social media outreach, door-to-door canvassing, and manifesto releases.",
    whyItMatters: "Campaigns give voters the information they need to make informed choices — they're the heartbeat of democracy.",
    status: "pending",
    icon: "📢",
  },
  {
    id: "voting",
    title: "Voting",
    description: "Registered voters go to polling stations, verify their identity, and cast their ballot in a private booth using paper or electronic methods.",
    whyItMatters: "Voting is the most direct way citizens shape their government — every single vote contributes to the final outcome.",
    status: "pending",
    icon: "🗳️",
  },
  {
    id: "results",
    title: "Results",
    description: "Votes are counted at official centers under observer supervision, verified by the election commission, and winners are publicly declared.",
    whyItMatters: "Transparent result counting builds public trust and legitimacy — it's what separates democracy from authoritarianism.",
    status: "pending",
    icon: "📊",
  },
];

export const SYSTEM_PROMPT = `You are an Election Education Assistant — a friendly guide that teaches users how elections work.

RULES:
- Keep answers short (2-4 paragraphs max), clear, and interactive
- Always offer 2-3 options after each explanation using this EXACT format:
  [A] Option text here
  [B] Option text here
  [C] Option text here
- Use simple language a 15-year-old could understand
- Use bullet points and relevant emojis
- Always include a small educational insight before asking questions

ELECTION STEPS: Registration, Nomination, Campaign, Voting, Results

FLOW:
1. If user hasn't specified a country, give a small insight about elections then ask which country
2. Adapt examples to their country
3. Provide step-by-step explanations
4. Use real-world examples

Always end with 2-3 button options in [A]/[B]/[C] format. Be conversational and encouraging!`;

export const TOPIC_SUGGESTIONS = [
  { label: "📋 Registration", value: "Explain voter registration" },
  { label: "📝 Nomination", value: "How does nomination work?" },
  { label: "📢 Campaigns", value: "Tell me about campaigns" },
  { label: "🗳️ Voting Day", value: "Walk me through voting day" },
  { label: "📊 Results", value: "How are results determined?" },
  { label: "🌍 Compare", value: "Compare election systems" },
  { label: "🧩 Test Your Knowledge", value: "Test Your Knowledge" },
  { label: "📖 Timeline", value: "Show the election timeline" },
  { label: "📊 Simulate Results", value: "Simulate Live Results" },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the very first step in the election process?",
    options: ["A) Campaign", "B) Registration", "C) Voting"],
    correct: "B",
    explanation: "Registration is Step 1 — citizens must register before they can vote!",
  },
  {
    id: 2,
    question: "What is the purpose of the 'silence period' before an election?",
    options: [
      "A) To give voters time to rest",
      "B) To stop campaigning and let voters decide without pressure",
      "C) To count early votes",
    ],
    correct: "B",
    explanation: "The silence period (usually 24-48 hours before voting) stops all campaigning so voters can make calm, uninfluenced decisions.",
  },
  {
    id: 3,
    question: "Which country has the largest number of eligible voters?",
    options: ["A) United States", "B) China", "C) India"],
    correct: "C",
    explanation: "India has over 900 million eligible voters — the world's largest democracy!",
  },
  {
    id: 4,
    question: "What does 'First Past the Post' mean?",
    options: [
      "A) The first person to register wins",
      "B) The candidate with the most votes wins",
      "C) The party with the most money wins",
    ],
    correct: "B",
    explanation: "In FPTP, the candidate with the highest number of votes in a constituency wins — used in the UK, US, and India.",
  },
  {
    id: 5,
    question: "What is an EVM?",
    options: [
      "A) Electoral Voting Method",
      "B) Electronic Voting Machine",
      "C) Emergency Vote Management",
    ],
    correct: "B",
    explanation: "EVMs (Electronic Voting Machines) are used in India and Brazil for faster, tamper-resistant voting.",
  },
  {
    id: 6,
    question: "What does a candidate need to submit during nomination?",
    options: [
      "A) Campaign videos",
      "B) Nomination papers and a deposit fee",
      "C) Voter ID cards",
    ],
    correct: "B",
    explanation: "Candidates must file nomination papers, provide supporter signatures, and pay a deposit fee to officially enter the race.",
  },
  {
    id: 7,
    question: "Why is vote secrecy important?",
    options: [
      "A) To make counting harder",
      "B) To prevent voters from being pressured or punished for their choice",
      "C) To speed up the process",
    ],
    correct: "B",
    explanation: "Secret ballots protect voters from intimidation, bribery, and retaliation — a cornerstone of free elections.",
  },
  {
    id: 8,
    question: "The US President is elected through which system?",
    options: [
      "A) Direct popular vote",
      "B) Electoral College",
      "C) Parliamentary majority",
    ],
    correct: "B",
    explanation: "The Electoral College is unique to the US — voters technically choose electors, who then vote for the President.",
  },
];
