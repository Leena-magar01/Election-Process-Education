# Election Education Assistant - PromptWar Hackathon Submission

Welcome to the **Election Education Assistant**, an interactive, AI-powered conversational application designed to educate citizens about the democratic election process across various nations. Built specifically for the **PromptWar Online Hackathon**, this project demonstrates a seamless integration of modern web technologies, AI generation, and gamified learning.

## 🌟 Overview

The Election Education Assistant allows users to interact with an intelligent agent to learn about:
- The stages of the election timeline (Registration, Nomination, Campaigning, Voting, Results).
- Comparative analysis of democratic processes (USA, India, UK).
- Adaptive learning levels from beginner to advanced.
- An interactive Election Knowledge Quiz to test the user's understanding.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Frontend**: React 18, Tailwind CSS, Framer Motion (for fluid animations)
- **State Management**: Zustand
- **AI Integration**: xAI Grok API (`grok-3-mini`) via OpenAI compatible endpoint
- **Deployment & DevOps**: Dockerized for Google Cloud Run (Standalone Next.js build)

## 🧠 AI Model Implementation

The core logic uses an AI proxy handler in `src/app/api/chat/route.ts`. 
- **Primary Engine:** xAI Grok API (`grok-3-mini`) fetches dynamic, context-aware responses based on system prompts and conversation history.
- **Fallback Heuristic Engine:** A robust fallback logic guarantees 100% uptime by utilizing sophisticated pattern matching, ensuring smooth user experience even if API rate limits are hit or the API key is unconfigured.
- **Prompt Engineering:** System prompts are dynamically injected with the user's chosen "difficulty level" and "country focus" for highly relevant responses.

## 💡 Key Features

1. **Intelligent Chat Interface**: Fully customized chat UI with typing indicators, interactive quick replies, and contextual message bubbling.
2. **Dynamic Timelines**: Visually explains the complex election lifecycle, seamlessly connected to the AI chat state.
3. **Knowledge Testing Module**: Gamified quiz experience with answer evaluation and explanations.
4. **Cloud-Native Architecture**: Pre-configured with a multi-stage Dockerfile and optimized `next.config.js` standalone output for lightweight containerized deployment on Google Cloud Run.

## 🏗️ Getting Started Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables by creating a `.env.local` file:
   ```env
   XAI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## ☁️ Google Cloud Deployment

This project is configured to be deployed easily to **Google Cloud Run**:

1. Authenticate with Google Cloud CLI: `gcloud auth login`
2. Set your Project ID: `gcloud config set project YOUR_PROJECT_ID`
3. Submit the build and deploy:
   ```bash
   gcloud run deploy election-assistant \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

Built with ❤️ for PromptWar 2026!
