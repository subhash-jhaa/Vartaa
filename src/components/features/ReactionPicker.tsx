'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export default function ReactionDisplay({ messageId }: { messageId: Id<'messages'> }) {
  const reactions = useQuery(api.reactions.getReactions, { messageId })
  const toggleReaction = useMutation(api.reactions.toggleReaction)
  const { user, isAuthenticated } = useCurrentUser()

  if (!reactions || reactions.length === 0) {
    return null 
  }

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
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
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: isMyReaction ? 'var(--obsidian-primary-alpha)' : 'var(--obsidian-surface-soft)',
              border: `1px solid ${isMyReaction ? 'var(--obsidian-primary)' : 'var(--obsidian-border)'}`,
              borderRadius: 100, padding: '3px 10px', cursor: 'pointer',
              fontSize: 13, color: isMyReaction ? 'var(--obsidian-primary)' : 'var(--obsidian-text)', transition: 'all 0.2s ease',
              opacity: isMyReaction ? 1 : 0.8,
              boxShadow: isMyReaction ? '0 0 12px var(--obsidian-primary-alpha)' : 'none'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1';
              if (!isMyReaction) e.currentTarget.style.borderColor = 'var(--obsidian-text-faint)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = isMyReaction ? '1' : '0.8';
              if (!isMyReaction) e.currentTarget.style.borderColor = 'var(--obsidian-border)';
            }}
          >
            <span>{r.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: isMyReaction ? 700 : 500, opacity: 0.8 }}>{r.count}</span>
          </button>
        )
      })}
    </div>
  )
}
