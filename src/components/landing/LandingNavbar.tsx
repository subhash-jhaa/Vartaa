'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import VartaaLogo from '@/components/VartaaLogo'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useAuthActions } from '@convex-dev/auth/react'

export default function LandingNavbar() {
  const { isMobile } = useIsMobile()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, isLoading } = useCurrentUser()
  const { signOut } = useAuthActions()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '12px 20px' : '18px 56px',
      borderBottom: '1px solid var(--color-cream-faint)',
      position: isMobile ? 'relative' : 'sticky', 
      top: isMobile ? 'auto' : 0,
      background: scrolled ? 'rgba(12,12,11,0.96)' : 'var(--color-ink)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.2s',
      width: '100%',
      maxWidth: '100vw',
      zIndex: 100,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 1564, // 1500px content + 32px * 2 side padding
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? 0 : '0 76px'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
          <VartaaLogo size={isMobile ? 28 : 32} showText={true} textSize={isMobile ? 14 : 16} />
        </Link>

        {/* Auth Buttons / Chat Link (Right) */}
        <div style={{ display: 'flex', gap: 16 }}>
          {!isLoading && (
            isAuthenticated ? (
              <Link href="/dashboard" style={{ padding: '8px 20px', borderRadius: 7, fontSize: 13, background: 'var(--color-cream)', border: '1px solid var(--color-cream)', color: 'var(--color-ink)', fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-gold)'; e.currentTarget.style.borderColor = 'var(--color-gold)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-cream)'; e.currentTarget.style.borderColor = 'var(--color-cream)' }}
              >Go to Chat</Link>
            ) : (
              <Link href="/sign-in" style={{ padding: '8px 20px', borderRadius: 7, fontSize: 13, background: 'transparent', border: '1px solid var(--color-cream-faint)', color: 'var(--color-text-dim)', textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-cream-hover)'; e.currentTarget.style.color = 'var(--color-cream)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-cream-faint)'; e.currentTarget.style.color = 'var(--color-text-dim)' }}
              >Sign in</Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
