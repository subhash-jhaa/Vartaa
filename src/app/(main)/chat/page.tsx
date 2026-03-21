'use client'
import VartaaLogo from '@/components/VartaaLogo'
import { useIsMobile } from '@/hooks/useIsMobile'
import Link from 'next/link'

export default function ChatPlaceholderPage() {
  const { isMobile } = useIsMobile()

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 24,
      background: '#0c0c0b',
      textAlign: 'center'
    }}>
      <div style={{ 
        opacity: 0.3, 
        marginBottom: 24,
        transform: 'scale(1.2)'
      }}>
        <VartaaLogo size={64} showText={false} />
      </div>
      
      <h2 style={{ 
        fontSize: 20, 
        fontWeight: 500, 
        color: '#f0ede6', 
        marginBottom: 8,
        letterSpacing: -0.3
      }}>
        Select a conversation
      </h2>
      
      <p style={{ 
        fontSize: 14, 
        color: '#6b6960', 
        maxWidth: 280, 
        lineHeight: 1.5,
        marginBottom: 24
      }}>
        Choose a room from the sidebar to start chatting or create a new one to invite others.
      </p>

      {isMobile && (
        <Link href="/dashboard" style={{
          padding: '8px 16px',
          background: 'rgba(240,237,230,0.05)',
          border: '1px solid rgba(240,237,230,0.1)',
          borderRadius: 8,
          color: '#c8c5be',
          fontSize: 13,
          textDecoration: 'none',
          transition: 'all 0.2s'
        }}>
          ← Back to Dashboard
        </Link>
      )}
    </div>
  )
}
