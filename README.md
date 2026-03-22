# वार्ता — Vartaa

Vartaa is a premium, AI-powered multilingual chat application designed for high-performance teams and seamless cross-cultural communication. Built with an **Obsidian-inspired aesthetic**, it combines editorial elegance with powerful real-time intelligence.

![Vartaa Logo](file:///c:/Users/subha/Desktop/Vartaa/src/app/icon.svg)

## ✨ Core Value Propositions

### 🌑 Obsidian Aesthetic
Vartaa features a meticulously crafted dark theme designed for focus and clarity. With custom HSL color tokens, refined typography (Geist & Instrument Serif), and subtle micro-animations, the interface feels premium, responsive, and alive.

### 🌎 AI-Driven Multilingual Support
Break language barriers instantly. Vartaa integrates the cutting-edge **Sarvam AI** stack:
- **Saaras (STT)**: Real-time, highly accurate speech-to-text for Indian and global languages.
- **Mayura (Translation)**: Context-aware, colloquially accurate translation that maintains native nuances.
- **Bulbul (TTS)**: Natural-sounding voice synthesis in multiple regional and international voices.

### 🧠 Intelligent Conversational Insights
Powered by **Gemini 1.5 Flash**, Vartaa offers proactive assistance:
- **Smart Replies**: Context-aware response suggestions to keep conversations moving.
- **Thread Summarization**: Instant, 2-4 sentence summaries of busy chat rooms.
- **Task Extraction**: Automatically identify and capture action items from chat messages.

## 🏗️ Technical Architecture

Vartaa is built on a modern, event-driven architecture that prioritizes low-latency communication and high-fidelity AI processing.

- **Real-time Engine (Convex)**: Unlike traditional REST APIs, Vartaa uses Convex to maintain a persistent WebSocket connection. This ensures that typing indicators, presence states (Online/Away/DND), and new messages are synced across all clients in under 50ms.
- **Isomorphic AI Processing**: AI logic is split between client-side helpers (for immediate UI feedback) and server-side Convex Actions (for heavy lifting like transcription and translation). This ensures the UI remains snappy while handling complex LLM operations in the background.
- **State Management**: React state is synchronized with Convex's reactive database, meaning the UI is a direct reflection of the backend state without the need for manual polling or complex Redux-style boilerplate.

## 🚀 Key Features Deep-Dive

- **Multilingual Voice Loops**: When a user sends a voice note, it is processed through a three-stage pipeline:
  1. **Transcription**: Sarvam Saaras converts audio to the sender's text.
  2. **Translation**: Mayura translates the transcript into the preferred languages of every member in the room.
  3. **Refinement**: Gemini optimizes the translation for tone and context.
- **Obsidian Design System**: The UI is built using a custom design system defined in `globals.css`. It uses dynamic HSL variables (e.g., `--obsidian-primary`, `--obsidian-surface`) to allow for seamless theme switching and consistent editorial aesthetics.
- **Smart Presence**: Dynamic presence tracking that updates your status based on activity. Integrated directly into the sidebar and chat headers.
- **System-wide Search**: Instant search across all joined rooms and messages using Convex's full-text search capabilities.

## 📁 Project Structure

```text
vartaa/
├── convex/               # Backend logic (Schemas, Mutations, Queries, AI Actions)
├── src/
│   ├── app/              # Next.js App Router (Auth, Chat, Dashboard routes)
│   ├── components/
│   │   ├── chat/        # Core chat components (Window, List, Input, Voice)
│   │   ├── features/    # AI-powered features (AISummary, Tasks, Replies)
│   │   ├── landing/     # High-end landing page components
│   │   ├── layout/      # Responsive navigation (RailNav, ChannelList)
│   │   └── ui/          # Atomic design primitives (Buttons, Badges)
│   ├── hooks/            # Custom React hooks (Auth, Presence, Responsiveness)
│   ├── lib/              # Utility libraries (Sarvam, Gemini, CSS Merging)
│   └── types/            # TypeScript type definitions
├── public/               # Static assets & icons
└── tailwind.config.ts    # Design tokens and theme configuration
```

## 🛠️ Development & Deployment

1. **Environment Config**: Ensure your `.env.local` contains all required API keys for Clerk, Convex, Gemini, and Sarvam.
2. **Local Workflows**:
   - `npm run dev`: Starts the Next.js frontend.
   - `npx convex dev`: Starts the local Convex backend and starts syncing schemas.
3. **Deployment**: Vartaa is optimized for Vercel. Simply connect your repo and configure the Convex integration for a one-click production environment.

---
Built with pride for a multilingual tomorrow.

## 🗑️ Technical Debt & Legacy Cleanup

The following files were identified during a codebase audit as potentially redundant or superseded by newer implementations. They are currently retained for reference but are candidates for future removal:

- **`src/components/layout/Sidebar.tsx`**: Superseded by the `RailNav` and `ChannelList` dual-pane architecture.
- **`src/lib/sarvam.ts`**: Legacy client-side helpers; logic has migrated to server-side Convex Actions.
- **`convex/actions/tts.ts`**: Unused Convex action currently unreferenced by the frontend.
- **`src/types/index.ts`**: Legacy type definitions; types are now managed via Convex auto-generation or inline definitions.
- **`convex/README.md`**: Generic boilerplate within the backend folder.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
