'use client'
import { useIsMobile } from '@/hooks/useIsMobile'

const steps = [
  { badge: 'Step 01', t: 'Set your language', d: 'Every user picks their preferred language once — Hindi, Tamil, Bengali, or any of the 22 scheduled languages of India. Set and forget.' },
  { badge: 'Step 02', t: 'Send in any language', d: 'Type or speak in whatever feels natural. Vartaa detects the language automatically — no configuration or tagging needed.' },
  { badge: 'Step 03', t: 'Everyone reads theirs', d: 'Each member sees the message in their language instantly. The original is always preserved — one tap to compare with the source.' },
]

export default function HowItWorks() {
  const { isMobile } = useIsMobile()

  return (
    <div style={{ background: '#111110', borderTop: '1px solid rgba(240,237,230,0.07)', borderBottom: '1px solid rgba(240,237,230,0.07)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '60px 24px' : '88px 56px' }}>
        <div style={{ fontSize: 11, letterSpacing: '3px', color: '#3a3835', textTransform: 'uppercase', marginBottom: isMobile ? 32 : 52, display: 'flex', alignItems: 'center', gap: 12 }}>
          How it works
          <div style={{ flex: 1, height: 1, background: 'rgba(240,237,230,0.07)' }} />
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 32 : 0
        }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, width: isMobile ? '100%' : 'auto' }}>
              <div style={{
                flex: 1,
                padding: isMobile ? '0' : i === 0 ? '40px 48px 40px 0' : i === 2 ? '40px 0 40px 48px' : '40px 48px',
              }}>
                <span style={{ display: 'inline-block', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#d4a843', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 4, padding: '3px 8px', marginBottom: 20 }}>{s.badge}</span>
                <span style={{ fontSize: 56, fontFamily: 'Instrument Serif, serif', color: 'rgba(240,237,230,0.04)', display: 'block', marginBottom: 16, lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                <div style={{ fontSize: 17, color: '#f0ede6', marginBottom: 10, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>{s.t}</div>
                <div style={{ fontSize: 13, color: '#6b6960', lineHeight: 1.7 }}>{s.d}</div>
              </div>
              {!isMobile && i < 2 && (
                <div style={{ width: 1, height: 100, background: 'rgba(240,237,230,0.07)', margin: '0 24px' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
