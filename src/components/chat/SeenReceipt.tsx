'use client'

import Image from 'next/image'

interface SeenReceiptProps {
  otherUser: {
    name: string
    avatarUrl: string | null
  }
  lastReadAt: number
}

export default function SeenReceipt({ otherUser, lastReadAt }: SeenReceiptProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
        justifyContent: 'flex-end',
        fontSize: 9,
        color: 'var(--obsidian-text-faint)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: '1px solid var(--obsidian-border)',
          opacity: 0.6,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--obsidian-bg)',
          position: 'relative',
        }}
      >
        {otherUser.avatarUrl ? (
          <Image
            src={otherUser.avatarUrl}
            alt={otherUser.name}
            fill
            sizes="14px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: 8 }}>{otherUser.name[0]?.toUpperCase()}</span>
        )}
      </div>
      <span>Seen {formatTime(lastReadAt)}</span>
    </div>
  )
}
