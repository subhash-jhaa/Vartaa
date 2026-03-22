'use client'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function StatsSection() {
  const { isMobile } = useIsMobile()

  return (
    <div style={{
      maxWidth: 1500,
      margin: '0 auto',
      padding: isMobile ? '48px 24px' : '56px 56px',
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
      gap: 32,
      borderTop: '1px solid var(--color-white-border-soft)',
      borderBottom: '1px solid var(--color-white-border-soft)',
      justifyItems: 'center',
      textAlign: 'center',
    }}>
      {[
        { n: '22', l: 'Indian languages' },
        { n: '<200ms', l: 'Translation latency' },
        { n: '$0', l: 'To get started' },
        { n: '100%', l: 'Original preserved' },
      ].map((s, i) => (
        <div key={i}>
          <span style={{
            fontSize: isMobile ? 28 : 32,
            fontFamily: 'Instrument Serif, serif',
            color: 'var(--color-text-bright)',
            display: 'block',
            marginBottom: 6,
          }}>
            {s.n}
          </span>
          <div style={{ fontSize: 11, color: 'var(--color-text-dim)', letterSpacing: '0.3px' }}>
            {s.l}
          </div>
        </div>
      ))}
    </div>
  )
}
