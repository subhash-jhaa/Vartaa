'use client'
import { useEffect, useRef } from 'react'

export default function AnimatedChatDemo() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ids = ['m1','m3','m4','tr1','tr3','tr4','b1','b3','b4','typing']

    const show = (id: string, delay: number) => setTimeout(() => {
      document.getElementById(id)?.classList.add('acd-visible')
    }, delay)

    const hide = (id: string) => {
      document.getElementById(id)?.classList.remove('acd-visible')
    }

    const runSequence = () => {
      show('m1', 400)
      show('tr1', 1300); show('b1', 1300)
      show('typing', 2400)
      setTimeout(() => hide('typing'), 4200)
      show('m3', 4400)
      show('tr3', 5300); show('b3', 5300)
      show('m4', 6400)
      show('tr4', 7300); show('b4', 7300)
    }

    runSequence()
    const loop = setInterval(() => {
      ids.forEach(hide)
      setTimeout(runSequence, 600)
    }, 10000)

    return () => clearInterval(loop)
  }, [])

  return (
    <>
      <style>{`
        .acd-msg { opacity: 0; transform: translateY(10px); transition: all 0.5s cubic-bezier(0.4,0,0.2,1); }
        .acd-msg.acd-visible { opacity: 1; transform: translateY(0); }
        .acd-tr { opacity: 0; max-height: 0; overflow: hidden; transition: all 0.4s ease; }
        .acd-tr.acd-visible { opacity: 1; max-height: 80px; }
        .acd-badge { opacity: 0; transition: opacity 0.3s ease 0.2s; font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-ui-faint); }
        .acd-badge.acd-visible { opacity: 1; }
        .acd-typing { opacity: 0; transition: opacity 0.3s ease; display: flex; align-items: center; gap: 10px; }
        .acd-typing.acd-visible { opacity: 1; }
        .acd-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-accent-a-dot); animation: acd-boing 1.2s ease infinite; }
        .acd-dot:nth-child(2) { animation-delay: 0.2s; }
        .acd-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes acd-boing { 0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)} }
        @media (max-width: 640px) {
          .acd-bubble { font-size: 13px !important; padding: 9px 12px !important; max-width: 220px !important; }
          .acd-tr { font-size: 11px !important; }
          .acd-msg { gap: 8px !important; }
        }
      `}</style>

      <div ref={containerRef} style={{
        background: 'var(--obsidian-bg)',
        borderRadius: 20,
        border: '1px solid var(--color-white-border)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: 480,
        margin: '0 0 0 auto',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-white-border-soft)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface-dark)' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-accent-a-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--color-accent-a)', flexShrink: 0 }}>A</div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 500 }}>Project Bharat</div>
            <div style={{ fontSize: 11, color: 'var(--color-ui-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-online)', display: 'inline-block' }} />
              3 members · Live translation
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 18, minHeight: 360 }}>

          {/* MSG 1 — Hindi */}
          <div className="acd-msg" id="m1" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-accent-a-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--color-accent-a)', flexShrink: 0 }}>A</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-ui-muted)', fontWeight: 600 }}>Arjun</span>
                <span style={{ fontSize: 10, color: 'var(--color-ui-faint)' }}>Hindi</span>
              </div>
              <div className="acd-bubble" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-white-border-faint)', borderRadius: 16, padding: '10px 14px', fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                आज की मीटिंग 3 बजे है। सब तैयार रहें।
              </div>
              <div className="acd-tr" id="tr1" style={{ paddingLeft: 10, borderLeft: '2px solid var(--color-white-border-faint)', fontSize: 12, color: 'var(--color-ui-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                Today's meeting is at 3 PM. Everyone be ready.
              </div>
              <div className="acd-badge" id="b1">Translated from Hindi · hi-IN</div>
            </div>
          </div>


          {/* TYPING */}
          <div className="acd-typing" id="typing">
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-accent-b-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: 'var(--color-accent-b)', flexShrink: 0 }}>S</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <div className="acd-dot" />
              <div className="acd-dot" />
              <div className="acd-dot" />
            </div>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-ui-faint)' }}>Sarah is translating...</span>
          </div>

          {/* MSG 3 — Tamil */}
          <div className="acd-msg" id="m3" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-accent-b-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--color-accent-b)', flexShrink: 0 }}>S</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-ui-muted)', fontWeight: 600 }}>Sarah</span>
                <span style={{ fontSize: 10, color: 'var(--color-ui-faint)' }}>Tamil</span>
              </div>
              <div className="acd-bubble" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-white-border-faint)', borderRadius: 16, padding: '10px 14px', fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                நானும் தயாராக இருக்கிறேன். சந்திப்பில் பார்க்கலாம்!
              </div>
              <div className="acd-tr" id="tr3" style={{ paddingLeft: 10, borderLeft: '2px solid var(--color-white-border-faint)', fontSize: 12, color: 'var(--color-ui-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                I'm ready too. See you at the meeting!
              </div>
              <div className="acd-badge" id="b3">Translated from Tamil · ta-IN</div>
            </div>
          </div>

          {/* MSG 4 — Own reply */}
          <div className="acd-msg" id="m4" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-accent-a-alpha-low)', border: '1px solid var(--color-accent-a-alpha-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'var(--color-accent-a)', flexShrink: 0 }}>YOU</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end', maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--color-ui-faint)' }}>English</span>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent-a-subtle)', fontWeight: 600 }}>Self</span>
              </div>
              <div className="acd-bubble" style={{ background: 'var(--color-surface-card-warm)', border: '1px solid var(--color-accent-a-alpha-faint)', borderRadius: 16, padding: '10px 14px', fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                Perfect, see everyone at 3!
              </div>
              <div className="acd-tr" id="tr4" style={{ paddingRight: 10, borderRight: '2px solid var(--color-accent-a-half)', fontSize: 11, color: 'var(--color-accent-a-half)', fontStyle: 'italic', lineHeight: 1.5, textAlign: 'right' }}>
                3 बजे मिलते हैं · 3 மணிக்கு சந்திக்கலாம்
              </div>
              <div className="acd-badge" id="b4" style={{ textAlign: 'right' }}>Auto-translated to 2 languages</div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
