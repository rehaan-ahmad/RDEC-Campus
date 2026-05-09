import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'
import { createNotification } from '@/lib/notifications'

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT id FROM users WHERE firebase_uid = ${user.uid} LIMIT 1`
    if (!dbUser.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const userId = dbUser[0].id

    const event = await sql`SELECT id, title FROM events WHERE slug = ${params.slug} LIMIT 1`
    if (!event.length) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    const eventId = event[0].id

    const existing = await sql`SELECT * FROM event_rsvps WHERE user_id = ${userId} AND event_id = ${eventId}`
    
    if (existing.length > 0) {
      await sql`DELETE FROM event_rsvps WHERE user_id = ${userId} AND event_id = ${eventId}`
      return NextResponse.json({ status: 'removed' })
    } else {
      await sql`INSERT INTO event_rsvps (user_id, event_id) VALUES (${userId}, ${eventId})`
      // Fire notification for the user
      await createNotification({
        userId,
        type: 'event-rsvp',
        title: `RSVP confirmed for ${event[0].title}`,
        body: 'You will be notified of any event updates.',
        refId: eventId,
        refType: 'event',
      })
      return NextResponse.json({ status: 'added' })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle RSVP' }, { status: 500 })
  }
}
