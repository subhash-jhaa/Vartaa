'use client'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function TranslateDemo() {
  const { isMobile } = useIsMobile()

  return (
    <section style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: isMobile ? '60px 24px' : '88px 56px' 
    }}>
      <div style={{ fontSize: 11, letterSpacing: '3px', color: '#3a3835', textTransform: 'uppercase', marginBottom: isMobile ? 32 : 52, display: 'flex', alignItems: 'center', gap: 12 }}>
        Translation in action
        <div style={{ flex: 1, height: 1, background: 'rgba(240,237,230,0.07)' }} />
      </div>

      <div style={{ border: '1px solid rgba(240,237,230,0.07)', borderRadius: 10, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ 
          padding: '14px 24px', 
          borderBottom: '1px solid rgba(240,237,230,0.07)', 
          background: '#111110', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6,
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          {!isMobile && [0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(240,237,230,0.08)' }} />)}
          <span style={{ 
            fontSize: isMobile ? 11 : 12, 
            color: '#6b6960', 
            marginLeft: isMobile ? 0 : 8, 
            letterSpacing: '0.3px' 
          }}>Room: Project Bharat · 4 members · Live translation</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#d4a843', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#d4a843', display: 'inline-block' }} />
            Live
          </span>
        </div>

        {/* Body */}
        <div style={{ 
          padding: isMobile ? 16 : 32, 
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 12 : 16,
          alignItems: 'start',
          overflowX: isMobile ? 'visible' : 'auto',
        }}>
          {/* Original */}
          <div style={{ 
            padding: '16px 18px', 
            borderRadius: 8, 
            background: '#111110', 
            border: '1px solid rgba(240,237,230,0.07)',
            width: isMobile ? '100%' : 220,
            minWidth: isMobile ? 'unset' : 200,
          }}>
            <div style={{ fontSize: 10, color: '#6b6960', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#d4a843', display: 'inline-block' }} />
              Original · Hindi
            </div>
            <div style={{ fontSize: 14, color: '#f0ede6', lineHeight: 1.6 }}>आज की मीटिंग 3 बजे है। सब लोग तैयार रहें और अपने अपडेट्स लेकर आएं।</div>
          </div>

          {/* Arrow */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6960', fontSize: 16, marginTop: 30 }}>→</div>
          )}

          {/* Translations */}
          {[
            { lang: 'Tamil · ta-IN', text: 'இன்றைய கூட்டம் 3 மணிக்கு. அனைவரும் தயாராக இருங்கள்.' },
            { lang: 'Bengali · bn-IN', text: 'आजকের মিটিং ৩টায়। সবাই আপডেট নিয়ে প্রস্তুত থাকুন।' },
            { lang: 'Telugu · te-IN', text: 'నేటి సమావేశం 3 గంటలకు. అందరూ సిద్ధంగా ఉండండి.' },
          ].map((t, i) => (
            <div key={i} style={{ 
              padding: '14px 16px', 
              borderRadius: 8, 
              border: '1px solid rgba(212,168,67,0.1)', 
              background: 'rgba(212,168,67,0.025)',
              width: isMobile ? '100%' : 220,
              minWidth: isMobile ? 'unset' : 200,
            }}>
              <div style={{ fontSize: 10, color: '#d4a843', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>{t.lang}</div>
              <div style={{ fontSize: 12, color: '#c8c5be', lineHeight: 1.6 }}>{t.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
