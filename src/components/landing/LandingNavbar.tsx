'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import VartaaLogo from '@/components/VartaaLogo'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function LandingNavbar() {
  const { isMobile } = useIsMobile()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    ['Features', '#features'],
    ['Languages', '#languages'],
    ['Compare', '#compare'],
    ['Use cases', '#use-cases']
  ]

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '12px 20px' : '18px 56px',
      borderBottom: '1px solid rgba(240,237,230,0.07)',
      position: isMobile ? 'relative' : 'sticky', 
      top: isMobile ? 'auto' : 0,
      background: scrolled ? 'rgba(12,12,11,0.96)' : '#0c0c0b',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.2s',
      width: '100%',
      maxWidth: '100vw',
      zIndex: 100,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
        <VartaaLogo size={isMobile ? 28 : 32} showText={true} textSize={isMobile ? 14 : 16} />
      </Link>

      {/* Desktop Links */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: 32 }}>
          {navLinks.map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: 13, color: '#6b6960', textDecoration: 'none', letterSpacing: '0.2px', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f0ede6'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b6960'}
            >{label}</Link>
          ))}
        </div>
      )}

      {/* Desktop Auth Buttons */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/sign-in" style={{ padding: '8px 20px', borderRadius: 7, fontSize: 13, background: 'transparent', border: '1px solid rgba(240,237,230,0.07)', color: '#6b6960', textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,237,230,0.2)'; e.currentTarget.style.color = '#f0ede6' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(240,237,230,0.07)'; e.currentTarget.style.color = '#6b6960' }}
          >Sign in</Link>
          <Link href="/sign-up" style={{ padding: '8px 20px', borderRadius: 7, fontSize: 13, background: '#f0ede6', border: '1px solid #f0ede6', color: '#0c0c0b', fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#d4a843'; e.currentTarget.style.borderColor = '#d4a843' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f0ede6'; e.currentTarget.style.borderColor = '#f0ede6' }}
          >Get started</Link>
        </div>
      )}

      {/* Mobile Hamburger */}
      {isMobile && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none', 
            color: '#f0ede6',
            fontSize: 22,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Mobile Dropdown Menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#111110',
          borderBottom: '1px solid rgba(240,237,230,0.1)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          zIndex: 100,
        }}>
          {navLinks.map(([label, href]) => (
            <Link 
              key={label} 
              href={href} 
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: 15, color: '#f0ede6', textDecoration: 'none' }}
            >
              {label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'rgba(240,237,230,0.07)', margin: '4px 0' }} />
          <Link href="/sign-in" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, color: '#6b6960', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/sign-up" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, color: '#d4a843', textDecoration: 'none', fontWeight: 500 }}>Get started</Link>
        </div>
      )}
    </nav>
  )
}
