import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const events = await sql`SELECT * FROM events WHERE slug = ${params.slug} LIMIT 1`
    if (!events.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(events[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT role FROM users WHERE firebase_uid = ${user.uid}`
    if (!dbUser.length || !['admin', 'organizer', 'club-head'].includes(dbUser[0].role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, category, start_time, end_time, location_name, is_featured, club_slug, geofence_data, is_active } = body
    
    const result = await sql`
      UPDATE events SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        category = COALESCE(${category}, category),
        start_time = COALESCE(${start_time}, start_time),
        end_time = COALESCE(${end_time}, end_time),
        location_name = COALESCE(${location_name}, location_name),
        is_featured = COALESCE(${is_featured}, is_featured),
        club_slug = COALESCE(${club_slug}, club_slug),
        geofence_data = COALESCE(${geofence_data ? JSON.stringify(geofence_data) : null}, geofence_data),
        is_active = COALESCE(${is_active}, is_active),
        updated_at = NOW()
      WHERE slug = ${params.slug} RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}
