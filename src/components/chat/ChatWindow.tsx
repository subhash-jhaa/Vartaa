'use client'
import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import PinnedMessages from '@/components/features/PinnedMessages'
import AISummaryButton from '@/components/features/AISummary'
import RoomTasksPanel from '@/components/features/TaskItem'
import { useState, useEffect } from 'react'

export default function ChatWindow({ roomId }: { roomId: Id<'rooms'> }) {
  const hasRoomId = typeof roomId === 'string' && roomId.length > 0
  const room = useQuery(api.rooms.getRoom, hasRoomId ? { roomId } : 'skip')
  const [showTasks, setShowTasks] = useState(false)
  const [activeTab, setActiveTab] = useState<'live' | 'archive'>('live')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!hasRoomId) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#525252', fontSize: 13 }}>Invalid room.</div>
  )

  if (room === undefined) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 16, height: 16, border: '1px solid rgba(229,192,123,0.3)', borderTopColor: '#e5c07b', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  if (room === null) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#525252', fontSize: 13 }}>
      Room not found or you&apos;re not a member.
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--obsidian-bg)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: isMobile ? 80 : 96, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${isMobile ? 16 : 64}px`, paddingLeft: isMobile ? 80 : 64, borderBottom: '1px solid var(--obsidian-border)', flexShrink: 0, background: 'var(--obsidian-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 48 }}>
            <h1 style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--obsidian-text-muted)', fontWeight: 500, margin: 0 }}>#{room.name}</h1>
            <div style={{ display: 'flex', gap: isMobile ? 16 : 32 }}>
              {(['live', 'archive'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.25em', color: activeTab === tab ? 'var(--obsidian-primary)' : 'var(--obsidian-text-faint)', fontWeight: activeTab === tab ? 700 : 400, transition: 'color 0.3s' }}>
                  {isMobile ? tab[0].toUpperCase() : tab}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 32 }}>
            <button onClick={() => setShowTasks(t => !t)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: showTasks ? 'var(--obsidian-primary)' : 'var(--obsidian-text-faint)', fontSize: 18, transition: 'color 0.3s' }}>⊟</button>
          </div>
        </header>

        <PinnedMessages roomId={roomId} />
        <MessageList roomId={roomId} />
        <MessageInput roomId={roomId} />
      </div>

      {showTasks && (
        <div style={{ position: isMobile ? 'absolute' : 'relative', top: 0, right: 0, height: '100%', width: 280, borderLeft: '1px solid var(--obsidian-border)', display: 'flex', flexDirection: 'column', background: '#000', zIndex: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
             <button onClick={() => setShowTasks(false)} style={{ background: 'none', border: 'none', color: 'var(--obsidian-text-muted)', cursor: 'pointer' }}>×</button>
          </div>
          <RoomTasksPanel roomId={roomId} />
        </div>
      )}

      {!isMobile && (
        <div style={{ width: 320, borderLeft: '1px solid var(--obsidian-border)', display: 'flex', flexDirection: 'column', padding: '96px 40px 0', background: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'var(--obsidian-text)', letterSpacing: '-0.02em', marginBottom: 64, marginTop: 0, opacity: 0.7 }}>Insight</h3>
          <div style={{ marginBottom: 80 }}>
            <span style={{ display: 'block', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--obsidian-text-muted)', fontWeight: 700, marginBottom: 24 }}>The Thread</span>
            <AISummaryButton roomId={roomId} />
          </div>
          <div style={{ marginTop: 'auto', paddingBottom: 48, paddingTop: 40, borderTop: '1px solid var(--obsidian-border)' }}>
            <span style={{ display: 'block', fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 48, color: 'var(--obsidian-primary)', marginBottom: 8, fontWeight: 300, opacity: 0.4 }}>22</span>
            <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#2a2a2a', fontWeight: 500 }}>Linguistic Bridges Built</span>
          </div>
        </div>
      )}
    </div>
  )
}
