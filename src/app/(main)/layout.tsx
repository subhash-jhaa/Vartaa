'use client'
import { ReactNode, useState, useEffect } from 'react'
import RailNav from '@/components/layout/RailNav'
import ChannelList from '@/components/layout/ChannelList'
import { Menu, X } from 'lucide-react'

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--obsidian-bg)', overflow: 'hidden', color: 'var(--obsidian-text)', fontFamily: 'Geist, sans-serif' }}>
      {/* Desktop Sidebars */}
      {!isMobile && (
        <>
          <RailNav />
          <ChannelList />
        </>
      )}

      {/* Mobile Drawer */}
      {isMobile && isDrawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsDrawerOpen(false)} />
          {/* Sidebars */}
          <div style={{ position: 'relative', display: 'flex', height: '100%', boxShadow: '10px 0 30px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <RailNav />
              <ChannelList />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Toggle */}
      {isMobile && !isDrawerOpen && (
        <button onClick={() => setIsDrawerOpen(true)}
          style={{ position: 'fixed', top: 32, left: 24, zIndex: 90, background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-border)', color: 'var(--obsidian-primary)', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', cursor: 'pointer', transition: 'transform 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <Menu size={20} />
        </button>
      )}

      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {children}
      </main>
    </div>
  )
}
