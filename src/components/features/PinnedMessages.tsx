'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { useState } from 'react'
import { Pin, ChevronDown, ChevronUp, X } from 'lucide-react'

export default function PinnedMessages({ roomId }: { roomId: Id<'rooms'> }) {
  const pinned = useQuery(api.rooms.getPinnedMessages, { roomId })
  const unpinMessage = useMutation(api.rooms.unpinMessage)
  const [expanded, setExpanded] = useState(false)

  if (!pinned || pinned.length === 0) return null

  const latest = pinned[pinned.length - 1]

  return (
    <div style={{ 
      borderBottom: '1px solid var(--obsidian-border)', 
      background: 'rgba(255,255,255,0.02)', 
      padding: '10px 20px',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <Pin size={12} strokeWidth={2.5} color="var(--obsidian-primary)" style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--obsidian-text-faint)', fontWeight: 700 }}>Pinned</span>
            <span style={{ fontSize: 13, color: 'var(--obsidian-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.9 }}>
              {latest.body || (latest.type === 'voice' ? 'Voice Message' : 'Media')}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {pinned.length > 1 && (
            <button onClick={() => setExpanded(!expanded)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--obsidian-text-faint)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              +{pinned.length - 1} more
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
          {pinned.length === 1 && (
             <button onClick={() => unpinMessage({ roomId, messageId: latest._id })}
               style={{ background: 'none', border: 'none', color: 'var(--obsidian-text-faint)', cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}
               onMouseEnter={e => e.currentTarget.style.color = 'var(--obsidian-primary)'}
               onMouseLeave={e => e.currentTarget.style.color = 'var(--obsidian-text-faint)'}>
               Unpin
             </button>
          )}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--obsidian-border)', paddingTop: 12 }}>
          {pinned.map((msg) => (
            <div key={msg._id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '8px 12px', background: 'var(--obsidian-surface-soft)', borderRadius: 8, border: '1px solid var(--obsidian-border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: 'var(--obsidian-text)', margin: 0, lineHeight: 1.5 }}>
                  {msg.body || (msg.type === 'voice' ? 'Voice Message' : 'Media')}
                </p>
                <span style={{ fontSize: 8, color: 'var(--obsidian-text-faint)', textTransform: 'uppercase' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <button 
                onClick={() => unpinMessage({ roomId, messageId: msg._id })} 
                style={{ background: 'none', border: 'none', color: 'var(--obsidian-text-faint)', cursor: 'pointer', fontSize: 9, textTransform: 'uppercase', flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--obsidian-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--obsidian-text-faint)'}>
                Unpin
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
