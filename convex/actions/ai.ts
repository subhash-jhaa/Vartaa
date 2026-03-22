"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

// const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

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

export const summarizeThread = action({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }): Promise<string> => {
    const messages = await ctx.runQuery(api.messages.getMessages, { roomId });
    if (!messages.length) return "No messages to summarize.";

    const formatted = messages
      .filter((m) => !m.isDeleted && m.body)
      .map((m) => `User ${m.senderId}: ${m.body}`)
      .join("\n");

    const prompt = `You are a helpful assistant inside a team chat app called Vartaa.
Summarize the following chat messages in 2-4 sentences.
Focus on: what was discussed, what decisions were made, and any action items.
Do NOT include greetings or filler. Write in past tense. Plain text only, no markdown.

Messages:
${formatted}`;

    return await callGemini(prompt);
  },
});

export const getSmartReplies = action({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }): Promise<string[]> => {
    const messages = await ctx.runQuery(api.messages.getMessages, { roomId, limit: 5 });
    if (!messages.length) return [];

    const formatted = messages
      .filter((m) => !m.isDeleted && m.body)
      .map((m) => `User ${m.senderId}: ${m.body}`)
      .join("\n");

    const prompt = `You are an assistant inside a team chat app called Vartaa.
Given the recent conversation, suggest exactly 3 short reply options.
Rules:
- Each reply must be under 10 words
- Replies must be natural and relevant to the last message
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

export const extractTask = action({
  args: { roomId: v.id("rooms"), text: v.string() },
  handler: async (ctx, { roomId, text }): Promise<{ taskTitle: string; assignee: string | null; dueDate: string | null }> => {
    const prompt = `You are a task extraction assistant inside a team chat app called Vartaa.
Extract a task from the following chat message.
Message: "${text}"

Respond with ONLY a JSON object:
{
  "taskTitle": "short action-oriented task title under 10 words starting with a verb",
  "assignee": "name of person mentioned or null",
  "dueDate": "due date in natural language or null"
}
No explanation. Just the JSON.`;

    try {
      return await callGeminiJSON(prompt);
    } catch {
      return { taskTitle: text.slice(0, 50), assignee: null, dueDate: null };
    }
  },
});

export const generateContextualReply = action({
  args: {
    recentMessages: v.array(v.object({
      content: v.string(),
      isFromMe: v.boolean(),
      senderName: v.optional(v.string()),
    })),
    userLang: v.string(),
  },
  handler: async (_ctx, { recentMessages, userLang }) => {
    const langNames: Record<string, string> = {
      'en-IN': 'English', 'hi-IN': 'Hindi', 'bn-IN': 'Bengali',
      'ta-IN': 'Tamil', 'te-IN': 'Telugu', 'mr-IN': 'Marathi',
      'gu-IN': 'Gujarati', 'kn-IN': 'Kannada', 'ml-IN': 'Malayalam',
      'pa-IN': 'Punjabi', 'ja-JP': 'Japanese', 'es-ES': 'Spanish',
      'fr-FR': 'French', 'de-DE': 'German',
    }
    const langName = langNames[userLang] || 'English'
    const context = recentMessages
      .slice(-6)
      .map(m => `${m.isFromMe ? 'Me' : (m.senderName || 'Other')}: ${m.content}`)
      .join('\n')
    const prompt = `You are a smart chat assistant. Based on this 
conversation, write a natural friendly reply in ${langName}. 
Output ONLY the reply — no quotes, no labels. Max 2 sentences.

Conversation:
${context}

Reply in ${langName}:`
    return await callGemini(prompt)
  }
})

export const checkTone = action({
  args: { message: v.string() },
  handler: async (ctx, { message }): Promise<{ flagged: boolean; reason: string; suggestion: string }> => {
    const prompt = `You are a tone checker inside a professional team chat app called Vartaa.
Analyze if this message could be perceived as harsh, rude, or passive-aggressive.

Message: "${message}"

Respond with ONLY a JSON object:
{
  "flagged": true or false,
  "reason": "brief reason if flagged, empty string if not",
  "suggestion": "a friendlier rewrite if flagged, empty string if not"
}
Be conservative — only flag clearly problematic messages.`;

    try {
      return await callGeminiJSON(prompt);
    } catch {
      return { flagged: false, reason: "", suggestion: "" };
    }
  },
});
