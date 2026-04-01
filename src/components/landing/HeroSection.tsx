'use client'
import Link from 'next/link'
import { motion, type Variants } from 'motion/react'
import { useIsMobile } from '@/hooks/useIsMobile'
import AnimatedChatDemo from './AnimatedChatDemo'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function Hero() {
  const { isMobile } = useIsMobile()

  return (
    <section style={{
      padding: isMobile ? '80px 24px 60px' : '120px 88px 80px',
      maxWidth: 1564,
      margin: '0 auto',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, var(--color-cream-dot) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 100%)',
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 64,
        alignItems: 'center',
      }}>
        {/* LEFT — existing hero text content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, position: 'relative' }}>
            <div style={{ width: 24, height: 1, background: 'var(--color-gold)' }} />
            <span style={{ fontSize: 11, letterSpacing: '3px', color: 'var(--color-gold)', textTransform: 'uppercase' }}>
              Team communication, reimagined
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} style={{
            fontSize: isMobile ? 48 : 56,
            lineHeight: 1.05,
            letterSpacing: isMobile ? '-1.5px' : '-2px',
            fontWeight: 400,
            marginBottom: 28,
            position: 'relative',
            fontFamily: 'Instrument Serif, serif',
            color: 'var(--color-cream)',
          }}>
            One message.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Every language.</em><br />
            Zero friction.
          </motion.h1>

          <motion.p variants={itemVariants} style={{ fontSize: isMobile ? 16 : 17, color: 'var(--color-text-warm)', maxWidth: 480, lineHeight: 1.75, marginBottom: 48, fontWeight: 300, position: 'relative' }}>
            Vartaa translates every message in real time across all 22 Indian languages. Built for teams that think in more than one tongue.
          </motion.p>

          <motion.div variants={itemVariants} style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12,
            marginBottom: isMobile ? 60 : 80,
            position: 'relative'
          }}>
            <Link href="/sign-up" style={{
              padding: '13px 32px',
              borderRadius: 8,
              fontSize: 14,
              background: 'var(--color-cream)',
              border: '1px solid var(--color-cream)',
              color: 'var(--color-ink)',
              fontWeight: 400,
              textDecoration: 'none',
              transition: 'all 0.15s',
              display: 'inline-block',
              textAlign: 'center'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-gold)'; e.currentTarget.style.borderColor = 'var(--color-gold)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-cream)'; e.currentTarget.style.borderColor = 'var(--color-cream)' }}
            >Start for free</Link>
            <a href="#features" style={{
              padding: '13px 32px',
              borderRadius: 8,
              fontSize: 14,
              background: 'transparent',
              border: '1px solid var(--color-cream-faint)',
              color: 'var(--color-text-dim)',
              textDecoration: 'none',
              transition: 'all 0.15s',
              display: 'inline-block',
              textAlign: 'center'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-cream-hover)'; e.currentTarget.style.color = 'var(--color-cream)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-cream-faint)'; e.currentTarget.style.color = 'var(--color-text-dim)' }}
            >See how it works →</a>
          </motion.div>

        </motion.div>

        {/* RIGHT — animated chat demo */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: isMobile ? 'center' : 'flex-end',
            marginTop: isMobile ? '20px' : '-60px',
            paddingRight: '0px',
            marginRight: isMobile ? 0 : '-150px',
            width: '100%',
          }}>
          <AnimatedChatDemo />
        </motion.div>
      </div>

    </section>
  )
}
