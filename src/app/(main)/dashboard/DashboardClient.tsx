'use client'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function DashboardClient() {
  const { user, isLoading, isAuthenticated } = useCurrentUser()
  const { isMobile } = useIsMobile()
  const rooms = useQuery(
    api.rooms.getMyRooms,
    isAuthenticated ? {} : 'skip'
  )

  // Show spinner while auth OR user data is loading
  if (isLoading || rooms === undefined) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          width: 20, 
          height: 20, 
          border: '2px solid rgba(240,237,230,0.15)', 
          borderTopColor: '#c8c5be', 
          borderRadius: '50%', 
          animation: 'spin 0.7s linear infinite' 
        }} />
      </div>
    )
  }

  // If not authenticated after loading, do not render anything
  // middleware.ts will handle the redirect
  if (!user) return null

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: isMobile ? '96px 20px 48px' : '40px 48px', background: 'var(--obsidian-bg)' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 13, color: 'var(--obsidian-text-muted)', marginBottom: 6 }}>{greeting()},</p>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 500, color: 'var(--obsidian-text)', letterSpacing: -0.5 }}>
          {user.name}
        </h1>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Rooms', value: rooms.length },
          { label: 'Members across rooms', value: [...new Set(rooms.flatMap(r => r.memberIds))].length },
          { label: 'Active since', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--obsidian-surface-soft)', border: '1px solid var(--obsidian-border)', borderRadius: 12, padding: '20px 24px' }}>
            <p style={{ fontSize: 11, color: 'var(--obsidian-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{stat.label}</p>
            <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--obsidian-text)', fontFamily: 'Georgia, serif' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent rooms */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 500, color: 'var(--obsidian-text-muted)' }}>Recent rooms</h2>
          <Link href="/chat" style={{ fontSize: 12, color: 'var(--obsidian-text-faint)' }}>View all →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--obsidian-border)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--obsidian-border)' }}>
          {rooms.slice(0, 5).map(room => (
            <Link key={room._id} href={`/chat/${room._id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--obsidian-surface-soft)', textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--obsidian-surface)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--obsidian-surface-soft)')}
            >
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--obsidian-text-muted)', fontWeight: 500, flexShrink: 0 }}>
                {room.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--obsidian-text)', marginBottom: 2 }}>{room.name}</p>
                <p style={{ fontSize: 11, color: 'var(--obsidian-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {room.lastMessagePreview ?? 'No messages yet'}
                </p>
              </div>
              {!isMobile && (
                <span style={{ fontSize: 11, color: 'var(--obsidian-text-faint)', flexShrink: 0 }}>
                  {room.lastMessageAt ? formatDistanceToNow(room.lastMessageAt, { addSuffix: true }) : ''}
                </span>
              )}
            </Link>
          ))}
          {rooms.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--obsidian-text-faint)', fontSize: 13, background: 'var(--obsidian-surface-soft)' }}>
              No rooms yet. Create one from the sidebar.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
