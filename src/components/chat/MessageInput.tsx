'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useMutation, useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import VoiceRecorder from './VoiceRecorder'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Mic, Languages, Puzzle, PenLine, Loader2 } from 'lucide-react'
import SmartReplies from '@/components/features/SmartReplies'

const SURPRISE_MESSAGES: Record<string, string[]> = {
  'en-IN': ["Hey! How's your day going? 😊", "What's up! Hope you're having a great time! ✨", "Hi there! Anything fun happening today? 🎉"],
  'hi-IN': ["अरे! कैसे हो? 😊", "नमस्ते! आज कैसा दिन चल रहा है? ✨", "क्या हाल है दोस्त? 🎉"],
  'bn-IN': ["হ্যালো! কেমন আছো? 😊", "কী খবর? ✨", "আজ কেমন দিন? 🎉"],
  'ta-IN': ["வணக்கம்! எப்படி இருக்கீங்க? 😊", "என்ன விசேஷம்? ✨", "நல்லா இருக்கீங்களா? 🎉"],
  'te-IN': ["హాయ్! ఎలా ఉన్నారు? 😊", "ఏంటి విశేషం? ✨", "బాగున్నారా? 🎉"],
  'mr-IN': ["नमस्कार! कसे आहात? 😊", "काय चाललंय? ✨", "मजेत आहात ना? 🎉"],
  'gu-IN': ["હેલો! કેમ છો? 😊", "શું ચાલે છે? ✨", "મજામાં છો? 🎉"],
  'kn-IN': ["ಹಾಯ್! ಹೇಗಿದ್ದೀರಾ? 😊", "ಏನು ವಿಶೇಷ? ✨", "ಚೆನ್ನಾಗಿದ್ದೀರಾ? 🎉"],
  'ml-IN': ["ഹായ്! എങ്ങനെ ഉണ്ട്? 😊", "എന്താ വിശേഷം? ✨", "സുഖമാണോ? 🎉"],
  'pa-IN': ["ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਕਿਵੇਂ ਹੋ? 😊", "ਕੀ ਹਾਲ ਹੈ? ✨", "ਮਜ਼ੇ ਵਿੱਚ ਹੋ? 🎉"],
  'ja-JP': ["やあ！元気？😊", "こんにちは！調子どう？✨", "今日はいい日？🎉"],
  'es-ES': ["¡Hola! ¿Cómo estás? 😊", "¿Qué tal? ✨", "¡Saludos! 🎉"],
  'fr-FR': ["Salut ! Comment ça va ? 😊", "Coucou ! Quoi de neuf ? ✨", "Hello ! 🎉"],
  'de-DE': ["Hallo! Wie geht's? 😊", "Hey! Was gibt's? ✨", "Na, alles klar? 🎉"],
}

const LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi', native: 'हिंदी' },
  { code: 'bn-IN', label: 'Bengali', native: 'বাংলা' },
  { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr-IN', label: 'Marathi', native: 'মরাठी' },
  { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { code: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa-IN', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or-IN', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as-IN', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur-IN', label: 'Urdu', native: 'اردو' },
  { code: 'en-IN', label: 'English', native: 'English' },
  { code: 'es-ES', label: 'Spanish', native: 'Español' },
  { code: 'fr-FR', label: 'French', native: 'Français' },
  { code: 'de-DE', label: 'German', native: 'Deutsch' },
  { code: 'ja-JP', label: 'Japanese', native: '日本語' },
  { code: 'zh-CN', label: 'Chinese', native: '中文' },
  { code: 'ar-SA', label: 'Arabic', native: 'العربية' },
  { code: 'pt-BR', label: 'Portuguese', native: 'Português' },
]

export default function MessageInput({ 
  roomId, 
  userPreferredLang, 
  recentMessages 
}: { 
  roomId: Id<'rooms'>,
  userPreferredLang: string,
  recentMessages: { content: string; isFromMe: boolean; senderName?: string }[]
}) {
  const { user } = useCurrentUser()
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const selectedLang = LANGUAGES.find(l => l.code === user?.preferredLang) ?? LANGUAGES[12]
  
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendMessage = useMutation(api.messages.sendMessage)
  const setTyping = useMutation(api.messages.setTyping)
  const generateReply = useAction(api.actions.ai.generateContextualReply)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSurprise = () => {
    const list = SURPRISE_MESSAGES[userPreferredLang] || SURPRISE_MESSAGES['en-IN']
    const random = list[Math.floor(Math.random() * list.length)]
    setText(random)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
        inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
        inputRef.current.focus()
      }
    }, 0)
  }

  const handleAiReply = async () => {
    if (recentMessages.length === 0 || isAiLoading) return
    setIsAiLoading(true)
    try {
      const reply = await generateReply({ recentMessages, userLang: userPreferredLang })
      setText(reply)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.height = 'auto'
          inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
          inputRef.current.focus()
        }
      }, 0)
    } catch (err) {
      console.error('AI Reply failed:', err)
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
    setTyping({ roomId, isTyping: true }).catch(() => {})
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => setTyping({ roomId, isTyping: false }).catch(() => {}), 2000)
  }

  const handleSend = useCallback(async () => {
    const body = text.trim()
    if (!body || isSending) return
    setIsSending(true)
    setText('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    if (typingTimer.current) clearTimeout(typingTimer.current)
    await setTyping({ roomId, isTyping: false }).catch(() => {})
    try {
      await sendMessage({ roomId, body })
    } catch {
      setText(body)
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }, [text, isSending, roomId, sendMessage, setTyping])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div style={{ padding: isMobile ? '0 16px 16px' : '0 40px 32px', flexShrink: 0, position: 'relative' }}>
      <SmartReplies 
        roomId={roomId} 
        onSelect={(reply: string) => {
          setText(reply)
          if (inputRef.current) {
            inputRef.current.style.height = 'auto'
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
            inputRef.current.focus()
          }
        }} 
      />
      {/* Main input box */}
      <div style={{
        background: 'var(--obsidian-surface)',
        borderRadius: 16,
        border: '1px solid var(--obsidian-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
        transition: 'border-color 0.3s',
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--obsidian-primary-alpha)'}
        onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--obsidian-border)'}
      >
        {/* Text area */}
        <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <button
              onClick={handleSurprise}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4,
                color: 'var(--obsidian-text-faint)', transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--obsidian-text-muted)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--obsidian-text-faint)'}
              title="Surprise Message"
            >
              <Puzzle size={18} strokeWidth={1.5} />
            </button>
            <textarea
              ref={inputRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Reply..."
              disabled={isRecording || isSending || isAiLoading}
              rows={1}
              style={{
                width: '100%', background: 'none', border: 'none', outline: 'none',
                color: 'var(--obsidian-text)', fontSize: 14, resize: 'none', lineHeight: 1.6,
                fontFamily: 'Geist, sans-serif', minHeight: 28, maxHeight: 120,
                overflowY: 'auto', boxSizing: 'border-box',
              }}
            />
        </div>

        {/* Bottom toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', padding: '8px 12px 12px',
          gap: 4,
        }}>
          {/* Language Indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px',
            color: 'var(--obsidian-text-faint)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.25em',
            fontFamily: 'Geist, sans-serif', fontWeight: 500
          }}>
            <Languages size={12} strokeWidth={1.5} />
            <span>{selectedLang.label}</span>
          </div>

          {/* Right side */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {recentMessages.length > 0 && (
              <button
                onClick={handleAiReply}
                disabled={isAiLoading}
                style={{
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  borderRadius: 8,
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#a78bfa',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: isAiLoading ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                  fontFamily: 'Geist, sans-serif',
                }}
                onMouseEnter={e => !isAiLoading && (e.currentTarget.style.background = 'rgba(139,92,246,0.15)')}
                onMouseLeave={e => !isAiLoading && (e.currentTarget.style.background = 'rgba(139,92,246,0.1)')}
              >
                {isAiLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <PenLine size={12} strokeWidth={2} />
                )}
                <span>AI Reply</span>
              </button>
            )}
            <VoiceRecorder roomId={roomId} onRecordingChange={setIsRecording} />
          </div>
        </div>
      </div>
    </div>
  )
}
