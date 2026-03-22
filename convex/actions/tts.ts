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
      const lowerText = text.toLowerCase()
      let pace = 1.0
      let temperature = 0.6

      if (
        lowerText.includes('!') || lowerText.includes('wow') ||
        lowerText.includes('great') || lowerText.includes('happy') ||
        lowerText.includes('amazing') || lowerText.includes('excited')
      ) {
        pace = 1.15
        temperature = 0.8
      } else if (
        lowerText.includes('sorry') || lowerText.includes('sad') ||
        lowerText.includes('please') || lowerText.includes('...') ||
        text.length > 100
      ) {
        pace = 0.9
        temperature = 0.5
      }

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
          model: "bulbul:v3",
          pitch: 0,
          pace,
          temperature,
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
