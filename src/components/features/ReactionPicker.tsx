'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🙏', '🔥', '✅']

export default function ReactionDisplay({ messageId }: { messageId: Id<'messages'> }) {
  const reactions = useQuery(api.reactions.getReactions, { messageId })
  const toggleReaction = useMutation(api.reactions.toggleReaction)
  const { user, isAuthenticated } = useCurrentUser()

  if (!reactions || reactions.length === 0) {
    // Show quick emojis if no reactions yet (optional UI decision)
    return null 
  }

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
      {reactions.map((r) => {
        const isMyReaction = !!user && r.userIds.includes(user._id)
        return (
          <button
            key={r.emoji}
            onClick={() => {
              if (!isAuthenticated) return
              toggleReaction({ messageId, emoji: r.emoji }).catch(console.error)
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: isMyReaction ? 'rgba(240,237,230,0.1)' : 'rgba(240,237,230,0.04)',
              border: `1px solid ${isMyReaction ? 'rgba(240,237,230,0.2)' : 'rgba(240,237,230,0.07)'}`,
              borderRadius: 100, padding: '2px 8px', cursor: 'pointer',
              fontSize: 13, color: '#c8c5be', transition: 'all 0.15s',
            }}
          >
            <span>{r.emoji}</span>
            <span style={{ fontSize: 11 }}>{r.count}</span>
          </button>
        )
      })}
    </div>
  )
}
