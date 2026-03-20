'use client'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function MainLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { isMobile } = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: '#0c0c0b', 
      overflow: 'hidden',
      position: 'relative',
    }}>
      
      {/* Mobile overlay background */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <div style={{
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (sidebarOpen ? 0 : '-100%') : 0,
        top: 0,
        height: '100%',
        zIndex: isMobile ? 50 : 'auto',
        transition: 'left 0.25s ease',
        flexShrink: 0,
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main style={{ 
        flex: 1, 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0,
      }}>
        
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            height: 52,
            background: '#111110',
            borderBottom: '1px solid rgba(240,237,230,0.07)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 12,
            flexShrink: 0,
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#c8c5be',
                cursor: 'pointer',
                fontSize: 20,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              ☰
            </button>
            <span style={{ 
              fontSize: 15, 
              fontWeight: 500, 
              color: '#f0ede6',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
            }}>
              Vartaa
            </span>
          </div>
        )}

        {children}
      </main>
    </div>
  )
}
