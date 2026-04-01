'use client'

import { useQuery, useMutation } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '../../../convex/_generated/api'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import VartaaLogo from '@/components/VartaaLogo'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useIsMobile } from '@/hooks/useIsMobile'
import { usePresence } from '@/hooks/usePresence'

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { signOut } = useAuthActions()
  const { user: currentUser, isLoading, isAuthenticated } = useCurrentUser()
  const { isMobile } = useIsMobile()
  const pathname = usePathname()
  const router = useRouter()

  const rooms = useQuery(
    api.rooms.getMyRooms,
    isAuthenticated ? {} : 'skip'
  )
  const createRoom = useMutation(api.rooms.createRoom)
  const updatePresence = useMutation(api.users.updatePresence)
  
  // Automate presence heartbeats and away status
  usePresence()

  const [showNewRoom, setShowNewRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Manual presence initialization is now handled by usePresence() hook

  // Do not render sidebar until auth is confirmed
  if (isLoading) return (
    <div 
      style={{ 
        width: isMobile ? 280 : 260, 
        height: '100%', 
        background: '#111110', 
        borderRight: '1px solid rgba(240,237,230,0.07)' 
      }} 
    />
  )

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return
    try {
      const roomId = await createRoom({ 
        name: newRoomName.trim(), 
        type: 'group', 
        memberIds: [] 
      })
      setNewRoomName('')
      setShowNewRoom(false)
      onClose?.()
      router.push(`/chat/${roomId}`)
    } catch (err) { console.error(err) }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const getPresenceColor = (user: any) => {
    const isOnline = (user.lastSeenAt ?? 0) > Date.now() - 60000
    if (!isOnline) return 'rgba(240,237,230,0.2)' // Offline

    switch (user.presence) {
      case 'online': return '#4ade80'
      case 'away': return '#facc15'
      case 'dnd': return '#f87171'
      default: return '#4ade80'
    }
  }

  return (
    <div style={{ width: isMobile ? 280 : 260, height: '100%', background: '#111110', borderRight: '1px solid rgba(240,237,230,0.07)', display: 'flex', flexDirection: 'column', color: '#f0ede6', flexShrink: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', height: 52, borderBottom: '1px solid rgba(240,237,230,0.07)', padding: '0 16px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flex: 1 }} onClick={onClose}>
            <VartaaLogo size={28} showText={true} textSize={14} />
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b6960',
              cursor: 'pointer',
              fontSize: 18,
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px' }}>
        <input type="text" placeholder="Search..." style={{ width: '100%', background: 'rgba(240,237,230,0.03)', border: '1px solid rgba(240,237,230,0.07)', borderRadius: 8, padding: '8px 12px', color: '#f0ede6', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* Rooms header */}
      <div style={{ padding: '0 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#6b6960', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Rooms</span>
        <button onClick={() => setShowNewRoom(!showNewRoom)} style={{ background: 'transparent', border: 'none', color: '#c8c5be', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '2px 6px', borderRadius: 4 }}>+</button>
      </div>

      {showNewRoom && (
        <form onSubmit={handleCreateRoom} style={{ padding: '0 16px 12px' }}>
          <input autoFocus type="text" placeholder="Room name..." value={newRoomName} onChange={e => setNewRoomName(e.target.value)} style={{ width: '100%', background: 'rgba(240,237,230,0.03)', border: '1px solid rgba(240,237,230,0.08)', borderRadius: 6, padding: '8px 10px', color: '#f0ede6', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
        </form>
      )}

      {/* Room list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {rooms === undefined ? (
          <div style={{ padding: '12px 8px', color: '#6b6960', fontSize: '13px' }}>Loading...</div>
        ) : rooms.length === 0 ? (
          <div style={{ padding: '12px 8px', color: '#6b6960', fontSize: '13px' }}>No rooms yet — create one above</div>
        ) : rooms.map((room: any) => {
          const isActive = pathname === `/chat/${room._id}`
          return (
            <Link key={room._id} href={`/chat/${room._id}`} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: isActive ? 'rgba(240,237,230,0.06)' : 'transparent', color: isActive ? '#f0ede6' : '#c8c5be', textDecoration: 'none', marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(240,237,230,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#d4a843', flexShrink: 0 }}>
                {room.type === 'direct' ? '👤' : '#'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{room.name || 'Untitled'}</div>
                <div style={{ fontSize: '12px', color: '#6b6960', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{room.lastMessagePreview || 'No messages yet'}</div>
              </div>
              {room.lastMessageAt && <span style={{ fontSize: '11px', color: '#6b6960', flexShrink: 0 }}>{formatTime(room.lastMessageAt)}</span>}
            </Link>
          )
        })}
      </div>

      {/* User profile */}
      <div style={{ borderTop: '1px solid rgba(240,237,230,0.07)', padding: '12px 16px', position: 'relative' }}>
        {currentUser && (
          <div onClick={() => setShowUserMenu(!showUserMenu)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div style={{ position: 'relative' }}>
              {currentUser.image ? (
                <img src={currentUser.image} alt={currentUser.name || 'User'} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: 6, background: '#d4a843', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#0c0c0b' }}>
                  {(currentUser.name || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: getPresenceColor(currentUser), border: '2px solid #111110' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name || 'User'}</div>
              <div style={{ fontSize: '12px', color: '#6b6960' }}>
                { (currentUser.lastSeenAt ?? 0) > Date.now() - 60000 ? (currentUser.presence ?? 'online') : 'offline' }
              </div>
            </div>
          </div>
        )}

        {showUserMenu && (
          <div style={{ position: 'absolute', bottom: '60px', left: '16px', width: '200px', background: '#1a1a18', border: '1px solid rgba(240,237,230,0.1)', borderRadius: 8, padding: 6, zIndex: 100 }}>
            {['online', 'away', 'dnd', 'offline'].map(status => (
              <button key={status} onClick={async () => { await updatePresence({ presence: status as any }); setShowUserMenu(false) }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'transparent', border: 'none', padding: '8px 10px', color: '#c8c5be', fontSize: '13px', cursor: 'pointer', textAlign: 'left', borderRadius: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: getPresenceColor({ presence: status, lastSeenAt: Date.now() }) }} />
                <span style={{ textTransform: 'capitalize' }}>{status}</span>
              </button>
            ))}
            <div style={{ height: 1, background: 'rgba(240,237,230,0.07)', margin: '4px 0' }} />
            <button 
              onClick={async () => {
                await signOut();
                router.push('/');
              }} 
              style={{ display: 'block', width: '100%', background: 'transparent', border: 'none', padding: '8px 10px', color: '#f87171', fontSize: '13px', cursor: 'pointer', textAlign: 'left', borderRadius: 4 }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
