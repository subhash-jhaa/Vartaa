'use client'
import { motion, type Variants } from 'motion/react'
import { useIsMobile } from '@/hooks/useIsMobile'

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
}

export default function HowItWorks() {
  const { isMobile } = useIsMobile()

  return (
    <div style={{ background: 'var(--color-surface-base)', borderTop: '1px solid var(--color-cream-faint)', borderBottom: '1px solid var(--color-cream-faint)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '60px 24px' : '88px 56px' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: 11, letterSpacing: '3px', color: 'var(--color-text-faint)', textTransform: 'uppercase', marginBottom: isMobile ? 32 : 52, display: 'flex', alignItems: 'center', gap: 12 }}
        >
          How it works
          <div style={{ flex: 1, height: 1, background: 'var(--color-cream-faint)' }} />
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          transition={{ staggerChildren: 0.2 }}
          style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 32 : 0
          }}
        >
          {steps.map((s, i) => (
            <motion.div 
              key={i} 
              variants={stepVariants}
              whileHover={{ y: -5 }}
              style={{ display: 'flex', alignItems: 'center', flex: 1, width: isMobile ? '100%' : 'auto' }}
            >
              <div style={{
                flex: 1,
                padding: isMobile ? '0' : i === 0 ? '40px 48px 40px 0' : i === 2 ? '40px 0 40px 48px' : '40px 48px',
              }}>
                <span style={{ display: 'inline-block', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-gold)', border: '1px solid var(--color-gold-alpha-faint)', borderRadius: 4, padding: '3px 8px', marginBottom: 20 }}>{s.badge}</span>
                <span style={{ fontSize: 56, fontFamily: 'Instrument Serif, serif', color: 'var(--color-cream-soft)', display: 'block', marginBottom: 16, lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                <div style={{ fontSize: 17, color: 'var(--color-text-bright)', marginBottom: 10, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>{s.t}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-dim)', lineHeight: 1.7 }}>{s.d}</div>
              </div>
              {!isMobile && i < 2 && (
                <div style={{ width: 1, height: 100, background: 'var(--color-cream-faint)', margin: '0 24px' }} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const steps = [
  { badge: 'Step 01', t: 'Set your language', d: 'Every user picks their preferred language once — Hindi, Tamil, Bengali, or any of the 22 scheduled languages of India. Set and forget.' },
  { badge: 'Step 02', t: 'Send in any language', d: 'Type or speak in whatever feels natural. Vartaa detects the language automatically — no configuration or tagging needed.' },
  { badge: 'Step 03', t: 'Everyone reads theirs', d: 'Each member sees the message in their language instantly. The original is always preserved — one tap to compare with the source.' },
]
