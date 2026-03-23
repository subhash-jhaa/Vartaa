"use node";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal, api } from "../_generated/api";

function isLikelyEnglish(text: string): boolean {
  const asciiCount = [...text].filter(c => c.charCodeAt(0) < 128).length;
  return asciiCount / text.length > 0.9;
}

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  const timer = new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms));
  return Promise.race([promise, timer]);
}

async function detectLanguage(text: string): Promise<string> {
  if (isLikelyEnglish(text)) return "en-IN";
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

async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  if (sourceLang === targetLang) return text;

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
      enable_preprocessing: true,
    }),
  });

  const data = await res.json();
  console.log("[translate] Sarvam response:", res.status, JSON.stringify(data));
  if (!res.ok) throw new Error(`Sarvam ${res.status}: ${JSON.stringify(data)}`);
  if (!data.translated_text) throw new Error(`No translated_text: ${JSON.stringify(data)}`);
  return data.translated_text as string;
}

export const translateMessageAction = internalAction({
  args: {
    messageId: v.id("messages"),
    text: v.string(),
    roomId: v.id("rooms"),
    targetLang: v.optional(v.string()),   // NEW: specific language to translate to
  },
  handler: async (ctx, { messageId, text, roomId, targetLang }) => {
    console.log("[translate] START — text:", text.slice(0, 60), "targetLang:", targetLang);
    console.log("[translate] SARVAM_API_KEY set:", !!process.env.SARVAM_API_KEY);

    try {
      // Detect source language
      const originalLang = await withTimeout(detectLanguage(text), 3000, "en-IN");
      console.log("[translate] originalLang:", originalLang);

      // On-demand mode: only translate to the one requested language
      const targetLangs = targetLang
        ? [targetLang].filter(l => l !== originalLang)
        : [];   // auto-translate on send is disabled — targetLang is always provided now

      if (targetLangs.length === 0) {
        // Source and target are the same — no translation needed
        await ctx.runMutation(internal.messages.updateTranslations, {
          messageId,
          translations: {},
          originalLang,
          translationStatus: "skipped",
        });
        return;
      }

      // Translate to all requested languages in parallel
      const results = await Promise.allSettled(
        targetLangs.map(async (lang) => {
          const translated = await withTimeout(
            translateText(text, originalLang, lang),
            6000,
            ""
          );
          return { lang, text: translated };
        })
      );

      // Fetch existing translations from DB so we don't overwrite other languages
      const message = await ctx.runQuery(api.messages.getMessageById, { messageId });
      const existingTranslations = (message?.translations as Record<string, string>) ?? {};

      // Merge new translations into existing ones
      const translations: Record<string, string> = { ...existingTranslations };
      for (const result of results) {
        if (result.status === "fulfilled" && result.value.text) {
          translations[result.value.lang] = result.value.text;
        } else if (result.status === "rejected") {
          console.error("[translate] failed:", result.reason);
        }
      }

      console.log("[translate] translations:", Object.keys(translations));

      await ctx.runMutation(internal.messages.updateTranslations, {
        messageId,
        translations,
        originalLang,
        translationStatus: "done",
      });

    } catch (err) {
      console.error("[translate] FATAL:", err);
      await ctx.runMutation(internal.messages.updateTranslations, {
        messageId,
        translations: {},
        originalLang: "en-IN",
        translationStatus: "failed",
      });
    }
  },
});
