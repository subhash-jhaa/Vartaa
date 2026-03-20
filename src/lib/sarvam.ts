const SARVAM_BASE = 'https://api.sarvam.ai'
const KEY = process.env.SARVAM_API_KEY!

export async function sarvamTranslate(text: string, sourceLang: string, targetLang: string): Promise<string> {
  const res = await fetch(`${SARVAM_BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-subscription-key': KEY },
    body: JSON.stringify({ input: text, source_language_code: sourceLang, target_language_code: targetLang, model: 'mayura:v1', mode: 'modern-colloquial' }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? 'Sarvam translate failed')
  return data.translated_text
}

export async function sarvamTTS(text: string, langCode: string, speaker = 'meera'): Promise<string> {
  const res = await fetch(`${SARVAM_BASE}/text-to-speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-subscription-key': KEY },
    body: JSON.stringify({ inputs: [text], target_language_code: langCode, speaker, model: 'bulbul:v3', pitch: 0, pace: 1.0, loudness: 1.5, enable_preprocessing: true }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? 'Sarvam TTS failed')
  return data.audios[0] // base64 WAV string
}

export async function sarvamSTT(audioBlob: Blob, langCode?: string, mode = 'transcribe'): Promise<{ transcript: string; detectedLang: string }> {
  const form = new FormData()
  form.append('file', audioBlob, 'audio.wav')
  form.append('model', 'saaras:v3')
  form.append('mode', mode)
  if (langCode) form.append('language_code', langCode)
  const res = await fetch(`${SARVAM_BASE}/speech-to-text`, {
    method: 'POST',
    headers: { 'api-subscription-key': KEY },
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? 'Sarvam STT failed')
  return { transcript: data.transcript, detectedLang: data.language_code }
}

export async function sarvamDetectLang(text: string): Promise<string> {
  const res = await fetch(`${SARVAM_BASE}/text/lid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-subscription-key': KEY },
    body: JSON.stringify({ input: text }),
  })
  const data = await res.json()
  return data.language_code ?? 'en-IN'
}
