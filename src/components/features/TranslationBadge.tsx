'use client'
import { Languages, RotateCw } from 'lucide-react'

interface TranslationBadgeProps {
  originalLang: string
  onToggle: () => void
  showingOriginal: boolean
}

export default function TranslationBadge({ originalLang, onToggle, showingOriginal }: TranslationBadgeProps) {
  const langNames: Record<string, string> = {
    'hi-IN': 'Hindi', 'bn-IN': 'Bengali', 'te-IN': 'Telugu',
    'mr-IN': 'Marathi', 'ta-IN': 'Tamil', 'gu-IN': 'Gujarati',
    'kn-IN': 'Kannada', 'ml-IN': 'Malayalam', 'pa-IN': 'Punjabi',
    'en-IN': 'English', 'es-ES': 'Spanish', 'fr-FR': 'French',
    'de-DE': 'German', 'ja-JP': 'Japanese',
  }

  return (
    <button
      onClick={onToggle}
      style={{ fontSize: 11, color: 'var(--obsidian-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, transition: 'color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--obsidian-primary)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--obsidian-text-muted)'}
    >
      <Languages size={12} strokeWidth={2} />
      <span>
        {showingOriginal
          ? 'Show translation'
          : `Translated from ${langNames[originalLang] ?? originalLang} · Show original`
        }
      </span>
      <RotateCw size={10} style={{ opacity: 0.5, marginLeft: 2 }} />
    </button>
  )
}
