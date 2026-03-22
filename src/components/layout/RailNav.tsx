'use client'
import { useAuthActions } from '@convex-dev/auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { LayoutGrid, MessageCircle, Settings } from 'lucide-react'
import Link from 'next/link'

type RailView = 'rooms' | 'dms'

interface RailNavProps {
  activeView: RailView
  onViewChange: (view: RailView) => void
}

export default function RailNav({ activeView, onViewChange }: RailNavProps) {
  const { signOut } = useAuthActions()
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useCurrentUser()

  const buttonStyle = (isActive: boolean) => ({
    background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
    border: isActive ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
    borderRadius: 8,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: isActive ? 'var(--obsidian-primary)' : '#333',
    transition: 'all 0.3s',
    padding: 0
  })

  return (
    <aside style={{
      width: 56, height: '100vh', background: '#000',
      borderRight: '1px solid var(--obsidian-border)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 0', flexShrink: 0, zIndex: 50,
    }}>
      <div style={{ marginBottom: 56 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--obsidian-primary)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z"/>
              <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/>
            </svg>
          </div>
        </Link>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
        <button 
          onClick={() => onViewChange('rooms')}
          style={buttonStyle(activeView === 'rooms')}
          title="Rooms"
        >
          <LayoutGrid size={18} strokeWidth={1.5} />
        </button>
        <button 
          onClick={() => onViewChange('dms')}
          style={buttonStyle(activeView === 'dms')}
          title="Direct Messages"
        >
          <MessageCircle size={18} strokeWidth={1.5} />
        </button>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center' }}>
        <button onClick={() => signOut()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--obsidian-text-faint)', transition: 'color 0.3s', padding: 0 }}
          title="Sign out">
          <Settings size={18} strokeWidth={1.5} />
        </button>
        {user?.image ? (
          <img src={user.image} alt={user.name ?? 'User'}
            style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.05)', filter: 'grayscale(1)', cursor: 'pointer', transition: 'filter 0.7s' }}
            onMouseEnter={e => e.currentTarget.style.filter = 'grayscale(0)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'grayscale(1)'}
          />
        ) : (
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--obsidian-primary-alpha)', border: '1px solid var(--obsidian-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--obsidian-primary)', fontWeight: 700 }}>
            {(user?.name ?? 'U')[0].toUpperCase()}
          </div>
        )}
      </div>
    </aside>
  )
}
