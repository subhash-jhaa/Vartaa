'use client'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Doc } from '../../../convex/_generated/dataModel'
import ReactionDisplay from '@/components/features/ReactionPicker'
import LanguageInsight from '@/components/features/LanguageInsight'
import VoicePlayer from './VoicePlayer'
import { Pin, PinOff, Languages, Loader2 } from 'lucide-react'

const LANG_NAMES: Record<string, string> = {
  'hi-IN': 'Hindi',   'bn-IN': 'Bengali',  'te-IN': 'Telugu',
  'mr-IN': 'Marathi', 'ta-IN': 'Tamil',    'gu-IN': 'Gujarati',
  'kn-IN': 'Kannada', 'ml-IN': 'Malayalam','pa-IN': 'Punjabi',
  'en-IN': 'English', 'es-ES': 'Spanish',  'fr-FR': 'French',
  'de-DE': 'German',  'ja-JP': 'Japanese',
}

interface MessageItemProps {
  message: Doc<'messages'>
  isOwn: boolean
  showAvatar: boolean
  userPreferredLang: string
}

export default function MessageItem({ message, isOwn, showAvatar, userPreferredLang }: MessageItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationError, setTranslationError] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const deleteMessage = useMutation(api.messages.deleteMessage)
  const bookmarkMessage = useMutation(api.messages.bookmarkMessage)
  const toggleReaction = useMutation(api.reactions.toggleReaction)
  const pinMessage = useMutation(api.rooms.pinMessage)
  const unpinMessage = useMutation(api.rooms.unpinMessage)
  const requestTranslation = useMutation(api.messages.requestTranslation)
  const sender = useQuery(api.users.getUsersByIds, { userIds: [message.senderId] })
  const senderUser = sender?.[0]

  const translations = message.translations as Record<string, string> | undefined
  const targetLang = userPreferredLang || 'en-IN'
  const translatedText = translations?.[targetLang]

  // Show translation only when user has clicked translate and it is ready
  const displayTranslation = showTranslation && !!translatedText

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })

  const handleTranslate = async () => {
    // If translation already exists in DB, just toggle visibility
    if (translatedText) {
      setShowTranslation(v => !v)
      return
    }

    // Otherwise fetch it on demand
    setIsTranslating(true)
    setTranslationError(false)
    setShowTranslation(true)

    try {
      await requestTranslation({
        messageId: message._id,
        targetLang,
      })
      // Convex real-time will update message.translations automatically
      // No need to do anything here — the component re-renders when DB updates
    } catch (err) {
      console.error("Translation request failed:", err)
      setTranslationError(true)
      setShowTranslation(false)
    } finally {
      setIsTranslating(false)
    }
  }

  const TranslateButton = () => {
    // Do not show on own messages
    if (isOwn) return null
    // Do not show if message is deleted or is a voice message
    if (message.isDeleted || message.type === 'voice') return null
    // Do not show if message is already in user's language
    if (message.originalLang === targetLang) return null

    return (
      <button
        onClick={handleTranslate}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          background: 'none',
          border: '1px solid var(--obsidian-border)',
          borderRadius: 6,
          padding: '3px 8px',
          cursor: isTranslating ? 'default' : 'pointer',
          fontSize: 10,
          color: showTranslation
            ? 'var(--obsidian-primary)'
            : 'var(--obsidian-text-faint)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          transition: 'all 0.2s',
          marginTop: 6,
          opacity: isTranslating ? 0.7 : 1,
        }}
        onMouseEnter={e => {
          if (!isTranslating) e.currentTarget.style.borderColor = 'var(--obsidian-primary)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--obsidian-border)'
        }}
        disabled={isTranslating}
      >
        {isTranslating ? (
          <>
            <Loader2 size={10} style={{ animation: 'spin 0.7s linear infinite' }} />
            <span>Translating...</span>
          </>
        ) : (
          <>
            <Languages size={10} />
            <span>{showTranslation ? 'Hide translation' : 'Translate'}</span>
          </>
        )}
      </button>
    )
  }

  const TranslationBlock = () => {
    if (!displayTranslation) return null

    // Still loading — DB hasn't updated yet after requestTranslation
    if (showTranslation && isTranslating) return null

    // Translation returned empty
    if (translationError) return (
      <p style={{ fontSize: 11, color: '#f87171', marginTop: 6, fontStyle: 'italic' }}>
        Translation failed. Try again.
      </p>
    )

    if (!translatedText) return null

    return (
      <div style={{
        marginTop: 8,
        paddingTop: 8,
        borderTop: '1px solid var(--obsidian-border)',
      }}>
        <p style={{
          fontSize: 13,
          color: 'var(--obsidian-text)',
          lineHeight: 1.6,
          margin: 0,
          wordBreak: 'break-word',
        }}>
          {translatedText}
        </p>
        <span style={{
          display: 'block',
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--obsidian-text-faint)',
          marginTop: 4,
        }}>
          Translated to {LANG_NAMES[targetLang] ?? targetLang}
        </span>
      </div>
    )
  }

  if (isOwn) return (
    <div style={{ display: 'flex', gap: isMobile ? 12 : 56, maxWidth: isMobile ? '85%' : '50%', marginLeft: 'auto', flexDirection: 'row-reverse' }}
      onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div style={{ paddingTop: 4, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--obsidian-primary)', background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-primary-alpha)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>YOU</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20, alignItems: 'flex-end', width: '100%' }}>
        {showAvatar && (
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16 }}>
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
          <div style={{ background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-border)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 2px 16px rgba(0,0,0,0.4)', textAlign: 'left', width: 'fit-content', alignSelf: 'flex-end' }}>
            {/* Own messages: only show your original text, no translation UI */}
            <p style={{
              fontSize: 13,
              color: 'var(--obsidian-text)',
              lineHeight: 1.6,
              margin: 0,
              wordBreak: 'break-word',
              fontFamily: 'Geist, sans-serif',
            }}>
              {message.body}
            </p>
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
    <div style={{ display: 'flex', gap: isMobile ? 12 : 56, maxWidth: isMobile ? '85%' : '50%' }}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20, width: '100%' }}>
        {showAvatar && senderUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700, color: 'var(--obsidian-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? 100 : 'none' }}>{senderUser.name ?? 'Unknown'}</span>
            {message.originalLang && (
              <span style={{ fontSize: 9, color: 'var(--obsidian-text-faint)', letterSpacing: '0.12em' }}>
                {LANG_NAMES[message.originalLang] ?? message.originalLang}
              </span>
            )}
            <span style={{ fontSize: 9, color: 'var(--obsidian-text-faint)', letterSpacing: '0.3em' }}>{formatTime(message.createdAt)}</span>
            {message.isPinned && <Pin size={10} color="var(--obsidian-primary)" strokeWidth={3} style={{ marginBottom: -2 }} />}
          </div>
        )}
        {message.isDeleted ? (
          <span style={{ fontSize: 13, color: 'var(--obsidian-text-faint)', fontStyle: 'italic' }}>This message was deleted</span>
        ) : message.type === 'voice' ? (
          <VoicePlayer message={message} userPreferredLang={userPreferredLang} />
        ) : (
          <div className="message-bubble-group" style={{ background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-border)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 2px 16px rgba(0,0,0,0.4)', width: 'fit-content', position: 'relative' }}>
            {/* Original message text — always shown */}
            <p style={{
              fontSize: 13,
              color: 'var(--obsidian-text)',
              lineHeight: 1.6,
              margin: 0,
              wordBreak: 'break-word',
              fontFamily: 'Geist, sans-serif',
            }}>
              {message.body}
            </p>

            {/* Translation block — only shown after user clicks Translate */}
            <TranslationBlock />

            {/* Translate button — shown on hover via parent showActions state */}
            {showActions && <TranslateButton />}

            {/* Language insight badge */}
            {message.languageInsight && !message.isDeleted && (
              <LanguageInsight insight={message.languageInsight} isOwn={isOwn} />
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
