'use client'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function LanguageMarquee() {
  const { isMobile } = useIsMobile()
  const row1 = ['हिंदी', 'Bengali', 'తెలుగు', 'Marathi', 'தமிழ்', 'Gujarati', 'اردو', 'Kannada', 'മലയാളം', 'Punjabi', 'অসমীয়া', 'Odia', 'मैথিली', 'Konkani', 'संस्कृत', 'Dogri', 'ਪੰਜਾਬੀ', 'Bodo']
  const row2 = ['Spanish', '日本語', 'French', '中文', 'German', '한국어', 'Portuguese', 'العربية', 'Russian', 'Italian', 'Türkçe', 'Dutch', 'Polish', 'Swedish', 'Bahasa', 'Vietnamese', 'Thai', 'Ukrainian']

  const indianNative = new Set(['हिंदी', 'తెలుగు', 'தமிழ்', 'اردو', 'മലയാളം', 'অসমীয়া', 'मैथिली', 'संस्कृत', 'ਪੰਜਾਬੀ'])
  const worldNative = new Set(['日本語', '中文', '한국어', 'العربية', 'Türkçe', 'Bahasa'])

  return (
    <div style={{ 
      borderTop: '1px solid rgba(240,237,230,0.07)', 
      borderBottom: '1px solid rgba(240,237,230,0.07)', 
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100vw'
    }} id="languages">
      {/* Row 1 — Indian languages, scroll left */}
      <div style={{ display: 'flex', overflow: 'hidden', padding: isMobile ? '12px 0' : '15px 0', borderBottom: '1px solid rgba(240,237,230,0.07)' }}>
        <div style={{ display: 'flex', gap: isMobile ? 32 : 48, whiteSpace: 'nowrap', flexShrink: 0, animation: 'marqueeLeft 40s linear infinite' }}>
          {[...row1, ...row1].map((lang, i) => (
            <span key={i} style={{ fontSize: isMobile ? 12 : 13, color: indianNative.has(lang) ? '#c8c5be' : '#6b6960', letterSpacing: '0.5px' }}>{lang}</span>
          ))}
        </div>
      </div>
      {/* Row 2 — World languages, scroll right */}
      <div style={{ display: 'flex', overflow: 'hidden', padding: isMobile ? '12px 0' : '15px 0' }}>
        <div style={{ display: 'flex', gap: isMobile ? 32 : 48, whiteSpace: 'nowrap', flexShrink: 0, animation: 'marqueeRight 30s linear infinite' }}>
          {[...row2, ...row2].map((lang, i) => (
            <span key={i} style={{ fontSize: isMobile ? 12 : 13, color: worldNative.has(lang) ? '#c8c5be' : '#6b6960', letterSpacing: '0.5px' }}>{lang}</span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marqueeLeft { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @keyframes marqueeRight { 0% { transform: translateX(-50%) } 100% { transform: translateX(0) } }
      `}</style>
    </div>
  )
}
