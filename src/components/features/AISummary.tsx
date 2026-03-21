'use client'
import { useState } from 'react'
import { useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { Stars, RefreshCcw, X } from 'lucide-react'

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
        style={{ fontSize: 11, color: 'var(--obsidian-primary)', background: 'var(--obsidian-surface-soft)', border: '1px solid var(--obsidian-primary-alpha)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, transition: 'all 0.3s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--obsidian-surface)'; e.currentTarget.style.boxShadow = '0 0 12px var(--obsidian-primary-alpha)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--obsidian-surface-soft)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {loading ? (
           <RefreshCcw size={12} className="animate-spin" />
        ) : (
          <>
            <Stars size={14} strokeWidth={2.5} />
            Catch me up
          </>
        )}
      </button>

      {open && summary && (
        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 12, width: 320, background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-border)', borderRadius: 12, padding: '20px', zIndex: 50, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Stars size={12} color="var(--obsidian-primary)" />
              <span style={{ fontSize: 10, color: 'var(--obsidian-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>AI Summary</span>
            </div>
            <button onClick={() => { setOpen(false); setSummary(null) }} style={{ color: 'var(--obsidian-text-faint)', background: 'none', border: 'none', cursor: 'pointer' }}>
               <X size={14} />
            </button>
          </div>
          <p style={{ fontSize: 13, color: 'var(--obsidian-text)', lineHeight: 1.7, margin: 0, opacity: 0.9, fontFamily: 'Geist, sans-serif' }}>{summary}</p>
        </div>
      )}
    </div>
  )
}
