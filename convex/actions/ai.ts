"use node";
import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal, api } from "../_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Gemini call failed");
  return data.candidates[0].content.parts[0].text as string;
}

async function callGeminiJSON<T>(prompt: string): Promise<T> {
  const text = await callGemini(prompt);
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean) as T;
}

// ── AI THREAD SUMMARY ──────────────────────────────────────────────────
export const summarizeThread = action({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const messages = await ctx.runQuery(api.messages.getMessages, { roomId, limit: 80 });
    if (messages.length < 3) return "Not enough messages to summarize.";

    const formatted = messages
      .filter((m) => !m.isDeleted && m.body)
      .map((m) => `${m.senderId}: ${m.body}`)
      .join("\n");

    const prompt = `You are a helpful assistant inside a team chat app called Vartaa.

Summarize the following chat messages in 2–4 sentences.
Focus on: what was discussed, what decisions were made, and any action items assigned.
Do NOT include greetings, filler words, or meta-commentary.
Write in past tense. Be concise. Output plain text only — no markdown, no bullet points.

Messages:
${formatted}`;

    return await callGemini(prompt);
  },
});

// ── SMART REPLY SUGGESTIONS ────────────────────────────────────────────
export const getSmartReplies = action({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }): Promise<string[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const messages = await ctx.runQuery(api.messages.getMessages, { roomId, limit: 5 });
    if (messages.length === 0) return [];

    const formatted = messages
      .filter((m) => !m.isDeleted && (m.body || m.transcript))
      .map((m) => `${m.senderId}: ${m.body || m.transcript}`)
      .join("\n");

    const prompt = `You are an assistant inside a team chat app called Vartaa.

Given the recent conversation below, suggest exactly 3 short reply options.
Rules:
- Each reply must be under 10 words
- Replies must be natural, conversational, and relevant to the last message
- Return ONLY a JSON array of 3 strings
- Example: ["Got it!", "On it", "Can you share the link?"]
- No explanation, no preamble, just the JSON array

Recent conversation:
${formatted}`;

    try {
      return await callGeminiJSON<string[]>(prompt);
    } catch {
      return [];
    }
  },
});

// ── STANDUP GENERATOR ──────────────────────────────────────────────────
export const generateStandup = action({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId: requestedUserId }): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const rooms = await ctx.runQuery(internal.rooms.getMyRoomsByUserId, { userId });
    const yesterday = Date.now() - 24 * 60 * 60 * 1000;

    const allMessages: string[] = [];
    for (const room of rooms) {
      const msgs = await ctx.runQuery(api.messages.getMessages, { roomId: room._id, limit: 50 });
      const mine = msgs.filter((m) => m.senderId === userId && m.createdAt > yesterday && !m.isDeleted && (m.body || m.transcript));
      allMessages.push(...mine.map((m) => (m.body || m.transcript)!));
    }

    if (allMessages.length === 0) return "No messages in the last 24 hours to generate a standup from.";

    const prompt = `You are a helpful assistant inside a team chat app called Vartaa.

Based on these messages sent by the user in the last 24 hours, generate a professional standup update.

Format EXACTLY as:
Yesterday: [what they worked on]
Today: [what they plan to do, inferred from context]
Blockers: [any blockers mentioned, or "None"]

Rules:
- Be concise — max 1–2 sentences per section
- Use first person ("I worked on...", "I will...")
- Output plain text only. No markdown.

User's messages:
${allMessages.join("\n")}`;

    return await callGemini(prompt);
  },
});

// ── TONE CHECKER ───────────────────────────────────────────────────────
export const checkTone = action({
  args: { message: v.string() },
  handler: async (ctx, { message }): Promise<{ flagged: boolean; reason: string; suggestion: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const prompt = `You are a tone checker inside a professional team chat app called Vartaa.

Analyze the following message and determine if it could be perceived as harsh, rude, passive-aggressive, or unclear in a professional team context.

Message: "${message}"

Respond with ONLY a JSON object:
{
  "flagged": true or false,
  "reason": "brief reason if flagged, empty string if not",
  "suggestion": "a friendlier rewrite if flagged, empty string if not"
}

Be conservative — only flag messages that are clearly problematic.`;

    try {
      return await callGeminiJSON(prompt);
    } catch {
      return { flagged: false, reason: "", suggestion: "" };
    }
  },
});

// ── TASK EXTRACTOR ─────────────────────────────────────────────────────
export const extractTask = action({
  args: { messageText: v.string() },
  handler: async (ctx, { messageText }): Promise<{ taskTitle: string; assignee: string | null; dueDate: string | null }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const prompt = `You are a task extraction assistant inside a team chat app called Vartaa.

Extract a task from the following chat message.
Message: "${messageText}"

Respond with ONLY a JSON object:
{
  "taskTitle": "short, clear action-oriented task title (under 10 words, start with a verb)",
  "assignee": "name of person mentioned, or null",
  "dueDate": "due date in natural language, or null"
}
No explanation. Just the JSON.`;

    try {
      return await callGeminiJSON(prompt);
    } catch {
      return { taskTitle: messageText.slice(0, 50), assignee: null, dueDate: null };
    }
  },
});

// ── CONTENT MODERATION ─────────────────────────────────────────────────
export const moderateMessage = internalAction({
  args: { text: v.string() },
  handler: async (ctx, { text }): Promise<{ flagged: boolean; reason: string; severity: string }> => {
    const prompt = `You are a content moderator for a team chat app.

Analyze this message for: spam, hate speech, threats, harassment, or personal credentials (passwords, card numbers).
Message: "${text}"

Respond ONLY with JSON:
{ "flagged": boolean, "reason": "string", "severity": "none"|"low"|"medium"|"high" }`;

    try {
      return await callGeminiJSON(prompt);
    } catch {
      return { flagged: false, reason: "", severity: "none" };
    }
  },
});
