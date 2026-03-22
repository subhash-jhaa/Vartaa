'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { SquarePen, Search, X, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface NewDMButtonProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function NewDMButton({ isOpen, setIsOpen }: NewDMButtonProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const users = useQuery(api.users.getAllUsers) || []
  const getOrCreateDM = useMutation(api.rooms.getOrCreateDM)

  const filteredUsers = users.filter((u: any) => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreateDM = async (userId: string) => {
    try {
      const roomId = await getOrCreateDM({ otherUserId: userId as any })
      setIsOpen(false)
      router.push(`/chat/${roomId}`)
    } catch (err) {
      console.error('Failed to start DM:', err)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#080808',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ width: '100%', padding: '10px 10px 6px', display: 'flex', alignItems: 'center', gap: '12px', boxSizing: 'border-box' }}>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--obsidian-text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--obsidian-text)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--obsidian-text-muted)')}
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
      </div>

      {/* Search */}
      <div style={{ width: '100%', padding: '0 8px 16px', display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(240,237,230,0.03)',
          border: '1px solid rgba(240,237,230,0.07)',
          borderRadius: '7px',
          padding: '6px 10px',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
        }}>
          <Search size={12} style={{ color: 'var(--obsidian-text-muted)' }} />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--obsidian-text)',
              fontSize: '11px',
              outline: 'none',
              flex: 1,
              fontFamily: 'Geist, sans-serif',
              width: '100%',
              minWidth: 0,
              boxSizing: 'border-box',
            }}
          />
          {search && (
            <X 
              size={12} 
              onClick={() => setSearch('')}
              style={{ color: 'var(--obsidian-text-muted)', cursor: 'pointer' }}
            />
          )}
        </div>
      </div>

      {/* User List */}
      <div style={{ flex: 1, padding: '0 14px', overflowY: 'auto' }}>
        {!users || filteredUsers.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--obsidian-text-muted)', fontSize: '11px' }}>
            No users found
          </div>
        ) : (
          filteredUsers.map((u: any) => (
            <div
              key={u._id}
              onClick={() => handleCreateDM(u._id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#111')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {u.image ? (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                    <Image src={u.image} alt={u.name} fill sizes="28px" style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ 
                    width: 28, height: 28, borderRadius: '50%', 
                    background: 'var(--obsidian-surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: 'var(--obsidian-text)', fontWeight: 'bold'
                  }}>
                    {u.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                {u.presence === 'online' && (
                  <div style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '1.5px solid #080808'
                  }} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                <span style={{ fontSize: '12px', color: 'var(--obsidian-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {u.name}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--obsidian-text-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {u.email}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
