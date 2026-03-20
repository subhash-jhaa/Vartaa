'use client'
import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import PinnedMessagesBanner from '@/components/features/PinnedMessages'
import AISummaryButton from '@/components/features/AISummary'
import RoomTasksPanel from '@/components/features/TaskItem'
import { useState } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function ChatWindow({ roomId }: { roomId: Id<'rooms'> }) {
  const { user } = useCurrentUser()
  const { isMobile } = useIsMobile()
  const hasRoomId = typeof roomId === 'string' && roomId.length > 0
  const room = useQuery(api.rooms.getRoom, hasRoomId ? { roomId } : 'skip')
  const [showTasks, setShowTasks] = useState(false)

  if (!hasRoomId) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6960', fontSize: 14 }}>
      Invalid room.
    </div>
  )

  if (room === undefined) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 20, height: 20, border: '2px solid rgba(240,237,230,0.15)', borderTopColor: '#c8c5be', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  if (room === null) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6960', fontSize: 14 }}>
      Room not found or you&apos;re not a member.
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Main chat column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Room header */}
        <div style={{ padding: isMobile ? '0 12px' : '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(240,237,230,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}># {room.name}</span>
            {!isMobile && room.description && <span style={{ fontSize: 12, color: '#6b6960', marginLeft: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{room.description}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 8 }}>
            <AISummaryButton roomId={roomId} />
            <button
              onClick={() => setShowTasks(t => !t)}
              style={{ fontSize: 11, color: '#6b6960', background: 'rgba(240,237,230,0.05)', border: '1px solid rgba(240,237,230,0.1)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
            >
              Tasks
            </button>
            {!isMobile && <span style={{ fontSize: 12, color: '#6b6960' }}>{room.memberIds.length} members</span>}
          </div>
        </div>

        {/* Pinned messages banner */}
        <PinnedMessagesBanner roomId={roomId} />

        {/* Messages */}
        <MessageList roomId={roomId} />

        {/* Input */}
        <MessageInput roomId={roomId} />
      </div>

      {/* Tasks panel (collapsible) */}
      {showTasks && (
        <div style={{ 
          width: isMobile ? '100%' : 280,
          position: isMobile ? 'absolute' : 'relative',
          right: 0,
          top: 0,
          height: '100%',
          borderLeft: isMobile ? 'none' : '1px solid rgba(240,237,230,0.07)',
          background: isMobile ? '#0c0c0b' : 'transparent',
          display: 'flex', 
          flexDirection: 'column',
          zIndex: isMobile ? 20 : 'auto',
        }}>
          <RoomTasksPanel roomId={roomId} />
        </div>
      )}
    </div>
  )
}
