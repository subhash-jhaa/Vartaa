'use client'

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
      style={{ fontSize: 11, color: '#6b6960', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}
    >
      <span style={{ opacity: 0.6 }}>⟳</span>
      {showingOriginal
        ? 'Show translation'
        : `Translated from ${langNames[originalLang] ?? originalLang} · Show original`
      }
    </button>
  )
}
