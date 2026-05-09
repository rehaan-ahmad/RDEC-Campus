'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, googleProvider, hasFirebaseClientConfig } from '@/lib/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useAuthStore } from '@/store/authStore'
import { GlassCard } from '@/components/ui/GlassCard'

export default function LoginPage() {
  const router = useRouter()
  const { setFirebaseUser, setDbUser, firebaseUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If already logged in, redirect to home
    if (firebaseUser) {
      router.push('/')
    }
  }, [firebaseUser, router])

  const handleGoogleSignIn = async () => {
    if (!hasFirebaseClientConfig) {
      setError("Firebase is not configured. Please add your credentials to .env.local.")
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const result = await signInWithPopup(auth!, googleProvider)
      const user = result.user
      
      const idToken = await user.getIdToken()
      
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!res.ok) {
        throw new Error('Failed to verify authentication with server')
      }
      
      const data = await res.json()
      
      setFirebaseUser(user)
      setDbUser(data.user)
      
      if (data.isNewUser) {
        router.push('/register')
      } else {
        router.push('/')
      }
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block text-2xl font-display font-bold text-white mb-2">
          <span className="text-blue">RDEC</span> Campus
        </Link>
        <p className="text-muted text-sm">Sign in to access your student dashboard</p>
      </div>

      <GlassCard className="p-8" glow="blue">
        <h1 className="text-2xl font-bold font-display text-white mb-6 text-center">Welcome Back</h1>
        
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-orange/10 border border-orange/20 text-orange text-sm">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3 px-4 rounded-[var(--r-button)] hover:bg-white/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <p className="mt-6 text-center text-xs text-muted">
          By signing in, you agree to RDEC's Terms of Service and Privacy Policy. Only @rdec.ac.in emails or approved accounts are permitted.
        </p>
      </GlassCard>
    </div>
  )
}
