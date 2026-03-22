'use client'
import Link from 'next/link'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function LandingFooter() {
  const { isMobile } = useIsMobile()

  return (
    <footer style={{
      borderTop: '1px solid var(--color-cream-faint)',
      padding: isMobile ? '40px 24px' : '32px 56px',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: isMobile ? 32 : 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18, color: 'var(--color-gold)', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>वार्ता</span>
        <div style={{ width: 1, height: 16, background: 'var(--color-gold-alpha-faint)' }} />
        <span style={{ fontSize: 14, color: 'var(--color-cream)', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>Vartaa</span>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Privacy', 'Terms', 'GitHub', 'Twitter'].map(l => (
          <Link key={l} href="#" style={{ fontSize: 12, color: 'var(--color-text-dim)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-warm)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-dim)'}
          >{l}</Link>
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-faint)', textAlign: isMobile ? 'center' : 'right' }}>© 2026 Vartaa. Built for India.</div>
    </footer>
  )
}
