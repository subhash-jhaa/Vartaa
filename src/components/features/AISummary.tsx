'use client'
import { useState } from 'react'
import { useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'

export default function AISummaryButton({ roomId }: { roomId: Id<'rooms'> }) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const summarize = useAction(api.actions.ai.summarizeThread)

  const handleClick = async () => {
    if (summary) { setOpen((o) => !o); return }
    setLoading(true)
    try {
      const result = await summarize({ roomId })
      setSummary(result)
      setOpen(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{ fontSize: 12, color: '#c8c5be', background: 'rgba(240,237,230,0.05)', border: '1px solid rgba(240,237,230,0.1)', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
      >
        {loading ? '...' : '✦ Catch me up'}
      </button>

      {open && summary && (
        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 320, background: '#111110', border: '1px solid rgba(240,237,230,0.13)', borderRadius: 10, padding: '14px 16px', zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: '#c8c5be', fontWeight: 500 }}>✦ AI Summary</span>
            <button onClick={() => { setOpen(false); setSummary(null) }} style={{ fontSize: 12, color: '#6b6960', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Refresh</button>
          </div>
          <p style={{ fontSize: 13, color: '#c8c5be', lineHeight: 1.6, margin: 0 }}>{summary}</p>
        </div>
      )}
    </div>
  )
}
