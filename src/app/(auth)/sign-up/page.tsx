'use client'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth } from 'convex/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import VartaaLogo from '@/components/VartaaLogo'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function SignUpPage() {
  const { signIn } = useAuthActions()
  const { isMobile } = useIsMobile()
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isAuthLoading, router])

  if (isAuthLoading) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signIn('password', { name, email, password, flow: 'signUp' })
      // Redirection handled by useEffect
    } catch (err: any) {
      setError(err.message ?? 'Registration failed')
      setLoading(false)
    }
  }

  const handleGoogle = () => signIn('google')

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(240,237,230,0.03)',
    border: '1px solid rgba(240,237,230,0.08)',
    borderRadius: '10px',
    padding: '14px',
    color: '#f0ede6',
    fontSize: '16px', // Prevents iOS zoom
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0c0c0b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px 16px' : '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '52px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          <VartaaLogo size={isMobile ? 36 : 42} showText={true} textSize={isMobile ? 18 : 22} />
        </Link>
        <div style={{ width: '32px', height: '1px', background: '#d4a843', margin: '14px auto 0', opacity: 0.4 }} />
      </div>

      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: isMobile ? '20px' : '22px', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#f0ede6', marginBottom: 6 }}>Create account</h2>
          <p style={{ fontSize: '13px', color: 'rgba(240,237,230,0.35)' }}>Start speaking every language</p>
        </div>

        <div style={{ height: 1, background: 'rgba(240,237,230,0.06)', marginBottom: 24 }} />

        <button onClick={handleGoogle} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'rgba(240,237,230,0.04)', border: '1px solid rgba(240,237,230,0.1)', borderRadius: '10px', padding: '13px 16px', color: '#c8c5be', fontSize: '14px', cursor: 'pointer', marginBottom: 20 }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.24h2.91c1.71-1.57 2.69-3.88 2.69-6.6z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.24c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.95v2.3A9 9 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.96 10.73A5.4 5.4 0 0 1 3.65 9c0-.6.11-1.18.31-1.73V4.97H.95A9.01 9.01 0 0 0 0 9c0 1.5.38 2.91 1.05 4.16l2.91-2.43z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.98 8.98 0 0 0 9 0C5.5 0 2.45 1.99.95 4.97l3.01 2.3A5.44 5.44 0 0 1 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(240,237,230,0.06)' }} />
          <span style={{ fontSize: '11px', letterSpacing: '1px', color: 'rgba(240,237,230,0.2)' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(240,237,230,0.06)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,168,67,0.45)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(240,237,230,0.08)'} />
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,168,67,0.45)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(240,237,230,0.08)'} />
          <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,168,67,0.45)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(240,237,230,0.08)'} />
          {error && <p style={{ color: '#f87171', fontSize: '12px', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: '#d4a843', color: '#0c0c0b', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <Link href="/sign-in" style={{ color: '#d4a843', fontSize: '13px', textDecoration: 'none' }}>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
