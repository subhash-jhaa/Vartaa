'use client'
import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Doc } from '@convex/_generated/dataModel'
import TranslationBadge from '@/components/features/TranslationBadge'
import ReactionDisplay from '@/components/features/ReactionPicker'
import VoicePlayer from './VoicePlayer'
import { Pin, PinOff } from 'lucide-react'

interface MessageItemProps {
  message: Doc<'messages'>
  isOwn: boolean
  showAvatar: boolean
  userPreferredLang: string
}

export default function MessageItem({ message, isOwn, showAvatar, userPreferredLang }: MessageItemProps) {
  const [showOriginal, setShowOriginal] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const deleteMessage = useMutation(api.messages.deleteMessage)
  const bookmarkMessage = useMutation(api.messages.bookmarkMessage)
  const toggleReaction = useMutation(api.reactions.toggleReaction)
  const pinMessage = useMutation(api.rooms.pinMessage)
  const unpinMessage = useMutation(api.rooms.unpinMessage)
  const sender = useQuery(api.users.getUsersByIds, { userIds: [message.senderId] })
  const senderUser = sender?.[0]

  const translations = message.translations as Record<string, string> | undefined
  const translatedText = translations?.[userPreferredLang]
  const hasTranslation = !!translatedText && message.originalLang !== userPreferredLang
  const displayText = showOriginal ? message.body : (translatedText ?? message.body)
  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })

  if (isOwn) return (
    <div style={{ display: 'flex', gap: 56, maxWidth: '50%', marginLeft: 'auto', flexDirection: 'row-reverse' }}
      onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div style={{ paddingTop: 4, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--obsidian-primary)', background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-primary-alpha)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>YOU</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-end' }}>
        {showAvatar && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {message.isPinned && <Pin size={10} color="var(--obsidian-primary)" strokeWidth={3} style={{ marginBottom: -2 }} />}
            <span style={{ fontSize: 9, color: 'var(--obsidian-text-faint)', letterSpacing: '0.3em' }}>{formatTime(message.createdAt)}</span>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700, color: 'var(--obsidian-primary)', opacity: 0.8 }}>Self</span>
          </div>
        )}
        {message.isDeleted ? (
          <span style={{ fontSize: 13, color: 'var(--obsidian-text-faint)', fontStyle: 'italic' }}>This message was deleted</span>
        ) : message.type === 'voice' ? (
          <VoicePlayer message={message} userPreferredLang={userPreferredLang} />
        ) : (
          <div style={{ background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-border)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 2px 16px rgba(0,0,0,0.4)', textAlign: 'left', maxWidth: 400 }}>
            <p style={{ fontSize: 14, color: 'var(--obsidian-text)', lineHeight: 1.6, margin: 0, wordBreak: 'break-word', fontFamily: 'Geist, sans-serif' }}>{displayText}</p>
            {hasTranslation && (
              <div style={{ paddingRight: 24, borderRight: '1px solid var(--obsidian-primary-alpha)', marginTop: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--obsidian-text-faint)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>{showOriginal ? message.body : translatedText}</p>
                <TranslationBadge originalLang={message.originalLang ?? ''} showingOriginal={showOriginal} onToggle={() => setShowOriginal(v => !v)} />
              </div>
            )}
          </div>
        )}
        <ReactionDisplay messageId={message._id} />
        {showActions && !message.isDeleted && (
          <div style={{ display: 'flex', gap: 16 }}>
            {['👍','❤️','😂','🙏'].map(emoji => (
              <button key={emoji} onClick={() => toggleReaction({ messageId: message._id, emoji }).catch(console.error)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, opacity: 0.4, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}>{emoji}</button>
            ))}
            <button onClick={() => {
              if (message.isPinned) unpinMessage({ roomId: message.roomId, messageId: message._id })
              else pinMessage({ roomId: message.roomId, messageId: message._id })
            }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: message.isPinned ? 'var(--obsidian-primary)' : 'var(--obsidian-text-faint)', transition: 'color 0.2s' }}>
              {message.isPinned ? 'Unpin' : 'Pin'}
            </button>
            <button onClick={() => deleteMessage({ messageId: message._id }).catch(console.error)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--obsidian-text-faint)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--obsidian-text-faint)'}>Delete</button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 56, maxWidth: '50%' }}
      onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div style={{ paddingTop: 4, flexShrink: 0 }}>
        {showAvatar && senderUser ? (
          senderUser.image ? (
            <img src={senderUser.image} alt={senderUser.name ?? '?'}
              style={{ width: 36, height: 36, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.04)', padding: 2, filter: 'grayscale(0.4)', opacity: 0.4, transition: 'all 0.7s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'grayscale(0)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.filter = 'grayscale(0.4)' }}
            />
          ) : (
            <div style={{ width: 36, height: 36, background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#525252' }}>
              {(senderUser.name ?? '?')[0].toUpperCase()}
            </div>
          )
        ) : <div style={{ width: 36 }} />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {showAvatar && senderUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700, color: 'var(--obsidian-text-muted)' }}>{senderUser.name ?? 'Unknown'}</span>
            <span style={{ fontSize: 9, color: 'var(--obsidian-text-faint)', letterSpacing: '0.3em' }}>{formatTime(message.createdAt)}</span>
            {message.isPinned && <Pin size={10} color="var(--obsidian-primary)" strokeWidth={3} style={{ marginBottom: -2 }} />}
          </div>
        )}
        {message.isDeleted ? (
          <span style={{ fontSize: 13, color: 'var(--obsidian-text-faint)', fontStyle: 'italic' }}>This message was deleted</span>
        ) : message.type === 'voice' ? (
          <VoicePlayer message={message} userPreferredLang={userPreferredLang} />
        ) : (
          <div className="message-bubble-group" style={{ background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-border)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 2px 16px rgba(0,0,0,0.4)', maxWidth: 400, position: 'relative' }}>
            <p style={{ fontSize: 14, color: 'var(--obsidian-text)', lineHeight: 1.6, margin: 0, wordBreak: 'break-word', fontFamily: 'Geist, sans-serif' }}>{displayText}</p>
            {hasTranslation && (
              <div style={{ paddingLeft: 24, borderLeft: '1px solid var(--obsidian-border)', marginTop: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--obsidian-text-muted)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>{showOriginal ? message.body : translatedText}</p>
                <TranslationBadge originalLang={message.originalLang ?? ''} showingOriginal={showOriginal} onToggle={() => setShowOriginal(v => !v)} />
              </div>
            )}
            {message.languageInsight && !message.isDeleted && (
              <LanguageInsight
                insight={message.languageInsight}
                isOwn={isOwn}
              />
            )}
          </div>
        )}
        <ReactionDisplay messageId={message._id} />
        {showActions && !message.isDeleted && (
          <div style={{ display: 'flex', gap: 16, marginTop: -8 }}>
            {['👍','❤️','😂','🙏'].map(emoji => (
              <button key={emoji} onClick={() => toggleReaction({ messageId: message._id, emoji }).catch(console.error)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, opacity: 0.4, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}>{emoji}</button>
            ))}
            <button onClick={() => {
              if (message.isPinned) unpinMessage({ roomId: message.roomId, messageId: message._id })
              else pinMessage({ roomId: message.roomId, messageId: message._id })
            }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: message.isPinned ? 'var(--obsidian-primary)' : 'var(--obsidian-text-faint)', transition: 'color 0.2s' }}>
              {message.isPinned ? 'Unpin' : 'Pin'}
            </button>
            <button onClick={() => bookmarkMessage({ messageId: message._id }).catch(console.error)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--obsidian-text-faint)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--obsidian-text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--obsidian-text-faint)'}>Save</button>
            <button onClick={() => deleteMessage({ messageId: message._id }).catch(console.error)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--obsidian-text-faint)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--obsidian-text-faint)'}>Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}
