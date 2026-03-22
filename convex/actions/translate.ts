"use node";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal, api } from "../_generated/api";

async function detectLanguage(text: string): Promise<string> {
  const res = await fetch("https://api.sarvam.ai/text/lid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": process.env.SARVAM_API_KEY!,
    },
    body: JSON.stringify({ input: text }),
  });
  const data = await res.json();
  return data.language_code ?? "en-IN";
}

async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  if (sourceLang === targetLang) return text;
  
  // Sarvam supports 22 Indian languages. If target is foreign, we might need a fallback or different provider.
  // For now, let's assume Sarvam handles what's in our shared list or we log it.
  
  const res = await fetch("https://api.sarvam.ai/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": process.env.SARVAM_API_KEY!,
    },
    body: JSON.stringify({
      input: text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
      model: "mayura:v1",
      mode: "modern-colloquial",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Sarvam translate failed");
  return data.translated_text as string;
}

export const translateMessageAction = internalAction({
  args: {
    messageId: v.id("messages"),
    text: v.string(),
    roomId: v.id("rooms"),
  },
  handler: async (ctx, { messageId, text, roomId }) => {
    try {
      const originalLang = await detectLanguage(text);

      const room = await ctx.runQuery(api.rooms.getRoom, { roomId });
      if (!room) return;

     const members = await ctx.runQuery(api.users.getUsersByIds, { userIds: room.memberIds });

      const targetLangs = [
        ...new Set(
          members
            .filter(Boolean)
            .map((m: any) => m.preferredLang ?? "en-IN")
        ),
      ].filter((l) => l !== originalLang);

      const translations: Record<string, string> = {};
      for (const targetLang of targetLangs) {
        try {
          translations[targetLang] = await translateText(text, originalLang, targetLang);
        } catch (err) {
          console.error(`Translation to ${targetLang} failed:`, err);
        }
      }

      await ctx.runMutation(internal.messages.updateTranslations, {
        messageId,
        translations,
        originalLang,
      });

      try {
        const insightPrompt = `Original language: ${originalLang}
Text: "${text}"
Give ONE language learning tip (max 15 words) about this text —
a grammar pattern, cultural nuance, idiom meaning, or word origin.
Reply with ONLY the tip. No labels, no explanation.`

        const insightRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: insightPrompt }] }]
            }),
          }
        )
        const insightData = await insightRes.json()
        const tip = insightData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        if (tip) {
          await ctx.runMutation(internal.messages.updateLanguageInsight, {
            messageId,
            insight: tip,
          })
        }
      } catch (err) {
        console.error("Language insight failed:", err)
      }
    } catch (err) {
      console.error("Translation action failed:", err);
      await ctx.runMutation(internal.messages.updateTranslations, {
        messageId,
        translations: {},
        originalLang: "en-IN",
      });
    }
  },
});
