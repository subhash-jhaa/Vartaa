'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { useState } from 'react'

export default function PinnedMessagesBanner({ roomId }: { roomId: Id<'rooms'> }) {
  const pinned = useQuery(api.rooms.getPinnedMessages, { roomId })
  const unpinMessage = useMutation(api.rooms.unpinMessage)
  const [expanded, setExpanded] = useState(false)

  if (!pinned || pinned.length === 0) return null

  const latest = pinned[pinned.length - 1]

  return (
    <div style={{ borderBottom: '1px solid rgba(240,237,230,0.07)', background: 'rgba(240,237,230,0.02)', padding: '8px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 11, color: '#6b6960', flexShrink: 0 }}>📌 Pinned</span>
          <span style={{ fontSize: 13, color: '#c8c5be', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {latest.body?.slice(0, 80)}
          </span>
          {pinned.length > 1 && (
            <button onClick={() => setExpanded((e) => !e)} style={{ fontSize: 11, color: '#6b6960', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              +{pinned.length - 1} more
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {pinned.map((msg) => (
            <div key={msg._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(240,237,230,0.03)', borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: '#c8c5be' }}>{msg.body?.slice(0, 100)}</span>
              <button onClick={() => unpinMessage({ roomId, messageId: msg._id }).catch(console.error)} style={{ fontSize: 10, color: '#6b6960', background: 'none', border: 'none', cursor: 'pointer' }}>Unpin</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
