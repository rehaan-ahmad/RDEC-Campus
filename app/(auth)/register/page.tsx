'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { GlassCard } from '@/components/ui/GlassCard'

export default function RegisterPage() {
  const router = useRouter()
  const { dbUser, firebaseUser, setDbUser } = useAuthStore()
  
  const [enrollment, setEnrollment] = useState('')
  const [branch, setBranch] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firebaseUser) {
      router.push('/login')
    } else if (dbUser?.enrollment_no && dbUser?.branch) {
      router.push('/')
    }
  }, [firebaseUser, dbUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!enrollment || !branch || !year) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const idToken = await firebaseUser?.getIdToken()
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enrollment_no: enrollment, branch, batch_year: parseInt(year) })
      })
      
      if (!res.ok) {
        throw new Error('Failed to update profile')
      }
      
      const data = await res.json()
      setDbUser(data.user)
      router.push('/')
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  if (!firebaseUser || (dbUser && dbUser.enrollment_no)) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <GlassCard className="p-8" glow="teal">
        <h1 className="text-2xl font-bold font-display text-white mb-2 text-center">Complete Profile</h1>
        <p className="text-muted text-sm text-center mb-6">We need a few more details to set up your account.</p>
        
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-orange/10 border border-orange/20 text-orange text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted font-heading mb-1.5">Enrollment Number</label>
            <input 
              type="text" 
              value={enrollment}
              onChange={e => setEnrollment(e.target.value)}
              className="w-full bg-glass-fill border border-glass-border rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-teal transition-colors"
              placeholder="e.g. 210045010002"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted font-heading mb-1.5">Branch</label>
            <select 
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="w-full bg-glass-fill border border-glass-border rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-teal transition-colors appearance-none"
            >
              <option value="" disabled>Select your branch</option>
              <option value="CSE">Computer Science & Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="ECE">Electronics & Comm. Engineering</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CE">Civil Engineering</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted font-heading mb-1.5">Batch Year (Graduation)</label>
            <select 
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full bg-glass-fill border border-glass-border rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-teal transition-colors appearance-none"
            >
              <option value="" disabled>Select batch year</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-3 bg-teal text-bg-deep font-bold py-3 px-4 rounded-[var(--r-button)] hover:bg-teal/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_var(--glow-teal)]"
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </GlassCard>
    </div>
  )
}
