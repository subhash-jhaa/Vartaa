'use client'
import { useState, useRef, useCallback } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import VoiceRecorder from './VoiceRecorder'
import SmartReplies from '../features/SmartReplies'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function MessageInput({ roomId }: { roomId: Id<'rooms'> }) {
  const { user, isAuthenticated } = useCurrentUser()
  const { isMobile } = useIsMobile()
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const sendMessage = useMutation(api.messages.sendMessage)
  const setTyping = useMutation(api.messages.setTyping)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`
    if (!isAuthenticated) return
    setTyping({ roomId, isTyping: true }).catch(() => {})
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      setTyping({ roomId, isTyping: false }).catch(() => {})
    }, 2000)
  }

  const handleSend = useCallback(async () => {
    const body = text.trim()
    if (!body || !isAuthenticated || isSending) return
    setIsSending(true)
    setText('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    if (typingTimer.current) clearTimeout(typingTimer.current)
    await setTyping({ roomId, isTyping: false }).catch(() => {})
    try {
      await sendMessage({ roomId, body })
    } catch (err) {
      console.error('Send failed:', err)
      setText(body)
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }, [text, isAuthenticated, isSending, roomId, sendMessage, setTyping])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ padding: isMobile ? '12px 12px' : '12px 20px', borderTop: '1px solid rgba(240,237,230,0.07)', flexShrink: 0 }}>
      <SmartReplies
        roomId={roomId}
        onSelect={(reply: string) => {
          setText(reply)
          requestAnimationFrame(() => {
            if (!inputRef.current) return
            inputRef.current.focus()
            inputRef.current.style.height = 'auto'
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 140)}px`
          })
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, background: '#111110', border: '1px solid rgba(240,237,230,0.1)', borderRadius: 10, padding: '8px 12px', transition: 'border-color 0.2s' }}>
        <VoiceRecorder roomId={roomId} onRecordingChange={setIsRecording} />

        <textarea
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? 'Recording...' : 'Message this room...'}
          disabled={isRecording || isSending}
          rows={1}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#f0ede6',
            fontSize: 16, // Better for iOS focus
            resize: 'none',
            lineHeight: 1.5,
            fontFamily: 'var(--font-geist, sans-serif)',
            minHeight: 24,
            maxHeight: 140,
            overflowY: 'auto',
            paddingTop: 4,
          }}
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() || isSending}
          style={{
            width: isMobile ? 36 : 30,
            height: isMobile ? 36 : 30,
            borderRadius: 7,
            border: 'none',
            cursor: 'pointer',
            background: text.trim() ? '#f0ede6' : 'rgba(240,237,230,0.08)',
            color: text.trim() ? '#0c0c0b' : '#6b6960',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s',
            fontSize: 14,
          }}
        >
          {isSending ? '...' : '↑'}
        </button>
      </div>

      {!isMobile && (
        <p style={{ fontSize: 11, color: '#6b6960', marginTop: 6, paddingLeft: 2 }}>
          Enter to send · Shift+Enter for newline
        </p>
      )}
    </div>
  )
}
