'use client'
import { useIsMobile } from '@/hooks/useIsMobile'

const rows = [
  { label: 'Indian language support', v: true, s: '✗', w: 'Partial', d: '✗' },
  { label: 'Auto-translation', v: true, s: '✗', w: '✗', d: '✗' },
  { label: 'AI thread summaries', v: true, s: 'Paid only', w: '✗', d: '✗' },
  { label: 'Voice message STT', v: true, s: '✗', w: '✗', d: '✗' },
  { label: 'Tasks inside chat', v: true, s: 'Paid only', w: '✗', d: '✗' },
  { label: 'Free for small teams', v: true, s: 'Limited', w: '✓', d: '✓' },
]

export default function Compare() {
  const { isMobile } = useIsMobile()

  return (
    <div id="compare" style={{ background: '#111110', borderTop: '1px solid rgba(240,237,230,0.07)', borderBottom: '1px solid rgba(240,237,230,0.07)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '60px 24px' : '88px 56px' }}>
        <div style={{ fontSize: 11, letterSpacing: '3px', color: '#3a3835', textTransform: 'uppercase', marginBottom: isMobile ? 32 : 52, display: 'flex', alignItems: 'center', gap: 12 }}>
          Compare
          <div style={{ flex: 1, height: 1, background: 'rgba(240,237,230,0.07)' }} />
        </div>

        <div style={{ 
          overflowX: isMobile ? 'auto' : 'visible',
          width: '100%',
          WebkitOverflowScrolling: 'touch',
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: isMobile ? 500 : 'unset'
          }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', fontSize: 11, color: '#6b6960', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0 0 24px', fontWeight: 400, width: '36%' }}></th>
                {['Vartaa', 'Slack', 'WhatsApp', 'Discord'].map((h, i) => (
                  <th key={h} style={{ fontSize: 11, color: i === 0 ? '#d4a843' : '#6b6960', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0 24px 24px', textAlign: 'center', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: '18px 0', borderTop: '1px solid rgba(240,237,230,0.07)', fontSize: 13, color: '#c8c5be' }}>{row.label}</td>
                  <td style={{ padding: '18px 24px', borderTop: '1px solid rgba(240,237,230,0.07)', textAlign: 'center', background: 'rgba(212,168,67,0.03)', fontSize: row.v ? 15 : 13, color: row.v ? '#4ade80' : '#6b6960' }}>{row.v ? '✓' : '✗'}</td>
                  {[row.s, row.w, row.d].map((val, j) => (
                    <td key={j} style={{ padding: '18px 24px', borderTop: '1px solid rgba(240,237,230,0.07)', textAlign: 'center', fontSize: val === '✓' ? 15 : 13, color: val === '✓' ? '#4ade80' : val === '✗' ? '#3a3835' : '#6b6960' }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
