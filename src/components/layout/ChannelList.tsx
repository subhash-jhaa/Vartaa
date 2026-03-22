'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import NewDMButton from './NewDMButton'

import { Search, User, Grid, Plus, SquarePen } from 'lucide-react'

interface ChannelListProps {
  activeView: 'rooms' | 'dms'
}

export default function ChannelList({ activeView }: ChannelListProps) {
  const { user } = useCurrentUser()
  const rooms = useQuery(api.rooms.getMyRooms)
  const createRoom = useMutation(api.rooms.createRoom)
  const pathname = usePathname()
  const router = useRouter()
  const [newRoomName, setNewRoomName] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const groupRooms = rooms?.filter(r => r.type === 'group') ?? []
  const dmRooms = rooms?.filter(r => r.type === 'direct') ?? []
  
  const filteredDms = dmRooms.filter(room => {
    if (!searchQuery) return true
    return true 
  })

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
      position: 'relative'
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 64 }}>
          <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 20, color: 'var(--obsidian-primary)' }}>वार्ता</span>
          <span style={{ width: 1, height: 16, background: 'var(--obsidian-primary-alpha)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 18, color: 'var(--obsidian-text)', opacity: 0.85 }}>Vartaa</span>
        </div>
      </Link>

      {/* DYNAMIC HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0 10px',
        borderBottom: '1px solid #141414',
        marginBottom: 24,
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--obsidian-text)',
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {activeView === 'rooms' ? <Grid size={14} /> : <User size={14} />}
          {activeView === 'rooms' ? 'Rooms' : 'Messages'}
        </div>
        
        {activeView === 'rooms' ? (
          <button 
            onClick={() => setShowNew(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '7px',
              fontSize: '11px',
              color: 'var(--obsidian-text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            className="header-action-btn"
          >
            <Plus size={13} />
            <span>New Room</span>
          </button>
        ) : (
          <NewDMButton 
            isOpen={showPicker} 
            setIsOpen={setShowPicker} 
            customTrigger={
              <button 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  borderRadius: '7px',
                  fontSize: '11px',
                  color: 'var(--obsidian-text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                className="header-action-btn"
              >
                <SquarePen size={13} />
                <span>New Message</span>
              </button>
            }
          />
        )}
        <style jsx>{`
          .header-action-btn:hover {
            background: #1a1a1a !important;
            border-color: #2a2a2a !important;
            color: var(--obsidian-text) !important;
          }
        `}</style>
      </div>

      {/* ROOMS VIEW */}
      {activeView === 'rooms' && (
        <div style={{ marginBottom: 48, flex: 1, overflowY: 'auto' }}>
          {showNew && (
            <input autoFocus value={newRoomName}
              onChange={e => setNewRoomName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              onBlur={() => !newRoomName && setShowNew(false)}
              placeholder="room name..."
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--obsidian-primary-alpha)', color: 'var(--obsidian-text)', fontSize: 13, outline: 'none', padding: '4px 0', marginBottom: 8, fontFamily: 'Geist, sans-serif', letterSpacing: '0.05em', boxSizing: 'border-box' }}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {groupRooms.map(room => {
              const isActive = pathname === `/chat/${room._id}`
              const isAdmin = user?._id && (room.adminIds ?? [room.createdBy]).includes(user._id)
              
              return (
                <Link key={room._id} href={`/chat/${room._id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontFamily: 'Geist, sans-serif', color: isActive ? 'var(--obsidian-primary)' : 'var(--obsidian-text-muted)', textDecoration: 'none', transition: 'color 0.3s', paddingLeft: isActive ? 0 : 8 }}>
                  {isActive && <span style={{ width: 1, height: 12, background: 'var(--obsidian-primary)', flexShrink: 0 }} />}
                  <span style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    maxWidth: isAdmin ? '140px' : '100%' 
                  }}>
                    {room.name}
                  </span>
                  {isAdmin && (
                    <span style={{
                      fontSize: 8,
                      fontFamily: 'monospace',
                      color: '#c9a84c',
                      opacity: 0.7,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginLeft: 4,
                      flexShrink: 0,
                    }}>
                      admin
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* DM VIEW */}
      {activeView === 'dms' && (
        <div style={{ marginBottom: 48, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            background: '#0f0f0f', 
            border: '1px solid #1a1a1a', 
            borderRadius: 7, 
            padding: '6px 10px', 
            marginBottom: 16 
          }}>
            <Search size={12} color="#666" />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search people..." 
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 11, width: '100%', fontFamily: 'Geist, sans-serif' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filteredDms.map(room => (
              <DMItem key={room._id} room={room} isActive={pathname === `/chat/${room._id}`} />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingBottom: 48, paddingTop: 32, borderTop: '1px solid var(--obsidian-border)' }}>
        <span style={{ display: 'block', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--obsidian-text-faint)', marginBottom: 4 }}>Synthesis Mode</span>
        <span style={{ fontSize: 10, fontFamily: 'Geist, sans-serif', color: 'var(--obsidian-primary-alpha)', letterSpacing: '0.1em' }}>
          {user?.preferredLang?.split('-')[0].toUpperCase() ?? 'EN'} ⟷ ENGLISH
        </span>
      </div>
    </section>
  )
}

function DMItem({ room, isActive }: { room: any; isActive: boolean }) {
  const { user: currentUser } = useCurrentUser()
  const otherUserId = room.memberIds.find((id: string) => id !== currentUser?._id)
  
  const otherUsers = useQuery(
    api.users.getUsersByIds,
    { userIds: otherUserId ? [otherUserId] : [] }
  )
  const otherUser = otherUsers?.[0]

  if (!otherUser) return null

  return (
    <Link
      href={`/chat/${room._id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        fontFamily: 'Geist, sans-serif',
        color: isActive ? 'var(--obsidian-primary)' : 'var(--obsidian-text-muted)',
        textDecoration: 'none',
        transition: 'all 0.2s',
        padding: '7px 8px',
        borderRadius: 8,
        background: isActive ? 'rgba(201,168,76,0.05)' : 'transparent',
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {otherUser.image ? (
          <img 
            src={otherUser.image} 
            alt={otherUser.name} 
            style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--obsidian-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>
            <User size={12} />
          </div>
        )}
        {otherUser.presence === 'online' && (
          <div style={{ position: 'absolute', right: -1, bottom: -1, width: 6, height: 6, borderRadius: '50%', background: '#22c55e', border: '1.5px solid var(--obsidian-surface-soft)' }} />
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <div style={{ 
          fontSize: 12, 
          fontWeight: isActive ? 600 : 400, 
          color: isActive ? 'var(--obsidian-text)' : 'inherit',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {otherUser.name}
        </div>
        <div style={{ 
          fontSize: 10, 
          color: 'var(--obsidian-text-faint)', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {room.lastMessagePreview || 'No messages yet'}
        </div>
      </div>
      
      {/* Unread badge logic could go here if unreadCount exists on room */}
    </Link>
  )
}
