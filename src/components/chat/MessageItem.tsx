'use client'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Doc, Id } from '@convex/_generated/dataModel'
import { Avatar } from '@/components/ui/Avatar'
import { formatDistanceToNow } from 'date-fns'
import VoicePlayer from './VoicePlayer'
import ReactionDisplay from '@/components/features/ReactionPicker'
import TranslationBadge from '@/components/features/TranslationBadge'
import { useCurrentUser } from '@/hooks/useCurrentUser'

interface MessageItemProps {
  message: Doc<'messages'>
  sender: { 
    _id: Id<'users'>;
    name?: string;
    avatarUrl?: string;
    image?: string; 
  } | null
  isOwn: boolean
  showAvatar: boolean
  userPreferredLang: string
}

export default function MessageItem({ message, sender, isOwn, showAvatar, userPreferredLang }: MessageItemProps) {
  const { isAuthenticated } = useCurrentUser()
  const [showOriginal, setShowOriginal] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const deleteMessage = useMutation(api.messages.deleteMessage)
  const bookmarkMessage = useMutation(api.messages.bookmarkMessage)
  const toggleReaction = useMutation(api.reactions.toggleReaction)

  const translations = message.translations as Record<string, string> | undefined
  const translatedText = translations?.[userPreferredLang]
  const hasTranslation = !!translatedText && message.originalLang !== userPreferredLang
  const displayText = showOriginal ? message.body : (translatedText ?? message.body)

  return (
    <div
      style={{ padding: '2px 20px', display: 'flex', gap: 10, alignItems: 'flex-start' }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar or spacer */}
      <div style={{ width: 36, flexShrink: 0 }}>
        {showAvatar && sender && (
          <Avatar name={sender.name || "Unknown"} imageUrl={sender.avatarUrl || sender.image} size={32} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Sender + time header */}
        {showAvatar && sender && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: isOwn ? '#c8c5be' : '#f0ede6' }}>
              {sender.name}
            </span>
            <span style={{ fontSize: 10, color: '#6b6960' }}>
              {formatDistanceToNow(message.createdAt, { addSuffix: true })}
            </span>
            {message.isEdited && <span style={{ fontSize: 10, color: '#6b6960', fontStyle: 'italic' }}>(edited)</span>}
          </div>
        )}

        {/* Message content */}
        {message.isDeleted ? (
          <span style={{ fontSize: 13, color: '#6b6960', fontStyle: 'italic' }}>This message was deleted</span>
        ) : message.type === 'voice' ? (
          <VoicePlayer message={message} userPreferredLang={userPreferredLang} />
        ) : (
          <div>
            <p style={{ fontSize: 14, color: '#c8c5be', lineHeight: 1.55, margin: 0, wordBreak: 'break-word' }}>
              {displayText}
            </p>
            {hasTranslation && (
              <TranslationBadge
                originalLang={message.originalLang ?? 'unknown'}
                showingOriginal={showOriginal}
                onToggle={() => setShowOriginal((v) => !v)}
              />
            )}
          </div>
        )}

        {/* Reactions */}
        <ReactionDisplay messageId={message._id} />
      </div>

      {/* Hover action bar */}
      {showActions && !message.isDeleted && (
        <div style={{ display: 'flex', gap: 4, background: '#1a1a18', border: '1px solid rgba(240,237,230,0.1)', borderRadius: 7, padding: '4px 6px', flexShrink: 0 }}>
          {['👍', '❤️', '😂', '🙏'].map(emoji => (
            <button
              key={emoji}
              onClick={() => isAuthenticated && toggleReaction({ messageId: message._id, emoji }).catch(console.error)}
              style={{ fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 4 }}
            >
              {emoji}
            </button>
          ))}
          <span style={{ width: 1, background: 'rgba(240,237,230,0.1)', margin: '0 2px' }} />
          {isOwn && (
            <button
              onClick={() => isAuthenticated && deleteMessage({ messageId: message._id }).catch(console.error)}
              style={{ fontSize: 11, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
            >
              Delete
            </button>
          )}
          <button
            onClick={() => isAuthenticated && bookmarkMessage({ messageId: message._id }).catch(console.error)}
            style={{ fontSize: 11, color: '#6b6960', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}
