import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'

export async function GET() {
  try {
    const events = await sql`SELECT * FROM events ORDER BY start_time ASC`
    return NextResponse.json(events)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT role FROM users WHERE firebase_uid = ${user.uid}`
    if (!dbUser.length || !['admin', 'organizer', 'club-head'].includes(dbUser[0].role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { slug, title, description, category, start_time, end_time, location_name, is_featured, club_slug, geofence_data } = body

    const result = await sql`
      INSERT INTO events (
        slug, title, description, category, start_time, end_time, 
        location_name, is_featured, club_slug, geofence_data
      ) VALUES (
        ${slug}, ${title}, ${description}, ${category}, ${start_time}, ${end_time}, 
        ${location_name}, ${is_featured || false}, ${club_slug}, ${geofence_data ? JSON.stringify(geofence_data) : null}
      ) RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Failed to create event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
