'use client'
import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import MessageItem from './MessageItem'
import { useEffect, useRef } from 'react'

export default function MessageList({ roomId }: { roomId: Id<'rooms'> }) {
  const { user, isAuthenticated } = useCurrentUser()
  const messages = useQuery(api.messages.getMessages, { roomId, limit: 50 })
  const typingUsers = useQuery(api.messages.getTypingUsers, isAuthenticated ? { roomId } : 'skip')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Collect unique sender IDs and fetch them in bulk
  const senderIds = [...new Set(messages?.map(m => m.senderId) ?? [])] as Id<'users'>[]
  const senders = useQuery(
    api.users.getUsersByIds,
    senderIds.length > 0 ? { userIds: senderIds } : 'skip'
  )

  // Build a lookup map for senders
  const senderMap: Record<string, any> = {}
  senders?.forEach(u => {
    if (u) senderMap[u._id] = u
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages?.length])

  if (messages === undefined) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 20, height: 20, border: '2px solid rgba(240,237,230,0.15)', borderTopColor: '#c8c5be', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
      {messages.length === 0 && (
        <div style={{ textAlign: 'center', color: '#6b6960', fontSize: 13, padding: '40px 20px' }}>
          No messages yet. Say hello!
        </div>
      )}

      {messages.map((msg, idx) => {
        const prevMsg = messages[idx - 1]
        const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId ||
          (msg.createdAt - prevMsg.createdAt) > 5 * 60 * 1000
        return (
          <MessageItem
            key={msg._id}
            message={msg}
            sender={senderMap[msg.senderId] ?? null}
            isOwn={msg.senderId === user?._id}
            showAvatar={showAvatar}
            userPreferredLang={user?.preferredLang ?? 'en-IN'}
          />
        )
      })}

      {typingUsers && typingUsers.length > 0 && (
        <div style={{ padding: '4px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#6b6960', animation: `bounce 1s ease infinite ${i * 0.2}s`, display: 'inline-block' }} />
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#6b6960' }}>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
