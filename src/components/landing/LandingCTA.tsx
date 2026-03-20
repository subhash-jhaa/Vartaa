'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function LandingCTA() {
  const [email, setEmail] = useState('')
  const { isMobile } = useIsMobile()

  return (
    <div style={{ padding: isMobile ? '0 24px 60px' : '0 56px 88px' }}>
      <div style={{
        border: '1px solid rgba(240,237,230,0.07)', borderRadius: 12,
        padding: isMobile ? '48px 24px' : '64px 80px',
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'center' : 'flex-start', 
        textAlign: isMobile ? 'center' : 'left',
        gap: isMobile ? 32 : 0,
        position: 'relative', 
        overflow: 'hidden',
      }}>
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.5), transparent)' }} />

        <div>
          <h2 style={{ 
            fontSize: isMobile ? 32 : 42, 
            fontFamily: 'Instrument Serif, serif', 
            fontStyle: 'italic', 
            marginBottom: 10, 
            lineHeight: 1.1 
          }}>
            Start speaking<br />every language.
          </h2>
          <p style={{ fontSize: 14, color: '#c8c5be' }}>Free forever for small teams. No credit card required.</p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: isMobile ? 'center' : 'flex-end', 
          gap: 10, 
          flexShrink: 0,
          width: isMobile ? '100%' : 'auto'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 12 : 8,
            width: isMobile ? '100%' : 'auto'
          }}>
            <input
              type="email"
              placeholder="Your work email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ 
                background: 'rgba(240,237,230,0.04)', 
                border: '1px solid rgba(240,237,230,0.07)', 
                borderRadius: 8, 
                padding: '13px 18px', 
                color: '#f0ede6', 
                fontSize: 14, 
                outline: 'none', 
                width: isMobile ? '100%' : 280, 
                fontFamily: 'Geist, sans-serif', 
                transition: 'border-color 0.15s',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,168,67,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(240,237,230,0.07)'}
            />
            <Link href="/sign-up" style={{ 
              padding: '13px 28px', 
              borderRadius: 8, 
              fontSize: 14, 
              background: '#f0ede6', 
              border: '1px solid #f0ede6', 
              color: '#0c0c0b', 
              fontWeight: 500, 
              textDecoration: 'none', 
              whiteSpace: 'nowrap', 
              transition: 'all 0.15s', 
              display: 'inline-flex', 
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobile ? '100%' : 'auto'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4a843'; e.currentTarget.style.borderColor = '#d4a843' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0ede6'; e.currentTarget.style.borderColor = '#f0ede6' }}
            >Get early access</Link>
          </div>
          <span style={{ 
            fontSize: 11, 
            color: '#6b6960',
            textAlign: isMobile ? 'center' : 'right'
          }}>No credit card required · Free for teams up to 10</span>
        </div>
      </div>
    </div>
  )
}
