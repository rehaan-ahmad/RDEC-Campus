import Image from 'next/image'
import { sql } from '@/lib/neon'
import { Club, Event, TeamMember } from '@/types'
import { resolveClubAsset } from '@/lib/imageResolver'
import { EventCard } from '@/components/ui/EventCard'
import { TeamCard } from '@/components/ui/TeamCard'
import { GlassCard } from '@/components/ui/GlassCard'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug.toUpperCase()} | Clubs | RDEC Campus` }
}

export default async function ClubPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  let club: Club | null = null
  let members: TeamMember[] = []
  let events: Event[] = []

  try {
    const [clubRes, membersRes, eventsRes] = await Promise.all([
      sql<Club[]>`SELECT * FROM clubs WHERE slug = ${slug} LIMIT 1`,
      sql<TeamMember[]>`SELECT * FROM team_members WHERE role_slug = ${'club-head-' + slug} AND is_current = true`,
      sql<Event[]>`SELECT * FROM events WHERE club_slug = ${slug} ORDER BY start_time DESC LIMIT 3`
    ])
    club = clubRes[0] || null
    members = membersRes
    events = eventsRes
  } catch {
    club = { id: '1', slug, name: 'Sample Club', category: 'tech', description: 'This is a sample club description. We build awesome things together.', is_active: true } as Club
  }

  if (!club) return <div className="pt-32 text-center text-white">Club not found</div>

  const logoUrl = await resolveClubAsset(slug, 'logo')
  const coverUrl = await resolveClubAsset(slug, 'cover')

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative w-full h-[40vh] md:h-[50vh]">
        <Image src={coverUrl} alt={club.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto flex items-end gap-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-glass-fill border-2 border-glass-border shadow-[0_0_30px_var(--glow-blue)] flex-shrink-0">
            <Image src={logoUrl} alt={club.name} fill className="object-contain p-2 md:p-4" />
          </div>
          <div className="mb-2">
            <div className="text-teal text-xs font-heading uppercase tracking-widest mb-2">{club.category} Society</div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">{club.name}</h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-display font-bold text-white mb-6">About Us</h2>
          <GlassCard className="p-8">
            <p className="text-white/80 leading-relaxed font-body whitespace-pre-wrap">{club.description}</p>
          </GlassCard>

          {events.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Recent Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {events.map(event => <EventCard key={event.id} event={event} variant="grid" clubSlug={slug} />)}
              </div>
            </div>
          )}
        </div>
        
        <div>
          {members.length > 0 && (
            <div>
              <h2 className="text-xl font-display font-bold text-white mb-6 border-b border-glass-border pb-2">Core Team</h2>
              <div className="flex flex-col gap-4">
                {members.map(member => (
                  <TeamCard key={member.id} member={member} size="sm" showFlip />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
