'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ChannelList() {
  const { user } = useCurrentUser()
  const rooms = useQuery(api.rooms.getMyRooms)
  const createRoom = useMutation(api.rooms.createRoom)
  const pathname = usePathname()
  const router = useRouter()
  const [newRoomName, setNewRoomName] = useState('')
  const [showNew, setShowNew] = useState(false)

  const handleCreate = async () => {
    if (!newRoomName.trim()) return
    const roomId = await createRoom({ name: newRoomName.trim(), type: 'group', memberIds: [] })
    setNewRoomName('')
    setShowNew(false)
    router.push(`/chat/${roomId}`)
  }

  return (
    <section style={{
      width: 256, height: '100vh', background: 'var(--obsidian-surface-soft)',
      borderRight: '1px solid var(--obsidian-border)',
      display: 'flex', flexDirection: 'column',
      paddingTop: 32, paddingLeft: 32, paddingRight: 32,
      flexShrink: 0, boxSizing: 'border-box',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 64 }}>
          <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 20, color: 'var(--obsidian-primary)' }}>वार्ता</span>
          <span style={{ width: 1, height: 16, background: 'var(--obsidian-primary-alpha)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 18, color: 'var(--obsidian-text)', opacity: 0.85 }}>Vartaa</span>
        </div>
      </Link>

      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--obsidian-text-muted)', fontWeight: 500 }}>Flows</span>
          <button onClick={() => setShowNew(v => !v)}
            style={{ background: 'none', border: 'none', color: 'var(--obsidian-text-muted)', cursor: 'pointer', fontSize: 16, lineHeight: 1, transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--obsidian-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--obsidian-text-muted)'}>+</button>
        </div>

        {showNew && (
          <input autoFocus value={newRoomName}
            onChange={e => setNewRoomName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            onBlur={() => !newRoomName && setShowNew(false)}
            placeholder="flow name..."
            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--obsidian-primary-alpha)', color: 'var(--obsidian-text)', fontSize: 13, outline: 'none', padding: '4px 0', marginBottom: 8, fontFamily: 'Geist, sans-serif', letterSpacing: '0.05em', boxSizing: 'border-box' }}
          />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rooms?.map(room => {
            const isActive = pathname === `/chat/${room._id}`
            return (
              <Link key={room._id} href={`/chat/${room._id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontFamily: 'Geist, sans-serif', color: isActive ? 'var(--obsidian-primary)' : 'var(--obsidian-text-muted)', textDecoration: 'none', transition: 'color 0.3s', paddingLeft: isActive ? 0 : 8 }}>
                {isActive && <span style={{ width: 1, height: 12, background: 'var(--obsidian-primary)', flexShrink: 0 }} />}
                {room.name}
              </Link>
            )
          })}
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingBottom: 48, paddingTop: 32, borderTop: '1px solid var(--obsidian-border)' }}>
        <span style={{ display: 'block', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--obsidian-text-faint)', marginBottom: 4 }}>Synthesis Mode</span>
        <span style={{ fontSize: 10, fontFamily: 'Geist, sans-serif', color: 'var(--obsidian-primary-alpha)', letterSpacing: '0.1em' }}>
          {user?.preferredLang?.split('-')[0].toUpperCase() ?? 'EN'} ⟷ ENGLISH
        </span>
      </div>
    </section>
  )
}
