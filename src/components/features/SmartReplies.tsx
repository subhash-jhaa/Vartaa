'use client'
import { useState, useEffect } from 'react'
import { useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { Sparkles, Loader2 } from 'lucide-react'

interface SmartRepliesProps {
  roomId: Id<'rooms'>
  onSelect: (reply: string) => void
}

export default function SmartReplies({ roomId, onSelect }: SmartRepliesProps) {
  const [replies, setReplies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const getSmartReplies = useAction(api.actions.ai.getSmartReplies)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const result = await getSmartReplies({ roomId })
        if (!cancelled) setReplies(result)
      } catch {
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    const timer = setTimeout(load, 1000)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [roomId, getSmartReplies])

  if (loading && replies.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', marginBottom: 12 }}>
        <Loader2 size={10} className="animate-spin" color="var(--obsidian-text-faint)" />
        <span style={{ fontSize: 9, color: 'var(--obsidian-text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Thinking...</span>
      </div>
    )
  }

  if (replies.length === 0) return null

  return (
    <div style={{ padding: '0 8px', marginBottom: 16 }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, opacity: 0.6 }}>
        <Sparkles size={10} color="var(--obsidian-primary)" />
        <span style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--obsidian-text-faint)', fontWeight: 700 }}>AI Suggested Replies</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {replies.map((r, i) => (
          <button
            key={i}
            onClick={() => { onSelect(r); setReplies([]) }}
            style={{ 
              fontSize: 12, 
              color: 'var(--obsidian-text)', 
              background: 'var(--obsidian-surface-soft)', 
              border: '1px solid var(--obsidian-border)', 
              borderRadius: 100, 
              padding: '6px 14px', 
              cursor: 'pointer', 
              whiteSpace: 'nowrap', 
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.background = 'var(--obsidian-surface)'; 
              e.currentTarget.style.borderColor = 'var(--obsidian-primary-alpha)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.color = 'var(--obsidian-primary)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.background = 'var(--obsidian-surface-soft)'; 
              e.currentTarget.style.borderColor = 'var(--obsidian-border)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.color = 'var(--obsidian-text)';
            }}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}