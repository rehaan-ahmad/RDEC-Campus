import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const event = await sql`SELECT id FROM events WHERE slug = ${params.slug} LIMIT 1`
    if (!event.length) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    const tasks = await sql`
      SELECT * FROM event_tasks WHERE event_id = ${event[0].id} ORDER BY deadline ASC NULLS LAST
    `
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Failed to fetch event tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch event tasks' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT id, role FROM users WHERE firebase_uid = ${user.uid} LIMIT 1`
    if (!dbUser.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (!['admin', 'organizer', 'club-head'].includes(dbUser[0].role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const event = await sql`SELECT id FROM events WHERE slug = ${params.slug} LIMIT 1`
    if (!event.length) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    const body = await req.json()
    const { title, description, assignee_id, status, deadline } = body

    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

    const result = await sql`
      INSERT INTO event_tasks (event_id, title, description, assignee_id, status, deadline, created_by)
      VALUES (${event[0].id}, ${title}, ${description || null}, ${assignee_id || null}, ${status || 'todo'}, ${deadline || null}, ${dbUser[0].id})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Failed to create event task:', error)
    return NextResponse.json({ error: 'Failed to create event task' }, { status: 500 })
  }
}
