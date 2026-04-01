'use client'
import { motion, type Variants } from 'motion/react'
import { useIsMobile } from '@/hooks/useIsMobile'

const features = [
  { n: '01', t: 'Real-time translation', d: 'Every message auto-translated to each member\'s preferred language. Powered by Sarvam AI — built specifically for Indian languages.' },
  { n: '02', t: 'AI thread summaries', d: 'Missed a long thread? One click catches you up with a Gemini-powered summary in your own language.' },
  { n: '03', t: 'Voice messages', d: 'Record in any language. Sarvam transcribes, translates, and plays back in everyone\'s preferred tongue automatically.' },
  { n: '04', t: 'Tasks inside chat', d: 'AI extracts action items directly from messages. Track them without ever leaving the conversation.' },
  { n: '05', t: 'Smart replies', d: 'Context-aware suggestions that understand what was just said — in any language, under 200ms.' },
  { n: '06', t: 'Zero noise', d: 'No channels. No status updates. No notification storms. Just rooms, messages, and work that matters.' },
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
}

export default function Features() {
  const { isMobile } = useIsMobile()

  return (
    <section id="features" style={{ 
      padding: isMobile ? '60px 20px' : '100px 80px', 
      maxWidth: 1200, 
      margin: '0 auto' 
    }}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        style={{ fontSize: 11, letterSpacing: '3px', color: 'var(--color-text-faint)', textTransform: 'uppercase', marginBottom: 52, display: 'flex', alignItems: 'center', gap: 12 }}
      >
        What you get
        <div style={{ flex: 1, height: 1, background: 'var(--color-cream-hover)' }} />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 0,
        }}
      >
        {features.map((f, i) => {
          const isLastInRow = (i + 1) % (isMobile ? 1 : 3) === 0
          const isLastRow = i >= (features.length - (isMobile ? 1 : 3))

          return (
            <motion.div 
              key={i} 
              variants={cardVariants}
              style={{
                padding: isMobile ? '24px 0' : '40px 32px',
                borderRight: !isLastInRow ? '1px solid var(--color-cream-faint)' : 'none',
                borderBottom: !isLastRow ? '1px solid var(--color-cream-faint)' : 'none',
                background: 'transparent',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-cream-soft)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontSize: 11, color: 'var(--color-text-faint)', letterSpacing: '2px', marginBottom: 20 }}>{f.n}</div>
              <div style={{ fontSize: 19, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', color: 'var(--color-text-bright)', marginBottom: 12, lineHeight: 1.25 }}>{f.t}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-dim)', lineHeight: 1.75, fontWeight: 300 }}>{f.d}</div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
