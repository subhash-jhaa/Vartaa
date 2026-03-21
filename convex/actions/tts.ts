"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";

export const textToSpeechAction = action({
  args: {
    text: v.string(),
    languageCode: v.string(),
    speaker: v.optional(v.string()),
  },
  handler: async (ctx, { text, languageCode, speaker = "meera" }): Promise<string | null> => {
    try {
      const res = await fetch("https://api.sarvam.ai/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": process.env.SARVAM_API_KEY!,
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: languageCode,
          speaker,
          model: "bulbul:v2",
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          enable_preprocessing: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Sarvam TTS failed");
      return data.audios[0] as string;
    } catch (err) {
      console.error("TTS failed:", err);
      return null;
    }
  },
});
