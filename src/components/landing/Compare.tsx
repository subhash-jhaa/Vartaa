// 'use client'
// import { useIsMobile } from '@/hooks/useIsMobile'

// const rows = [
//   { label: 'Indian language support', v: true, s: '✗', w: 'Partial', d: '✗' },
//   { label: 'Auto-translation', v: true, s: '✗', w: '✗', d: '✗' },
//   { label: 'AI thread summaries', v: true, s: 'Paid only', w: '✗', d: '✗' },
//   { label: 'Voice message STT', v: true, s: '✗', w: '✗', d: '✗' },
//   { label: 'Tasks inside chat', v: true, s: 'Paid only', w: '✗', d: '✗' },
//   { label: 'Free for small teams', v: true, s: 'Limited', w: '✓', d: '✓' },
// ]

// export default function Compare() {
//   const { isMobile } = useIsMobile()

//   return (
//     <div id="compare" style={{ background: 'var(--color-surface-base)', borderTop: '1px solid var(--color-cream-faint)', borderBottom: '1px solid var(--color-cream-faint)' }}>
//       <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '60px 24px' : '88px 56px' }}>
//         <div style={{ fontSize: 11, letterSpacing: '3px', color: 'var(--color-text-faint)', textTransform: 'uppercase', marginBottom: isMobile ? 32 : 52, display: 'flex', alignItems: 'center', gap: 12 }}>
//           Compare
//           <div style={{ flex: 1, height: 1, background: 'var(--color-cream-faint)' }} />
//         </div>

//         <div style={{ 
//           overflowX: isMobile ? 'auto' : 'visible',
//           width: '100%',
//           WebkitOverflowScrolling: 'touch',
//         }}>
//           <table style={{ 
//             width: '100%', 
//             borderCollapse: 'collapse',
//             minWidth: isMobile ? 500 : 'unset'
//           }}>
//             <thead>
//               <tr>
//                 <th style={{ textAlign: 'left', fontSize: 11, color: 'var(--color-text-dim)', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0 0 24px', fontWeight: 400, width: '36%' }}></th>
//                 {['Vartaa', 'Slack', 'WhatsApp', 'Discord'].map((h, i) => (
//                   <th key={h} style={{ fontSize: 11, color: i === 0 ? 'var(--color-gold)' : 'var(--color-text-dim)', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0 24px 24px', textAlign: 'center', fontWeight: 400 }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row, i) => (
//                 <tr key={i}>
//                   <td style={{ padding: '18px 0', borderTop: '1px solid var(--color-cream-faint)', fontSize: 13, color: 'var(--color-text-warm)' }}>{row.label}</td>
//                   <td style={{ padding: '18px 24px', borderTop: '1px solid var(--color-cream-faint)', textAlign: 'center', background: 'var(--color-gold-alpha-low)', fontSize: row.v ? 15 : 13, color: row.v ? 'var(--color-online)' : 'var(--color-text-dim)' }}>{row.v ? '✓' : '✗'}</td>
//                   {[row.s, row.w, row.d].map((val, j) => (
//                     <td key={j} style={{ padding: '18px 24px', borderTop: '1px solid var(--color-cream-faint)', textAlign: 'center', fontSize: val === '✓' ? 15 : 13, color: val === '✓' ? 'var(--color-online)' : val === '✗' ? 'var(--color-text-faint)' : 'var(--color-text-dim)' }}>{val}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }
