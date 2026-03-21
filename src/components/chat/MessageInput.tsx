'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import VoiceRecorder from './VoiceRecorder'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Mic, Languages } from 'lucide-react'
import SmartReplies from '@/components/features/SmartReplies'

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

export default function MessageInput({ roomId }: { roomId: Id<'rooms'> }) {
  const { user } = useCurrentUser()
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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
        <div style={{ padding: '16px 20px 8px' }}>
            <textarea
              ref={inputRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Reply..."
              disabled={isRecording || isSending}
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
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <VoiceRecorder roomId={roomId} onRecordingChange={setIsRecording} />
          </div>
        </div>
      </div>
    </div>
  )
}
