'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useMutation, useAction } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { useAuthActions } from '@convex-dev/auth/react'
import { useRouter } from 'next/navigation'
import VoiceRecorder from './VoiceRecorder'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Mic, Languages, Puzzle, PenLine, Loader2, LogOut } from 'lucide-react'
import SmartReplies from '@/components/features/SmartReplies'
import { ALL_LANGUAGES } from '@/lib/languages'

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

const LANGUAGES = ALL_LANGUAGES

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
  const { signOut } = useAuthActions()
  const router = useRouter()
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isLangMenuOpen && !(e.target as HTMLElement).closest('.lang-selector')) {
        setIsLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isLangMenuOpen])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const selectedLang = ALL_LANGUAGES.find(l => l.code === user?.preferredLang) ?? ALL_LANGUAGES[0]
  
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendMessage = useMutation(api.messages.sendMessage)
  const setTyping = useMutation(api.messages.setTyping)
  const updatePreferredLang = useMutation(api.users.updatePreferredLang)
  const generateReply = useAction(api.actions.ai.generateContextualReply)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleLangChange = async (lang: string) => {
    try {
      await updatePreferredLang({ lang })
      setIsLangMenuOpen(false)
    } catch (err) {
      console.error('Failed to update language:', err)
    }
  }

  const handleSurprise = () => {
    const list = SURPRISE_MESSAGES[userPreferredLang] || SURPRISE_MESSAGES[selectedLang.code] || SURPRISE_MESSAGES['en-IN']
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

  const handleLogout = async () => {
    if (isLogoutLoading) return
    setIsLogoutLoading(true)
    try {
      await signOut()
      router.push('/')
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setIsLogoutLoading(false)
    }
  }

  return (
    <div style={{ padding: isMobile ? '0 16px 16px' : '0 40px 10px', flexShrink: 0, position: 'relative' }}>
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
      }}>
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
          display: 'flex', alignItems: 'center', padding: isMobile ? '8px 12px 12px' : '8px 20px 12px',
          gap: isMobile ? 8 : 4,
        }}>
          {/* Language Selector Dropdown */}
          <div className="lang-selector" style={{ position: 'relative' }}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px',
                color: isLangMenuOpen ? 'var(--obsidian-primary)' : 'var(--obsidian-text-faint)', 
                fontSize: isMobile ? 8 : 9, textTransform: 'uppercase', letterSpacing: '0.25em',
                fontFamily: 'Geist, sans-serif', fontWeight: 500,
                background: isLangMenuOpen ? 'rgba(201,168,76,0.1)' : 'transparent',
                border: 'none', borderRadius: 4, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => !isLangMenuOpen && (e.currentTarget.style.color = 'var(--obsidian-text-muted)')}
              onMouseLeave={e => !isLangMenuOpen && (e.currentTarget.style.color = 'var(--obsidian-text-faint)')}
            >
              <Languages size={12} strokeWidth={1.5} />
              <span>{selectedLang.label}</span>
            </button>

            {isLangMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 8,
                width: 240,
                maxHeight: 280,
                background: '#0d0d0d',
                border: '1px solid #1a1a1a',
                borderRadius: 10,
                boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
                overflowY: 'auto',
                zIndex: 1000,
                padding: 6,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}>
                <div style={{ padding: '6px 10px 4px', fontSize: 8, color: 'var(--obsidian-text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Target Language
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: selectedLang.code === lang.code ? 'rgba(201,168,76,0.15)' : 'transparent',
                      border: 'none',
                      color: selectedLang.code === lang.code ? 'var(--obsidian-primary)' : 'var(--obsidian-text)',
                      fontSize: 11,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = selectedLang.code === lang.code ? 'rgba(201,168,76,0.15)' : 'transparent'}
                  >
                    <span>{lang.label}</span>
                    <span style={{ fontSize: 9, opacity: 0.5 }}>{lang.native}</span>
                  </button>
                ))}
              </div>
            )}
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
