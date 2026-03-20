'use client'
import Link from 'next/link'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function Hero() {
  const { isMobile } = useIsMobile()

  return (
    <section style={{ 
      padding: isMobile ? '80px 24px 60px' : '120px 56px 80px', 
      maxWidth: 1200, 
      margin: '0 auto', 
      position: 'relative' 
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(240,237,230,0.055) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 100%)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, position: 'relative' }}>
        <div style={{ width: 24, height: 1, background: '#d4a843' }} />
        <span style={{ fontSize: 11, letterSpacing: '3px', color: '#d4a843', textTransform: 'uppercase' }}>
          Team communication, reimagined
        </span>
      </div>

      <h1 style={{
        fontSize: isMobile ? 48 : 72, 
        lineHeight: 1.02, 
        letterSpacing: isMobile ? '-1.5px' : '-3px', 
        fontWeight: 400,
        marginBottom: 28, 
        maxWidth: 680, 
        position: 'relative',
        fontFamily: 'Instrument Serif, serif',
        color: '#f0ede6',
      }}>
        One message.<br />
        <em style={{ fontStyle: 'italic', color: '#d4a843' }}>Every language.</em><br />
        Zero friction.
      </h1>

      <p style={{ fontSize: isMobile ? 16 : 17, color: '#c8c5be', maxWidth: 480, lineHeight: 1.75, marginBottom: 48, fontWeight: 300, position: 'relative' }}>
        Vartaa translates every message in real time across all 22 Indian languages. Built for teams that think in more than one tongue.
      </p>

      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: 12, 
        marginBottom: isMobile ? 60 : 80, 
        position: 'relative' 
      }}>
        <Link href="/sign-up" style={{ 
          padding: '13px 32px', 
          borderRadius: 8, 
          fontSize: 14, 
          background: '#f0ede6', 
          border: '1px solid #f0ede6', 
          color: '#0c0c0b', 
          fontWeight: 500, 
          textDecoration: 'none', 
          transition: 'all 0.15s', 
          display: 'inline-block',
          textAlign: 'center'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#d4a843'; e.currentTarget.style.borderColor = '#d4a843' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f0ede6'; e.currentTarget.style.borderColor = '#f0ede6' }}
        >Start for free</Link>
        <a href="#features" style={{ 
          padding: '13px 32px', 
          borderRadius: 8, 
          fontSize: 14, 
          background: 'transparent', 
          border: '1px solid rgba(240,237,230,0.07)', 
          color: '#6b6960', 
          textDecoration: 'none', 
          transition: 'all 0.15s', 
          display: 'inline-block',
          textAlign: 'center'
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,237,230,0.2)'; e.currentTarget.style.color = '#f0ede6' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(240,237,230,0.07)'; e.currentTarget.style.color = '#6b6960' }}
        >See how it works →</a>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', 
        gap: isMobile ? 32 : 0,
        borderTop: '1px solid rgba(240,237,230,0.07)', 
        paddingTop: 48, 
        position: 'relative' 
      }}>
        {[
          { n: '22', l: 'Indian languages' },
          { n: '<200ms', l: 'Translation latency' },
          { n: '$0', l: 'To get started' },
          { n: '100%', l: 'Original preserved' },
        ].map((s, i) => (
          <div key={i} style={{ 
            paddingRight: !isMobile && i < 3 ? 40 : 0, 
            paddingLeft: !isMobile && i > 0 ? 40 : 0, 
            borderRight: !isMobile && i < 3 ? '1px solid rgba(240,237,230,0.07)' : 'none' 
          }}>
            <span style={{ fontSize: isMobile ? 28 : 36, fontFamily: 'Instrument Serif, serif', color: '#f0ede6', display: 'block', marginBottom: 6 }}>{s.n}</span>
            <div style={{ fontSize: 11, color: '#6b6960', letterSpacing: '0.3px' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
