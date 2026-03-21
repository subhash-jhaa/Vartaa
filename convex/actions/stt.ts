"use node";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal, api } from "../_generated/api";

export const transcribeAndTranslate = internalAction({
  args: {
    messageId: v.id("messages"),
    audioStorageId: v.id("_storage"),
    roomId: v.id("rooms"),
  },
  handler: async (ctx, { messageId, audioStorageId, roomId }) => {
    try {
      // 1. Get audio URL from Convex storage
      const audioUrl = await ctx.storage.getUrl(audioStorageId);
      if (!audioUrl) throw new Error("Audio not found in storage");

      const audioRes = await fetch(audioUrl);
      const audioBlob = await audioRes.blob();

      // 2. Transcribe with Sarvam Saaras v2
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.webm");
      formData.append("model", "saaras:v2");
      formData.append("mode", "transcribe");

      const sttRes = await fetch("https://api.sarvam.ai/speech-to-text", {
        method: "POST",
        headers: {
          "api-subscription-key": process.env.SARVAM_API_KEY!,
        },
        body: formData,
      });

      const sttData = await sttRes.json();
      if (!sttRes.ok) throw new Error(sttData.message ?? "STT failed");

      const transcript = sttData.transcript as string;
      const originalLang = (sttData.language_code as string) ?? "hi-IN";

      // 3. Save transcript
      await ctx.runMutation(internal.messages.updateTranscript, {
        messageId,
        transcript,
      });

      // 4. Get room member language preferences
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

      // 5. Translate transcript to each target language
      const translations: Record<string, string> = {};
      for (const targetLang of targetLangs) {
        try {
          const trRes = await fetch("https://api.sarvam.ai/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-subscription-key": process.env.SARVAM_API_KEY!,
            },
            body: JSON.stringify({
              input: transcript,
              source_language_code: originalLang,
              target_language_code: targetLang,
              model: "mayura:v1",
              mode: "modern-colloquial",
            }),
          });
          const trData = await trRes.json();
          if (trRes.ok) translations[targetLang] = trData.translated_text;
        } catch {}
      }

      // 6. Save translations
      await ctx.runMutation(internal.messages.updateTranslations, {
        messageId,
        translations,
        originalLang,
      });
    } catch (err) {
      console.error("STT action failed:", err);
    }
  },
});
