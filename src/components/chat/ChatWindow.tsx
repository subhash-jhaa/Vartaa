'use client'
import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import PinnedMessages from '@/components/features/PinnedMessages'
import AISummaryButton from '@/components/features/AISummary'
import RoomTasksPanel from '@/components/features/TaskItem'
import RoomMembersPanel from '@/components/room/RoomMembersPanel'
import DropdownMenu from '@/components/ui/DropdownMenu'
import { useState, useEffect, useRef } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useRouter } from 'next/navigation'
import { useAuthActions } from '@convex-dev/auth/react'
import { Users, Lightbulb, CheckSquare, RefreshCcw, Trash2, UserPlus, Copy, Stars, X, LogOut, Archive } from 'lucide-react'

export default function ChatWindow({ roomId }: { roomId: Id<'rooms'> }) {
  const { signOut } = useAuthActions()
  const router = useRouter()
  const { user: currentUser } = useCurrentUser()
  const hasRoomId = typeof roomId === 'string' && roomId.length > 0
  const room = useQuery(api.rooms.getRoom, hasRoomId ? { roomId } : 'skip')
  const messages = useQuery(api.messages.getMessages, hasRoomId ? { roomId, limit: 50 } : 'skip')
  const clearChat = useMutation(api.messages.clearChat)
  const markRead = useMutation(api.messages.markRead)
  const summarize = useAction(api.actions.ai.summarizeThread)
  
  const isDirect = room?.type === "direct"
  const readReceipt = useQuery(
    api.messages.getReadReceipt,
    isDirect ? { roomId } : "skip"
  )
  const myId = currentUser?._id

  // For DMs, find the other person's name
  const otherUserId = room?.type === "direct" 
    ? room.memberIds.find(id => id !== myId) 
    : null
  const otherUsers = useQuery(
    api.users.getUsersByIds,
    otherUserId ? { userIds: [otherUserId] } : "skip"
  )
  const otherUser = otherUsers?.[0]
  const displayName = room?.type === "direct" 
    ? (otherUser?.name || "Direct Message") 
    : room?.name

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
  const [showInsight, setShowInsight] = useState(false)
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
      label: 'Archive',
      icon: <Archive size={14} />,
      onClick: () => {
        setActiveTab('archive')
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
        <header style={{ height: isMobile ? 80 : 96, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${isMobile ? 12 : 64}px`, paddingLeft: isMobile ? 70 : 64, borderBottom: '1px solid var(--obsidian-border)', flexShrink: 0, background: 'var(--obsidian-bg)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {room?.type === 'group' && <Users size={12} color="var(--obsidian-text-muted)" />}
              <h1 style={{ fontSize: isMobile ? 12 : 13, textTransform: room?.type === 'direct' ? 'none' : 'uppercase', letterSpacing: room?.type === 'direct' ? 'normal' : '0.2em', color: 'var(--obsidian-text)', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? 80 : 'none' }}>
                {displayName}
              </h1>
            </div>
            {activeTab === 'archive' && (
              <button 
                onClick={() => setActiveTab('live')}
                style={{ background: 'rgba(229,192,123,0.1)', border: '1px solid var(--obsidian-primary-alpha)', cursor: 'pointer', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--obsidian-primary)', padding: '4px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                Archive Mode <span style={{ opacity: 0.6 }}>✕</span>
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 32 }}>
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
        <div style={{ paddingBottom: 20 }}>
          <MessageInput 
            roomId={roomId} 
            userPreferredLang={currentUser?.preferredLang || 'en-IN'}
            recentMessages={recentMessages}
          />
        </div>
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
    </div>
  )
}
