import { sql } from '@/lib/neon'
import { TeamMember } from '@/types'
import { TeamPyramid } from '@/components/sections/TeamPyramid'
import { TeamCard } from '@/components/ui/TeamCard'

export const metadata = {
  title: 'Team Wall | RDEC Campus',
}

async function getTeam() {
  try {
    const members = await sql<TeamMember[]>`SELECT * FROM team_members WHERE is_current = true`
    return members
  } catch (err) {
    return [
      { id: '1', name: 'Rehaan Ahmad', name_slug: 'rehaan-ahmad', role: 'Campus Mantri', role_slug: 'campus-mantri', year: 2026, events_led: 12, is_current: true } as TeamMember,
      { id: '2', name: 'Aryan Sharma', name_slug: 'aryan-sharma', role: 'Secretary', role_slug: 'secretary', year: 2026, events_led: 5, is_current: true } as TeamMember,
      { id: '3', name: 'Priya Singh', name_slug: 'priya-singh', role: 'Head of GFG', role_slug: 'club-head-gfg', year: 2026, events_led: 8, is_current: true } as TeamMember
    ]
  }
}

export default async function TeamPage() {
  const members = await getTeam()

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">The Student Council</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">Meet the current leaders shaping the RDEC Campus experience.</p>
      </div>

      {/* Desktop Interactive Pyramid */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <TeamPyramid members={members} />
      </div>

      {/* Mobile Fallback */}
      <div className="md:hidden flex flex-col items-center gap-6 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        {members.map(m => (
          <TeamCard key={m.id} member={m} size={m.role_slug === 'campus-mantri' ? 'lg' : 'md'} showFlip />
        ))}
      </div>
      
      {/* Legacy Section */}
      <div className="mt-32 text-center animate-in fade-in duration-1000">
        <h2 className="text-3xl font-display font-bold text-white mb-8">Legacy Tree</h2>
        <div className="p-12 border border-glass-border bg-glass-fill rounded-2xl flex flex-col items-center justify-center">
           <p className="text-muted mb-4">Historical tree visualization will load from legacy data.</p>
           {/* Legacy tree svg logic to be implemented */}
           <div className="h-64 flex items-center justify-center opacity-50 font-mono text-sm">
             [Legacy SVG Generator Placeholder]
           </div>
        </div>
      </div>
    </div>
  )
}
