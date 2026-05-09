import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/types'
import { resolveEventAsset, resolveClubAsset } from '@/lib/imageResolver'
import { StatusBadge } from './StatusBadge'
import { CountdownTimer } from './CountdownTimer'
import { GlassCard } from './GlassCard'

interface EventCardProps {
  event: Event
  variant?: 'timeline' | 'grid' | 'featured'
  clubSlug?: string
}

export async function EventCard({ event, variant = 'grid', clubSlug = 'gfg' }: EventCardProps) {
  const imageType = variant === 'featured' ? 'cover' : 'poster'
  const imageUrl = await resolveEventAsset(event.slug, imageType)
  const clubLogoUrl = await resolveClubAsset(clubSlug, 'logo')
  
  const startObj = new Date(event.start_time)
  const dateStr = startObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const timeStr = startObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  if (variant === 'featured') {
    return (
      <GlassCard className="overflow-hidden p-0 group" glow="blue">
        <div className="relative aspect-video w-full">
          <Image src={imageUrl} alt={event.title} fill className="object-cover transition-transform duration-[400ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep to-transparent" />
          <div className="absolute top-4 right-4"><StatusBadge status={event.status} /></div>
          
          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src={clubLogoUrl} alt="Club" fill className="object-cover" />
              </div>
              <span className="text-sm font-medium text-blue uppercase tracking-wider">{event.category}</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 group-hover:text-blue transition-colors">
              <Link href={`/events/${event.slug}`} className="before:absolute before:inset-0">
                {event.title}
              </Link>
            </h3>
            <p className="text-muted line-clamp-2 max-w-2xl mb-6">{event.description}</p>
            <CountdownTimer targetDate={event.start_time} size="lg" />
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="overflow-hidden p-0 group flex flex-col h-full hover:-translate-y-2 transition-transform duration-[400ms]" accentBorder="left">
      <div className="relative aspect-[3/4] w-full bg-bg-mid">
        <Image src={imageUrl} alt={event.title} fill className="object-cover transition-transform duration-[400ms] group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-transparent to-transparent" />
        <div className="absolute top-3 right-3"><StatusBadge status={event.status} /></div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white/10">
              <Image src={clubLogoUrl} alt="Club" fill className="object-cover" />
            </div>
          </div>
          <div className="px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-xs font-mono font-medium text-white">
            {dateStr}
          </div>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <div className="text-[10px] uppercase tracking-widest text-teal mb-2 font-heading">{event.category}</div>
        <h4 className="text-xl font-bold font-display text-white mb-2 leading-tight group-hover:text-blue transition-colors">
          <Link href={`/events/${event.slug}`} className="before:absolute before:inset-0">
            {event.title}
          </Link>
        </h4>
        <div className="mt-auto flex items-center gap-3 text-sm text-muted">
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {timeStr}
          </span>
          {event.venue_name && (
            <span className="flex items-center gap-1 truncate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="truncate max-w-[100px]">{event.venue_name}</span>
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
