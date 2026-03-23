'use client'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Doc } from '../../../convex/_generated/dataModel'
import { useState, useRef } from 'react'

interface VoicePlayerProps {
  message: Doc<'messages'>
  userPreferredLang: string
}

export default function VoicePlayer({ message, userPreferredLang }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const audioUrl = useQuery(
    api.messages.getAudioUrl,
    message.audioStorageId ? { storageId: message.audioStorageId } : 'skip'
  )

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(console.error)
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const duration = message.audioDuration ?? 0
  const translations = message.translations as Record<string, string> | undefined
  const displayTranscript = translations?.[userPreferredLang] ?? message.transcript

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200, maxWidth: 280 }}>
      
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => { setIsPlaying(false); setProgress(0); setCurrentTime(0) }}
          onTimeUpdate={(e) => {
            const a = e.currentTarget
            setCurrentTime(a.currentTime)
            if (a.duration > 0) setProgress((a.currentTime / a.duration) * 100)
          }}
          style={{ display: 'none' }}
        />
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(240,237,230,0.05)',
        border: '1px solid rgba(240,237,230,0.1)',
        borderRadius: 10, padding: '8px 12px',
      }}>
        <button
          onClick={togglePlay}
          disabled={!audioUrl}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: audioUrl ? '#d4a843' : 'rgba(240,237,230,0.1)',
            border: 'none', cursor: audioUrl ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 12, color: '#0c0c0b',
          }}
        >
          {!audioUrl ? '...' : isPlaying ? '⏸' : '▶'}
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 3, background: 'rgba(240,237,230,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#d4a843', borderRadius: 2, transition: 'width 0.1s linear' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b6960' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <span style={{ fontSize: 14, opacity: 0.5 }}>🎤</span>
      </div>

      {displayTranscript && (
        <p style={{ fontSize: 12, color: '#6b6960', fontStyle: 'italic', margin: 0, paddingLeft: 4 }}>
          "{displayTranscript}"
        </p>
      )}
    </div>
  )
}
