'use client'
import { motion, type Variants } from 'motion/react'

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
  }
}

const translationVariants: Variants = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

const badgeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { delay: 0.2, duration: 0.3 }
  }
}

export default function AnimatedChatDemo() {
  return (
    <div style={{
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
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={messageVariants}
          style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
        >
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-accent-a-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--color-accent-a)', flexShrink: 0 }}>A</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-ui-muted)', fontWeight: 600 }}>Arjun</span>
              <span style={{ fontSize: 10, color: 'var(--color-ui-faint)' }}>Hindi</span>
            </div>
            <div style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-white-border-faint)', borderRadius: 16, padding: '10px 14px', fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
              आज की मीटिंग 3 बजे है। सब तैयार रहें।
            </div>
            <motion.div 
              variants={translationVariants}
              transition={{ delay: 0.9 }}
              style={{ paddingLeft: 10, borderLeft: '2px solid var(--color-white-border-faint)', fontSize: 12, color: 'var(--color-ui-muted)', fontStyle: 'italic', lineHeight: 1.5 }}
            >
              Today&apos;s meeting is at 3 PM. Everyone be ready.
            </motion.div>
            <motion.div variants={badgeVariants} transition={{ delay: 1.1 }} style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-ui-faint)' }}>
              Translated from Hindi · hi-IN
            </motion.div>
          </div>
        </motion.div>

        {/* TYPING */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ 
            times: [0, 0.1, 0.9, 1],
            duration: 1.8, 
            delay: 2.0,
            repeat: Infinity,
            repeatDelay: 8.2
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-accent-b-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: 'var(--color-accent-b)', flexShrink: 0 }}>S</div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-accent-a-dot)' }}
                className="acd-dot"
              />
            ))}
          </div>
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-ui-faint)' }}>Sarah is translating...</span>
        </motion.div>

        {/* MSG 3 — Tamil */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={messageVariants}
          transition={{ delay: 4.0 }}
          style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
        >
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-accent-b-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--color-accent-b)', flexShrink: 0 }}>S</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-ui-muted)', fontWeight: 600 }}>Sarah</span>
              <span style={{ fontSize: 10, color: 'var(--color-ui-faint)' }}>Tamil</span>
            </div>
            <div style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-white-border-faint)', borderRadius: 16, padding: '10px 14px', fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
              நானும் தயாராக இருக்கிறேன். சந்திப்பில் பார்க்கலாம்!
            </div>
            <motion.div 
              variants={translationVariants}
              transition={{ delay: 4.9 }}
              style={{ paddingLeft: 10, borderLeft: '2px solid var(--color-white-border-faint)', fontSize: 12, color: 'var(--color-ui-muted)', fontStyle: 'italic', lineHeight: 1.5 }}
            >
              I&apos;m ready too. See you at the meeting!
            </motion.div>
            <motion.div variants={badgeVariants} transition={{ delay: 5.1 }} style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-ui-faint)' }}>
              Translated from Tamil · ta-IN
            </motion.div>
          </div>
        </motion.div>

        {/* MSG 4 — Own reply */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={messageVariants}
          transition={{ delay: 6.0 }}
          style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: 'row-reverse' }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-accent-a-alpha-low)', border: '1px solid var(--color-accent-a-alpha-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'var(--color-accent-a)', flexShrink: 0 }}>YOU</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end', maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 10, color: 'var(--color-ui-faint)' }}>English</span>
              <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent-a-subtle)', fontWeight: 600 }}>Self</span>
            </div>
            <div style={{ background: 'var(--color-surface-card-warm)', border: '1px solid var(--color-accent-a-alpha-faint)', borderRadius: 16, padding: '10px 14px', fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
              Perfect, see everyone at 3!
            </div>
            <motion.div 
              variants={translationVariants}
              transition={{ delay: 6.9 }}
              style={{ paddingRight: 10, borderRight: '2px solid var(--color-accent-a-half)', fontSize: 11, color: 'var(--color-accent-a-half)', fontStyle: 'italic', lineHeight: 1.5, textAlign: 'right' }}
            >
              3 बजे मिलते हैं · 3 மணிக்கு சந்திக்கலாம்
            </motion.div>
            <motion.div variants={badgeVariants} transition={{ delay: 7.1 }} style={{ textAlign: 'right', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-ui-faint)' }}>
              Auto-translated to 2 languages
            </motion.div>
          </div>
        </motion.div>

      </div>
      <style>{`
        .acd-dot { width: 5px; height: 5px; border-radius: 50% !important; }
      `}</style>
    </div>
  )
}
