'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import NewDMButton from './NewDMButton'
import LanguageSettings from '@/components/features/LanguageSettings'

import { Search, User, Grid, Plus, SquarePen, LayoutGrid, MessageSquare, UserRound, Users } from 'lucide-react'

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
  const [showLangSettings, setShowLangSettings] = useState(false)

  const groupRooms = rooms?.filter(r => r.type === 'group') ?? []
  const dmRooms = rooms?.filter(r => r.type === 'direct') ?? []
  
  const handleCreate = async () => {
    if (!newRoomName.trim()) return
    const roomId = await createRoom({ 
      name: newRoomName.trim(), 
      type: 'group', 
      memberIds: user?._id ? [user._id] : [] 
    })
    setNewRoomName('')
    setShowNew(false)
    router.push(`/chat/${roomId}`)
  }

  return (
    <section style={{
      width: 256, height: '100vh', background: 'var(--obsidian-surface-soft)',
      borderRight: '1px solid var(--obsidian-border)',
      display: 'flex', flexDirection: 'column',
      paddingTop: 48, paddingLeft: 32, paddingRight: 32,
      flexShrink: 0, boxSizing: 'border-box',
      position: 'relative'
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'var(--obsidian-primary)', lineHeight: 1 }}>वार्ता</span>
          <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 18, color: 'var(--obsidian-text)', opacity: 0.85, lineHeight: 1 }}>Vartaa</span>
        </div>
      </Link>

      {/* DYNAMIC HEADER BOX */}
      <div style={{ padding: '2px 0', borderBottom: '1px solid #141414', flexShrink: 0, marginBottom: 12, marginLeft: -32, marginRight: -32 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', padding: '9px 12px',
          background: '#ffffff', border: '1px solid #e0e0e0',
          borderRadius: 8, cursor: 'default', transition: 'all 0.15s',
          boxSizing: 'border-box'
        }}
          onMouseEnter={e => { e.currentTarget.style.background='#f5f5f5'; e.currentTarget.style.borderColor='#ccc' }}
          onMouseLeave={e => { e.currentTarget.style.background='#ffffff'; e.currentTarget.style.borderColor='#e0e0e0' }}
        >
          {activeView === 'rooms'
            ? <Users size={14} color="#444" />
            : <UserRound size={14} color="#444" />
          }
          <span style={{ 
            flex: 1, 
            fontSize: 13, 
            fontWeight: 500, 
            color: '#111', 
            letterSpacing: '-0.01em', 
            userSelect: 'none' 
          }}>
            {activeView === 'rooms' ? 'Rooms' : 'Messages'}
          </span>
          <span
            onClick={(e) => { 
              e.stopPropagation(); 
              if (activeView === 'rooms') {
                setShowNew(v => !v);
              } else {
                setShowPicker(true);
              }
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
              color: '#666', 
              transition: 'color 0.15s' 
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#111'}
            onMouseLeave={e => e.currentTarget.style.color = '#666'}
          >
            {activeView === 'rooms' ? <Plus size={13} /> : <SquarePen size={13} />}
          </span>
        </div>

        {activeView === 'dms' && (
          <NewDMButton isOpen={showPicker} setIsOpen={setShowPicker} />
        )}
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
                  <Users size={12} strokeWidth={1.5} style={{ opacity: 0.6 }} />
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
            {dmRooms.map(room => (
              <DMItem key={room._id} room={room} isActive={pathname === `/chat/${room._id}`} searchQuery={searchQuery} />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingBottom: 48, paddingTop: 32, borderTop: '1px solid var(--obsidian-border)', position: 'relative' }}>
        <span style={{ display: 'block', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--color-ui-faint)', marginBottom: 4 }}>Synthesis Mode</span>
        <button
          onClick={() => setShowLangSettings(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span style={{ fontSize: 10, fontFamily: 'Geist, sans-serif', color: 'var(--color-accent-a-half)', letterSpacing: '0.1em', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-accent-a-half)'}
          >
            {user?.preferredLang?.split('-')[0].toUpperCase() ?? 'EN'} ⟷ ALL · Change
          </span>
        </button>

        {showLangSettings && (
          <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 8, zIndex: 100 }}>
            <LanguageSettings onClose={() => setShowLangSettings(false)} />
          </div>
        )}
      </div>
    </section>
  )
}

function DMItem({ room, isActive, searchQuery }: { room: any; isActive: boolean; searchQuery: string }) {
  const { user: currentUser } = useCurrentUser()
  const otherUserId = room.memberIds.find((id: string) => id !== currentUser?._id)
  
  const otherUsers = useQuery(
    api.users.getUsersByIds,
    { userIds: otherUserId ? [otherUserId] : [] }
  )
  const otherUser = otherUsers?.[0]

  if (!otherUser) return null

  // Search filter
  if (searchQuery && !otherUser.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !otherUser.email?.toLowerCase().includes(searchQuery.toLowerCase())) {
    return null
  }

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
