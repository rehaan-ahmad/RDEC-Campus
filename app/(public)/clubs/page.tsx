import Image from 'next/image'
import Link from 'next/link'
import { sql } from '@/lib/neon'
import { Club } from '@/types'
import { resolveClubAsset } from '@/lib/imageResolver'

export const metadata = {
  title: 'Student Clubs | RDEC Campus',
}

async function getClubs() {
  try {
    const clubs = await sql<Club[]>`SELECT * FROM clubs WHERE is_active = true ORDER BY name ASC`
    return clubs
  } catch {
    return [
      { id: '1', slug: 'gfg', name: 'GeeksforGeeks RDEC', category: 'tech', description: 'Coding club for competitive programming and web dev.', is_active: true } as Club,
      { id: '2', slug: 'rhythm', name: 'Rhythm', category: 'cultural', description: 'The official dance society of RDEC.', is_active: true } as Club
    ]
  }
}

export default async function ClubsPage() {
  const clubs = await getClubs()
  
  const techClubs = clubs.filter(c => c.category === 'tech')
  const culturalClubs = clubs.filter(c => c.category === 'cultural')

  const renderClubGrid = async (clubList: Club[]) => {
    const listWithLogos = await Promise.all(clubList.map(async c => ({ ...c, logoUrl: await resolveClubAsset(c.slug, 'logo') })))
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listWithLogos.map((club) => (
          <div key={club.id} className="relative w-full aspect-[4/5] rounded-[var(--r-card)] overflow-hidden bg-bg-mid group [perspective:1000px]">
            <div className="w-full h-full transition-transform duration-[600ms] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              {/* Front */}
              <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center p-6 border border-glass-border bg-glass-fill rounded-[var(--r-card)]">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 bg-white/5 border border-glass-border shadow-[0_0_20px_var(--glow-blue)]">
                  <Image src={club.logoUrl} alt={club.name} fill className="object-contain p-2" />
                </div>
                <h3 className="text-xl font-display font-bold text-white text-center leading-tight">{club.name}</h3>
                <div className="mt-2 px-2 py-0.5 bg-blue/10 text-blue rounded border border-blue/20 text-[10px] font-heading uppercase tracking-widest">{club.category}</div>
              </div>
              
              {/* Back */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-glass-fill backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center border border-glass-border rounded-[var(--r-card)]">
                <h3 className="text-lg font-display font-bold text-white mb-2">{club.name}</h3>
                <p className="text-sm text-muted mb-6 line-clamp-4">{club.description}</p>
                <Link href={`/clubs/${club.slug}`} className="px-6 py-2 bg-teal text-bg-deep font-medium rounded-full hover:bg-teal/90 transition-colors shadow-[0_0_15px_var(--glow-teal)]">
                  View Club
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Student Clubs & Societies</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">Find your community, develop your skills, and make memories.</p>
      </div>

      <div className="space-y-20">
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <h2 className="text-3xl font-display font-bold text-white mb-8 border-b border-glass-border pb-4">Technical Societies</h2>
          {await renderClubGrid(techClubs)}
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <h2 className="text-3xl font-display font-bold text-white mb-8 border-b border-glass-border pb-4">Cultural Societies</h2>
          {await renderClubGrid(culturalClubs)}
        </section>
      </div>
    </div>
  )
}
