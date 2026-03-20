'use client'
import { useIsMobile } from '@/hooks/useIsMobile'

const cases = [
  { n: '01', t: 'College project teams', d: 'Team members from different states chat in their own language. No one gets left behind during crunch time.', tag: 'Students' },
  { n: '02', t: 'Early-stage startups', d: 'Founders from Mumbai, Chennai, and Kolkata — one room, every language, zero miscommunication.', tag: 'Startups' },
  { n: '03', t: 'Remote dev teams', d: 'Standup in Hindi, code review in English, decisions in Tamil. Vartaa handles the translation layer.', tag: 'Engineering' },
  { n: '04', t: 'Design agencies', d: 'Brief clients in their language. No miscommunication on specs, timelines, or creative direction.', tag: 'Agencies' },
  { n: '05', t: 'NGOs & field teams', d: 'Coordinate across districts and states. Ground-level workers communicate in their mother tongue.', tag: 'NGOs' },
  { n: '06', t: 'Creator collectives', d: 'Collaborate with creators across India. Ideas flow freely when language is never a barrier.', tag: 'Creators' },
]

export default function UseCases() {
  const { isMobile } = useIsMobile()

  return (
    <section id="use-cases" style={{ 
      padding: isMobile ? '60px 24px' : '88px 56px', 
      maxWidth: 1200, 
      margin: '0 auto',
      overflowX: 'hidden',
      width: '100%'
    }}>
      <div style={{ fontSize: 11, letterSpacing: '3px', color: '#3a3835', textTransform: 'uppercase', marginBottom: isMobile ? 32 : 52, display: 'flex', alignItems: 'center', gap: 12 }}>
        Use cases
        <div style={{ flex: 1, height: 1, background: 'rgba(240,237,230,0.07)' }} />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? 12 : 0
      }}>
        {cases.map((c, i) => {
          const isMiddleCol = !isMobile && i % 3 === 1
          const isLastRow = isMobile ? i === cases.length - 1 : i >= 3
          
          let padding = '40px 36px'
          if (isMobile) {
            padding = '32px 0'
          } else if (i % 3 === 0) {
            padding = '40px 36px 40px 0'
          } else if (i % 3 === 2) {
            padding = '40px 0 40px 36px'
          }

          return (
            <div key={i} style={{
              padding,
              borderBottom: isLastRow ? 'none' : '1px solid rgba(240,237,230,0.07)',
              borderLeft: isMiddleCol ? '1px solid rgba(240,237,230,0.07)' : 'none',
              borderRight: isMiddleCol ? '1px solid rgba(240,237,230,0.07)' : 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,237,230,0.01)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontSize: 11, color: '#3a3835', letterSpacing: '2px', marginBottom: 20 }}>{c.n}</div>
              <div style={{ fontSize: 17, color: '#f0ede6', marginBottom: 10, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', lineHeight: 1.3 }}>{c.t}</div>
              <div style={{ fontSize: 13, color: '#6b6960', lineHeight: 1.7 }}>{c.d}</div>
              <span style={{ display: 'inline-block', fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: '#6b6960', border: '1px solid rgba(240,237,230,0.07)', borderRadius: 4, padding: '3px 8px', marginTop: 16 }}>{c.tag}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
