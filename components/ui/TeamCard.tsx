import Image from 'next/image'
import { TeamMember } from '@/types'
import { resolveTeamImage } from '@/lib/imageResolver'

interface TeamCardProps {
  member: TeamMember
  size?: 'lg' | 'md' | 'sm'
  showFlip?: boolean
}

export async function TeamCard({ member, size = 'md', showFlip = false }: TeamCardProps) {
  const imageUrl = await resolveTeamImage(member.year, member.role_slug, member.name_slug)

  const sizeClasses = {
    lg: 'w-[280px] h-[360px]',
    md: 'w-[220px] h-[280px]',
    sm: 'w-[180px] h-[240px]',
  }
  
  const borderGradient = size === 'lg' ? 'bg-gradient-to-br from-gold via-blue to-teal p-[1px]' : 'bg-glass-border p-[1px]'

  const content = (
    <div className={`relative w-full h-full rounded-[var(--r-card)] overflow-hidden bg-bg-mid group [perspective:1000px]`}>
      <div className={`w-full h-full transition-transform duration-[600ms] [transform-style:preserve-3d] ${showFlip ? 'group-hover:[transform:rotateY(180deg)]' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <Image src={imageUrl} alt={member.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-4 text-center">
            <h4 className="text-white font-bold font-display leading-tight">{member.name}</h4>
            <div className="text-blue text-xs font-heading uppercase tracking-wide mt-1">{member.role}</div>
          </div>
        </div>
        
        {/* Back */}
        {showFlip && (
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-glass-fill backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center border border-glass-border rounded-[var(--r-card)]">
            {member.quote && <p className="italic text-white text-sm font-display mb-4">"{member.quote}"</p>}
            <div className="text-blue text-3xl font-mono font-bold mb-1">{member.events_led}</div>
            <div className="text-muted text-[10px] uppercase tracking-widest font-heading mb-4">Events Led</div>
            <div className="flex gap-3">
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue hover:text-white text-white/70 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={`${sizeClasses[size]} ${borderGradient} rounded-[calc(var(--r-card)+1px)] flex-shrink-0`}>
      {content}
    </div>
  )
}
