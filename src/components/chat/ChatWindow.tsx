'use client'
import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import PinnedMessages from '@/components/features/PinnedMessages'
import AISummaryButton from '@/components/features/AISummary'
import RoomTasksPanel from '@/components/features/TaskItem'
import RoomMembersPanel from '@/components/room/RoomMembersPanel'
import DropdownMenu from '@/components/ui/DropdownMenu'
import { useState, useEffect, useRef } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Users, Lightbulb, CheckSquare, RefreshCcw, Trash2, UserPlus, Copy, Stars, X } from 'lucide-react'

export default function ChatWindow({ roomId }: { roomId: Id<'rooms'> }) {
  const { user: currentUser } = useCurrentUser()
  const hasRoomId = typeof roomId === 'string' && roomId.length > 0
  const room = useQuery(api.rooms.getRoom, hasRoomId ? { roomId } : 'skip')
  const messages = useQuery(api.messages.getMessages, hasRoomId ? { roomId, limit: 10 } : 'skip')
  const clearChat = useMutation(api.messages.clearChat)
  const markRead = useMutation(api.messages.markRead)
  const summarize = useAction(api.actions.ai.summarizeThread)
  
  const isDirect = room?.type === "direct"
  const readReceipt = useQuery(
    api.messages.getReadReceipt,
    isDirect ? { roomId } : "skip"
  )
  const myId = currentUser?._id

  useEffect(() => {
    if (!isDirect || !messages?.length || !myId) return
    const latest = messages[messages.length - 1]
    if (latest && latest.senderId !== myId) {
      markRead({ roomId, messageId: latest._id })
    }
  }, [messages?.length, roomId, isDirect, myId, markRead])

  const recentMessages = messages?.map(m => ({
    content: m.body || '',
    isFromMe: m.senderId === myId,
    senderName: m.senderId === myId ? 'Me' : 'Other'
  })) || []

  const [summary, setSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showTasks, setShowTasks] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [activeTab, setActiveTab] = useState<'live' | 'archive'>('live')
  const [isMobile, setIsMobile] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showInsight, setShowInsight] = useState(!isMobile)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const confirmRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMenuOpen(false)
    setShowSummary(false)
    setSummary(null)
  }, [roomId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (confirmRef.current && !confirmRef.current.contains(event.target as Node)) {
        setShowConfirm(false)
      }
    }
    if (showConfirm) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showConfirm])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleClear = async () => {
    try {
      setIsClearing(true)
      await clearChat({ roomId })
      setShowConfirm(false)
    } catch (err) {
      console.error('Failed to clear chat:', err)
      alert('Failed to clear chat. Please try again.')
    } finally {
      setIsClearing(false)
    }
  }

  const handleCatchMeUp = async () => {
    if (summaryLoading) return
    setSummaryLoading(true)
    setShowSummary(true)
    try {
      const result = await summarize({ roomId })
      setSummary(result)
    } catch (err) {
      console.error(err)
      setSummary('Could not generate summary.')
    } finally {
      setSummaryLoading(false)
    }
  }

  const menuItems = [
    {
      label: 'Insight',
      icon: <Lightbulb />,
      onClick: () => {
        setShowInsight(!showInsight)
        setMenuOpen(false)
      }
    },
    {
      label: 'Add Task',
      icon: <CheckSquare />,
      onClick: () => {
        setShowTasks(true)
        setMenuOpen(false)
      }
    },
    {
      label: 'Catch me up',
      icon: <Stars size={14} />,
      onClick: () => {
        handleCatchMeUp()
        setMenuOpen(false)
      }
    },
    {
      label: 'Clear Chat',
      icon: <Trash2 />,
      danger: true,
      onClick: () => {
        setShowConfirm(true)
        setMenuOpen(false)
      }
    },
    ...(room?.type === 'group' ? [{
      label: 'Add Member',
      icon: <UserPlus />,
      onClick: () => {
        setShowMembers(true)
        setMenuOpen(false)
      }
    }] : []),
    { divider: true },
    {
      label: 'Copy Room ID',
      icon: <Copy />,
      onClick: () => {
        navigator.clipboard.writeText(roomId)
        setMenuOpen(false)
      }
    },
  ]

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
        <header style={{ height: isMobile ? 80 : 96, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${isMobile ? 16 : 64}px`, paddingLeft: isMobile ? 80 : 64, borderBottom: '1px solid var(--obsidian-border)', flexShrink: 0, background: 'var(--obsidian-bg)', position: 'relative' }}>
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
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--obsidian-text-faint)', fontSize: 18, padding: 4, transition: 'color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--obsidian-text-muted)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--obsidian-text-faint)'}
              >⋮</button>

              {menuOpen && (
                <DropdownMenu items={menuItems} onClose={() => setMenuOpen(false)} />
              )}

              {showConfirm && (
                <div 
                  ref={confirmRef}
                  style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 220, background: '#0a0a0a', border: '1px solid var(--obsidian-border)', borderRadius: 8, padding: 16, zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                >
                  <p style={{ fontSize: 11, color: 'var(--obsidian-text-muted)', marginBottom: 16, lineHeight: 1.5, margin: '0 0 16px' }}>This will permanently delete all messages in this room. Cannot be undone.</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      onClick={() => setShowConfirm(false)}
                      disabled={isClearing}
                      style={{ flex: 1, padding: '8px 0', background: 'transparent', border: '1px solid var(--obsidian-border)', color: 'var(--obsidian-text-muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4 }}
                    >Cancel</button>
                    <button 
                      onClick={handleClear}
                      disabled={isClearing}
                      style={{ flex: 1, padding: '8px 0', background: '#e06c75', border: 'none', color: '#fff', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4, fontWeight: 600 }}
                    >{isClearing ? '...' : 'Clear'}</button>
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={() => {
              setShowTasks(t => !t);
              setShowMembers(false);
            }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: showTasks ? 'var(--obsidian-primary)' : 'var(--obsidian-text-faint)', fontSize: 18, transition: 'color 0.3s' }}>⊟</button>
          </div>
        </header>

        <PinnedMessages roomId={roomId} />

        {showSummary && (
          <div style={{
            margin: '12px 16px 0',
            background: '#0d0d0d',
            border: '1px solid #1e1e1e',
            borderRadius: 10,
            padding: '14px 16px',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Stars size={12} color="var(--obsidian-primary)" />
                <span style={{
                  fontSize: 10,
                  fontFamily: 'monospace',
                  color: 'var(--obsidian-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                }}>
                  AI Summary
                </span>
              </div>
              <button
                onClick={() => { setShowSummary(false); setSummary(null) }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--obsidian-text-faint)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={13} />
              </button>
            </div>

            {summaryLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCcw size={11} className="animate-spin"
                  color="var(--obsidian-text-faint)" />
                <span style={{ fontSize: 12, color: 'var(--obsidian-text-faint)' }}>
                  Summarizing...
                </span>
              </div>
            ) : (
              <p style={{
                fontSize: 13,
                color: 'var(--obsidian-text)',
                lineHeight: 1.7,
                margin: 0,
                opacity: 0.9,
              }}>
                {summary}
              </p>
            )}
          </div>
        )}

        <MessageList 
          roomId={roomId} 
          isDirect={isDirect} 
          readReceipt={readReceipt} 
          myId={myId} 
        />
        <MessageInput 
          roomId={roomId} 
          userPreferredLang={currentUser?.preferredLang || 'en-IN'}
          recentMessages={recentMessages}
        />
      </div>

      {showMembers && currentUser && (
        <RoomMembersPanel 
          roomId={roomId} 
          currentUserId={currentUser._id} 
          onClose={() => setShowMembers(false)} 
        />
      )}

      {showTasks && (
        <div style={{ position: isMobile ? 'absolute' : 'relative', top: 0, right: 0, height: '100%', width: 280, borderLeft: '1px solid var(--obsidian-border)', display: 'flex', flexDirection: 'column', background: '#000', zIndex: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
             <button onClick={() => setShowTasks(false)} style={{ background: 'none', border: 'none', color: 'var(--obsidian-text-muted)', cursor: 'pointer' }}>×</button>
          </div>
          <RoomTasksPanel roomId={roomId} />
        </div>
      )}

      {!isMobile && showInsight && (
        <div style={{ width: 320, borderLeft: '1px solid var(--obsidian-border)', display: 'flex', flexDirection: 'column', padding: '96px 40px 0', background: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 32, right: 32 }}>
            <button onClick={() => setShowInsight(false)} style={{ background: 'none', border: 'none', color: 'var(--obsidian-text-muted)', cursor: 'pointer' }}>×</button>
          </div>
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
