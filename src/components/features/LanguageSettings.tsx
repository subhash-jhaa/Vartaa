'use client'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Check } from 'lucide-react'

const LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi', native: 'हिंदी' },
  { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { code: 'bn-IN', label: 'Bengali', native: 'বাংলা' },
  { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr-IN', label: 'Marathi', native: 'मराठी' },
  { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa-IN', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur-IN', label: 'Urdu', native: 'اردو' },
  { code: 'or-IN', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as-IN', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'mai-IN', label: 'Maithili', native: 'मैथिली' },
  { code: 'sa-IN', label: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'doi-IN', label: 'Dogri', native: 'डोगरी' },
  { code: 'kok-IN', label: 'Konkani', native: 'कोंकणी' },
  { code: 'ne-IN', label: 'Nepali', native: 'नेपाली' },
  { code: 'brx-IN', label: 'Bodo', native: 'ಬಡೋ' },
  { code: 'mni-IN', label: 'Manipuri', native: 'ಮೈತೈಲೋನ್' },
  { code: 'sd-IN', label: 'Sindhi', native: 'سنڌي' },
  { code: 'ks-IN', label: 'Kashmiri', native: 'कॉशुर' },
  { code: 'sat-IN', label: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'en-IN', label: 'English', native: 'English' },
]

export default function LanguageSettings({ onClose }: { onClose?: () => void }) {
  const { user } = useCurrentUser()
  const updatePreferredLang = useMutation(api.users.updatePreferredLang)
  const [selected, setSelected] = useState(user?.preferredLang ?? 'en-IN')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSelect = async (code: string) => {
    setSelected(code)
    setSaving(true)
    setSaved(false)
    try {
      await updatePreferredLang({ lang: code })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      background: 'var(--obsidian-bg)',
      border: '1px solid var(--obsidian-border)',
      borderRadius: 16,
      overflow: 'hidden',
      width: '100%',
      maxWidth: 480,
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--color-white-border-soft)',
        background: 'var(--color-surface-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)', margin: 0 }}>
            Preferred Language
          </h3>
          <p style={{ fontSize: 11, color: 'var(--color-ui-muted)', margin: '4px 0 0', letterSpacing: '0.05em' }}>
            All messages will be translated to this language
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {saved && (
            <span style={{ fontSize: 11, color: 'var(--color-online)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Check size={12} /> Saved
            </span>
          )}
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ui-muted)', fontSize: 18, lineHeight: 1 }}>✕</button>
          )}
        </div>
      </div>

      {/* Current selection banner */}
      <div style={{ padding: '12px 24px', background: 'var(--color-accent-a-alpha-low)', borderBottom: '1px solid var(--color-white-border-soft)' }}>
        <span style={{ fontSize: 11, color: 'var(--color-ui-muted)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Currently set to: </span>
        <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
          {LANGUAGES.find(l => l.code === selected)?.native} · {LANGUAGES.find(l => l.code === selected)?.label}
        </span>
      </div>

      {/* Language grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
        background: 'var(--color-white-border-faint)',
        maxHeight: 360,
        overflowY: 'auto',
      }}>
        {LANGUAGES.map(lang => {
          const isSelected = selected === lang.code
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              disabled={saving}
              style={{
                background: isSelected ? 'var(--color-accent-a-alpha-low)' : 'var(--obsidian-bg)',
                border: 'none',
                padding: '14px 16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 4,
                transition: 'background 0.15s',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--color-white-border-soft)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'var(--obsidian-bg)' }}
            >
              {isSelected && (
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Check size={10} color="var(--accent)" />
                </div>
              )}
              <span style={{ fontSize: 16, color: isSelected ? 'var(--accent)' : 'var(--muted)', fontFamily: 'sans-serif' }}>
                {lang.native}
              </span>
              <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: isSelected ? 'var(--color-accent-a-half)' : 'var(--color-ui-faint)' }}>
                {lang.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
