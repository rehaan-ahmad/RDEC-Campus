import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'
import { isWithinGeofence } from '@/lib/geofence'

export async function POST(req: NextRequest) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT id FROM users WHERE firebase_uid = ${user.uid} LIMIT 1`
    if (!dbUser.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const userId = dbUser[0].id

    const body = await req.json()
    const { event_slug, latitude, longitude } = body

    if (!event_slug || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json({ error: 'event_slug, latitude, and longitude are required' }, { status: 400 })
    }

    // Fetch the event and its geofence data
    const events = await sql`
      SELECT * FROM events 
      WHERE slug = ${event_slug} 
        AND is_active = true
      LIMIT 1
    `
    if (!events.length) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    const event = events[0]

    // Check event is currently happening
    const now = new Date()
    const startTime = new Date(event.start_time)
    const endTime = new Date(event.end_time)

    if (now < startTime || now > endTime) {
      return NextResponse.json({ error: 'Event is not currently active' }, { status: 400 })
    }

    // Check geofence
    if (!event.geofence_data) {
      return NextResponse.json({ error: 'No geofence configured for this event' }, { status: 400 })
    }

    const geofence = typeof event.geofence_data === 'string' 
      ? JSON.parse(event.geofence_data) 
      : event.geofence_data

    const withinFence = isWithinGeofence(latitude, longitude, geofence)
    if (!withinFence) {
      return NextResponse.json({ error: 'You are not within the event geofence', withinFence: false }, { status: 403 })
    }

    // Check for duplicate attendance
    const existing = await sql`
      SELECT * FROM attendance 
      WHERE user_id = ${userId} AND event_id = ${event.id}
    `
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Attendance already marked', withinFence: true }, { status: 409 })
    }

    // Mark attendance
    const result = await sql`
      INSERT INTO attendance (user_id, event_id, marked_at, latitude, longitude)
      VALUES (${userId}, ${event.id}, NOW(), ${latitude}, ${longitude})
      RETURNING *
    `

    return NextResponse.json({ status: 'marked', withinFence: true, attendance: result[0] })
  } catch (error) {
    console.error('Failed to mark attendance:', error)
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 })
  }
}
