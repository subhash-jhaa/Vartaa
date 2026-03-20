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
      // 1. Get audio from Convex storage
      const audioUrl = await ctx.storage.getUrl(audioStorageId);
      if (!audioUrl) throw new Error("Audio not found in storage");

      const audioRes = await fetch(audioUrl);
      const audioBlob = await audioRes.blob();

      // 2. Transcribe with Sarvam Saaras v3
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.webm");
      formData.append("model", "saaras:v3");
      formData.append("mode", "transcribe");

      const sttRes = await fetch("https://api.sarvam.ai/speech-to-text", {
        method: "POST",
        headers: { "api-subscription-key": process.env.SARVAM_API_KEY! },
        body: formData,
      });

      const sttData = await sttRes.json();
      if (!sttRes.ok) throw new Error(sttData.message ?? "STT failed");

      const transcript = sttData.transcript as string;
      const originalLang = sttData.language_code as string ?? "hi-IN";

      // 3. Get room member language preferences
      const room = await ctx.runQuery(internal.rooms.getRoomInternal, { roomId });
      const members = await ctx.runQuery(api.users.getUsersByIds, { userIds: room.memberIds });
      const targetLangs = [...new Set(
        members.filter(Boolean).map((m: any) => m.preferredLang as string)
      )].filter((l): l is string => typeof l === 'string' && l !== originalLang);

      // 4. Translate transcript to each target language
      const translations: Record<string, string> = {};
      for (const targetLang of targetLangs) {
        try {
          const trRes = await fetch("https://api.sarvam.ai/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json", "api-subscription-key": process.env.SARVAM_API_KEY! },
            body: JSON.stringify({
              input: transcript,
              source_language_code: originalLang,
              target_language_code: targetLang,
              model: "mayura:v1",
              mode: "modern-colloquial",
            }),
          });
          const trData = await trRes.json();
          if (trRes.ok) translations[targetLang as string] = trData.translated_text;
        } catch { }
      }

      // 5. Update message with transcript + translations
      await ctx.runMutation(internal.messages.updateTranslations, {
        messageId,
        translations,
        originalLang,
      });

      // Also patch transcript field separately
      await ctx.runMutation(internal.messages.updateTranscript, { messageId, transcript });

    } catch (err) {
      console.error("STT action failed:", err);
    }
  },
});

