'use client'

import { useMutation, useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, Loader2 } from 'lucide-react'
import { INDIAN_LANGUAGES, FOREIGN_LANGUAGES } from '@/lib/languages'

export default function OnboardingPage() {
  const user = useQuery(api.users.getMe)
  const updateLang = useMutation(api.users.updatePreferredLang)
  const router = useRouter()
  const [selectedLang, setSelectedLang] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContinue = async () => {
    if (!selectedLang) return
    setIsSubmitting(true)
    try {
      await updateLang({ lang: selectedLang })
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
    }
  }

  if (!user) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#c9a84c]" size={24} />
    </div>
  )

  const LanguageCard = ({ lang }: { lang: any }) => {
    const isSelected = selectedLang === lang.code
    return (
      <div 
        onClick={() => setSelectedLang(lang.code)}
        className={`
          relative p-[14px_16px] rounded-[10px] cursor-pointer transition-all duration-150 min-w-0 border
          ${isSelected 
            ? 'bg-[#111] border-2 border-[#c9a84c] shadow-[0_0_12px_rgba(201,168,76,0.1)]' 
            : 'bg-[#111] border-[#222] hover:bg-[#161616] hover:border-[#2a2a2a]'
          }
        `}
      >
        <p className={`text-[14px] font-semibold mb-0.5 truncate transition-colors ${isSelected ? 'text-[#e8e8e8]' : 'text-[#d8d8d8]'}`}>
          {lang.label}
        </p>
        <p className={`text-[12px] truncate transition-colors ${isSelected ? 'text-[#c9a84c]' : 'text-[#555]'}`}>
          {lang.native}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#e8e8e8] selection:bg-[#c9a84c]/30">
      <div className="max-w-[1000px] mx-auto px-6 py-16 md:py-24">
        <header className="mb-12">
          <div className="inline-block px-2 py-1 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded text-[#c9a84c] text-[10px] font-mono uppercase tracking-[0.2em] mb-6">
            Welcome to Vartaa
          </div>
          <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight mb-4">
            Select your preferred language
          </h1>
          <p className="text-[14px] text-[#555] max-w-[500px] leading-relaxed">
            Choose the language you'd like to read and write in. Vartaa will automatically translate all incoming messages for you.
          </p>
        </header>

        <section className="space-y-12">
          <div>
            <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#444] mb-6 pb-2 border-b border-[#141414]">
              INDIC LANGUAGES
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {INDIAN_LANGUAGES.map((lang) => (
                <LanguageCard key={lang.code} lang={lang} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#444] mb-6 pb-2 border-b border-[#141414]">
              FOREIGN LANGUAGES
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {FOREIGN_LANGUAGES.map((lang) => (
                <LanguageCard key={lang.code} lang={lang} />
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-20 flex items-center justify-between pt-8 border-t border-[#141414]">
          <p className="text-[12px] text-[#333] font-mono">
            {selectedLang ? `SELECTED: ${selectedLang.toUpperCase()}` : 'SELECT A LANGUAGE TO CONTINUE'}
          </p>
          <button
            onClick={handleContinue}
            disabled={!selectedLang || isSubmitting}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-full text-[14px] font-semibold transition-all duration-200
              ${selectedLang 
                ? 'bg-[#c9a84c] text-black hover:bg-[#d4b463] transform hover:translate-x-1' 
                : 'bg-[#1a1a1a] text-[#444] cursor-not-allowed'}
            `}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Continue <ChevronRight size={18} />
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  )
}
