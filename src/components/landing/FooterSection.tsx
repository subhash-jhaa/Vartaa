'use client'
import Link from 'next/link'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function LandingFooter() {
  const { isMobile } = useIsMobile()

  return (
    <footer style={{ 
      borderTop: '1px solid rgba(240,237,230,0.07)', 
      padding: isMobile ? '40px 24px' : '32px 56px', 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',
      gap: isMobile ? 32 : 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18, color: '#d4a843', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>वार्ता</span>
        <div style={{ width: 1, height: 16, background: 'rgba(212,168,67,0.3)' }} />
        <span style={{ fontSize: 14, color: '#f0ede6', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>Vartaa</span>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Privacy', 'Terms', 'GitHub', 'Twitter'].map(l => (
          <Link key={l} href="#" style={{ fontSize: 12, color: '#6b6960', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c8c5be'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b6960'}
          >{l}</Link>
        ))}
      </div>
      <div style={{ fontSize: 12, color: '#3a3835', textAlign: isMobile ? 'center' : 'right' }}>© 2026 Vartaa. Built for India.</div>
    </footer>
  )
}
