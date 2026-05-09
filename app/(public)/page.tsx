import Link from 'next/link'
import { sql } from '@/lib/neon'
import { StatCard } from '@/components/ui/StatCard'
import { GlassCard } from '@/components/ui/GlassCard'

export const metadata = {
  title: 'RDEC Campus — Official Student Platform',
}

async function getStats() {
  try {
    const [userRes, eventRes, clubRes] = await Promise.all([
      sql`SELECT count(*) as count FROM users`,
      sql`SELECT count(*) as count FROM events WHERE status = 'upcoming' OR status = 'ongoing'`,
      sql`SELECT count(*) as count FROM clubs WHERE is_active = true`
    ])
    return {
      users: userRes[0].count,
      events: eventRes[0].count,
      clubs: clubRes[0].count
    }
  } catch (err) {
    // Return mock data if db connection fails (e.g., missing URL during dev)
    return { users: '2400', events: '12', clubs: '7' }
  }
}

export default async function Home() {
  const stats = await getStats()

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue/10 rounded-full blur-[120px] pointer-events-none orb-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal/10 rounded-full blur-[120px] pointer-events-none orb-float-slow" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 flex flex-col items-center text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 fill-mode-both">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue/30 bg-blue/10 text-blue text-xs font-mono uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-blue animate-pulse" />
            Official Platform
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[88px] font-display font-bold leading-[1.1] tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          Elevate Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue to-teal">Campus Experience</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 font-body animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          Discover events, join clubs, track attendance, and stay connected with the pulse of RDEC.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
          <Link href="/events" className="px-8 py-4 rounded-full bg-blue text-white font-medium hover:bg-blue/90 hover:scale-105 transition-all w-full sm:w-auto shadow-[0_0_20px_var(--glow-blue)]">
            Explore Events
          </Link>
          <Link href="/login" className="px-8 py-4 rounded-full bg-glass-fill border border-glass-border text-white font-medium hover:bg-glass-fill-hover hover:scale-105 transition-all w-full sm:w-auto">
            Student Login
          </Link>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="w-full border-y border-glass-border bg-bg-mid/50 py-4 overflow-hidden flex items-center">
        <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap gap-12 px-6 opacity-60">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center font-mono text-sm tracking-widest uppercase">
              <span>R.D. Engineering College</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue" />
              <span>NAAC Accredited</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal" />
              <span>AKTU Affiliated</span>
              <span className="w-1.5 h-1.5 rounded-full bg-violet" />
              <span>Ghaziabad, UP</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            </div>
          ))}
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
            value={`${stats.users}+`}
            label="Active Students"
            sublabel="Registered on platform"
          />
          <StatCard 
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
            value={`${stats.events}`}
            label="Upcoming Events"
            sublabel="Happening this month"
          />
          <StatCard 
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>}
            value={`${stats.clubs}`}
            label="Active Clubs"
            sublabel="Across technical & cultural"
          />
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Everything in one place</h2>
          <p className="text-muted max-w-2xl mx-auto">The RDEC Campus platform streamlines your entire college journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          <GlassCard className="md:col-span-2 flex flex-col justify-end p-8 group overflow-hidden" glow="blue">
            <h3 className="text-2xl font-bold font-heading text-white mb-2 relative z-10">Smart Geofence Attendance</h3>
            <p className="text-muted relative z-10">Mark your attendance automatically when you're inside the venue boundary.</p>
          </GlassCard>
          
          <GlassCard className="flex flex-col justify-end p-8 group overflow-hidden" glow="teal">
            <h3 className="text-2xl font-bold font-heading text-white mb-2 relative z-10">AI Advisor</h3>
            <p className="text-muted text-sm relative z-10">Ask questions and get instant answers about campus life.</p>
          </GlassCard>

          <GlassCard className="flex flex-col justify-end p-8 group overflow-hidden">
            <h3 className="text-2xl font-bold font-heading text-white mb-2 relative z-10">Clubs</h3>
            <p className="text-muted text-sm relative z-10">Join technical and cultural societies.</p>
          </GlassCard>
          
          <GlassCard className="md:col-span-2 flex flex-col justify-end p-8 group overflow-hidden" glow="violet">
            <h3 className="text-2xl font-bold font-heading text-white mb-2 relative z-10">Centralized Team Wall</h3>
            <p className="text-muted relative z-10">Explore the hierarchy and legacy of the student council and club heads.</p>
          </GlassCard>
        </div>
      </section>
    </div>
  )
}
