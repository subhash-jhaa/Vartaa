'use client'
import { useState, useEffect } from 'react'
import { useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'

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

  if (loading || replies.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
      {replies.map((r, i) => (
        <button
          key={i}
          onClick={() => { onSelect(r); setReplies([]) }}
          style={{ fontSize: 12, color: '#c8c5be', background: 'rgba(240,237,230,0.05)', border: '1px solid rgba(240,237,230,0.1)', borderRadius: 100, padding: '4px 12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(240,237,230,0.1)'; e.currentTarget.style.color = '#f0ede6' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(240,237,230,0.05)'; e.currentTarget.style.color = '#c8c5be' }}
        >
          {r}
        </button>
      ))}
    </div>
  )
}