import { EventCard } from '@/components/ui/EventCard'
import { resolveGallery } from '@/lib/imageResolver'
import { sql } from '@/lib/neon'
import { Event } from '@/types'
import Image from 'next/image'

export const metadata = {
  title: 'Events | RDEC Campus',
  description: 'Upcoming and past events at RDEC Campus.',
}

async function getEvents() {
  try {
    const events = await sql<Event[]>`SELECT * FROM events ORDER BY start_time ASC`
    return events
  } catch (err) {
    // Mock data fallback
    return [
      { id: '1', slug: 'syntaxis-2026', title: 'Syntaxis 2026', category: 'tech', status: 'upcoming', start_time: '2026-06-15T09:00:00Z', description: 'Annual Tech Fest of RDEC.', venue_name: 'Main Auditorium', is_featured: true, rsvp_count: 150, created_at: '' } as Event,
      { id: '2', slug: 'diwali-mela', title: 'Diwali Mela', category: 'cultural', status: 'upcoming', start_time: '2026-10-25T17:00:00Z', description: 'Festival of lights.', venue_name: 'Ground', is_featured: false, rsvp_count: 50, created_at: '' } as Event
    ]
  }
}

export default async function EventsPage() {
  const allEvents = await getEvents()
  
  const upcomingEvents = allEvents.filter(e => e.status === 'upcoming' || e.status === 'ongoing')
  const pastEvents = allEvents.filter(e => e.status === 'completed')
  
  const featuredEvent = upcomingEvents.find(e => e.is_featured) || upcomingEvents[0]
  
  // Resolve gallery images for the first past event (mock logic)
  const pastEventGalleries = await Promise.all(
    pastEvents.slice(0, 4).map(async (event) => {
      const year = new Date(event.start_time).getFullYear()
      const images = await resolveGallery(event.slug, year)
      return { event, images }
    })
  )

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Campus Events</h1>
        <p className="text-muted text-lg max-w-2xl">Discover and RSVP to upcoming technical workshops, cultural fests, and academic seminars.</p>
      </div>

      {featuredEvent && (
        <div className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <h2 className="text-2xl font-heading font-bold text-white mb-6">Featured Spotlight</h2>
          <EventCard event={featuredEvent} variant="featured" />
        </div>
      )}

      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-heading font-bold text-white">Upcoming Events</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.filter(e => e.id !== featuredEvent?.id).map((event) => (
            <EventCard key={event.id} event={event} variant="grid" />
          ))}
          {upcomingEvents.length <= 1 && (
             <div className="col-span-full py-12 text-center text-muted border border-dashed border-glass-border rounded-xl">
               No other upcoming events currently scheduled.
             </div>
          )}
        </div>
      </div>

      {pastEventGalleries.length > 0 && (
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-8">Past Events Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pastEventGalleries.map((item) => (
              <div key={item.event.id} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image src={item.images[0]} alt={item.event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white font-bold font-display leading-tight">{item.event.title}</div>
                  <div className="text-xs text-muted font-mono mt-1">{new Date(item.event.start_time).getFullYear()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
