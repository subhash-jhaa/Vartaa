'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LogOut, Loader2, ChevronLeft } from 'lucide-react'
import { INDIAN_LANGUAGES, FOREIGN_LANGUAGES } from '@/lib/languages'

export default function SettingsPage() {
  const user = useQuery(api.users.getMe)
  const updateName = useMutation(api.users.updateName)
  const updateLang = useMutation(api.users.updatePreferredLang)
  const { signOut } = useAuthActions()
  const router = useRouter()

  const [name, setName] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [langSaved, setLangSaved] = useState(false)
  const [cols, setCols] = useState(5)

  const isDirty = name !== user?.name && name.trim() !== ''

  useEffect(() => {
    if (user?.name) setName(user.name)
  }, [user?.name])

  useEffect(() => {
    const update = () => {
      setCols(window.innerWidth < 640 ? 2 
             : window.innerWidth < 900 ? 3 
             : 5)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#080808]">
        <Loader2 className="animate-spin" size={24} color="#c9a84c" />
      </div>
    )
  }

  const handleUpdateName = async () => {
    if (!isDirty) return
    setIsSaving(true)
    try {
      await updateName({ name: name.trim() })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateLang = async (langCode: string) => {
    if (langCode === user.preferredLang) return
    try {
      await updateLang({ lang: langCode })
      setLangSaved(true)
      setTimeout(() => setLangSaved(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  const LanguageCard = ({ lang }: { lang: any }) => {
    const isSelected = user.preferredLang === lang.code
    return (
      <div 
        onClick={() => handleUpdateLang(lang.code)}
        className={`
          relative p-[10px_12px] rounded-[8px] cursor-pointer transition-all duration-150 min-w-0 border
          ${isSelected 
            ? 'bg-[#111] border-2 border-[#c9a84c] shadow-[0_0_12px_rgba(201,168,76,0.1)]' 
            : 'bg-[#111] border-[#222] hover:bg-[#161616] hover:border-[#2a2a2a]'
          }
        `}
      >
        <p className={`text-[13px] font-medium mb-[2px] truncate transition-colors ${isSelected ? 'text-[#e8e8e8]' : 'text-[#d8d8d8]'}`}>
          {lang.label}
        </p>
        <p className={`text-[11px] truncate transition-colors ${isSelected ? 'text-[#c9a84c]' : 'text-[#555]'}`}>
          {lang.native}
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#080808] overflow-y-auto selection:bg-[#c9a84c]/30">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <button 
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: 'none',
            padding: '0',
            color: '#555',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: '40px',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
          onMouseLeave={e => e.currentTarget.style.color = '#555'}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          <span>BACK</span>
        </button>

        <header className="mb-10">
          <h1 className="text-[28px] font-semibold tracking-tight text-[#e8e8e8] mb-1">Settings</h1>
          <p className="text-[13px] text-[#555]">Manage your account and preferences</p>
        </header>

        {/* PROFILE SECTION */}
        <section className="mb-12 border-b border-[#141414] pb-12">
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#444] mb-8">
            Profile
          </h2>
          
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#1a1a1a',
              border: '1px solid #252525',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 600,
              color: '#c9a84c',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() ?? '?'
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#e8e8e8' }}>{user.name}</span>
              <span style={{ fontSize: 12, color: '#555', fontFamily: 'monospace' }}>{user.email}</span>
            </div>
          </div>

          <div style={{ marginBottom: 16, marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <label style={{
                fontSize: 10,
                fontFamily: 'monospace',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#444',
                margin: 0
              }}>
                Display Name
              </label>
            </div>

            <div style={{ maxWidth: 400, display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                style={{
                  width: '100%',
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  borderRadius: 7,
                  padding: '9px 12px',
                  fontSize: 13,
                  color: '#e8e8e8',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#333'}
                onBlur={e => e.currentTarget.style.borderColor = '#1e1e1e'}
              />
              <button
                onClick={async () => {
                  await signOut();
                  router.push('/');
                }}
                style={{
                  background: 'rgba(248,113,113,0.05)',
                  border: '1px solid rgba(248,113,113,0.1)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#f87171',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(248,113,113,0.12)'
                  e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(248,113,113,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(248,113,113,0.1)'
                }}
              >
                <LogOut size={12} strokeWidth={2.5} />
                <span>Logout</span>
              </button>
            </div>

            <div style={{ maxWidth: 400, marginTop: 12 }}>
              {isDirty && (
                <button
                  onClick={handleUpdateName}
                  disabled={isSaving}
                  style={{
                    padding: '7px 24px',
                    background: '#c9a84c',
                    color: '#000',
                    border: 'none',
                    borderRadius: 7,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              )}
              {saveSuccess && (
                <div style={{ fontSize: 11, color: '#22c55e', marginTop: 8, fontFamily: 'monospace' }}>
                  Updated successfully
                </div>
              )}
            </div>
          </div>
        </section>

        {/* LANGUAGE SECTION */}
        <section className="mb-12">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="font-mono text-[13px] tracking-[0.15em] uppercase text-[#444]">
              Preferred Language
            </h2>
            {langSaved && (
              <span className="text-[11px] text-[#22c55e] font-mono animate-pulse">Saved</span>
            )}
          </div>
          
          <div className="mb-8">
            <h3 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#444] mb-[12px] mt-[24px]">
              INDIC LANGUAGES
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap: '8px',
              width: '100%',
            }}>
              {INDIAN_LANGUAGES.map((lang) => (
                <LanguageCard key={lang.code} lang={lang} />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#444] mb-[12px] mt-[24px]">
              FOREIGN LANGUAGES
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap: '8px',
              width: '100%',
            }}>
              {FOREIGN_LANGUAGES.map((lang) => (
                <LanguageCard key={lang.code} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
