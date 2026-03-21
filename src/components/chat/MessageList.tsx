'use client'
import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import MessageItem from './MessageItem'
import { useEffect, useRef, useState } from 'react'

export default function MessageList({ roomId }: { roomId: Id<'rooms'> }) {
  const { user } = useCurrentUser()
  const messages = useQuery(api.messages.getMessages, { roomId, limit: 50 })
  const typingUsers = useQuery(api.messages.getTypingUsers, { roomId })
  const bottomRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages?.length])

  if (messages === undefined) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 16, height: 16, border: '1px solid rgba(229,192,123,0.2)', borderTopColor: '#e5c07b', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '32px 16px' : '64px 128px', display: 'flex', flexDirection: 'column', gap: isMobile ? 48 : 112, background: 'var(--obsidian-bg)' }}>
      {messages.length === 0 && (
        <div style={{ textAlign: 'center', color: '#404040', fontSize: 13, fontStyle: 'italic', fontFamily: 'Instrument Serif, Georgia, serif', padding: '80px 0' }}>
          No messages yet. Express your thought.
        </div>
      )}

      {messages.map((msg, idx) => {
        const prevMsg = messages[idx - 1]
        const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId || (msg.createdAt - prevMsg.createdAt) > 5 * 60 * 1000
        return (
          <MessageItem key={msg._id} message={msg} isOwn={msg.senderId === user?._id} showAvatar={showAvatar} userPreferredLang={user?.preferredLang ?? 'en-IN'} />
        )
      })}

      {typingUsers && typingUsers.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '32px 0', borderTop: '1px solid var(--obsidian-border)', width: isMobile ? '100%' : '50%', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(229,192,123,0.3)', animation: `subtle-pulse 3s infinite ease-in-out ${i * 0.3}s` }} />
              ))}
            </div>
            <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--obsidian-text-faint)' }}>
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} translating...
            </span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
