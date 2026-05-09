import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'

export async function GET(req: NextRequest) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT id FROM users WHERE firebase_uid = ${user.uid} LIMIT 1`
    if (!dbUser.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const notifications = await sql`
      SELECT * FROM notifications 
      WHERE user_id = ${dbUser[0].id} 
      ORDER BY created_at DESC 
      LIMIT 50
    `
    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT id FROM users WHERE firebase_uid = ${user.uid} LIMIT 1`
    if (!dbUser.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json()
    const { notification_id } = body

    if (notification_id) {
      // Mark specific notification as read
      await sql`
        UPDATE notifications SET is_read = true 
        WHERE id = ${notification_id} AND user_id = ${dbUser[0].id}
      `
    } else {
      // Mark all as read
      await sql`
        UPDATE notifications SET is_read = true 
        WHERE user_id = ${dbUser[0].id} AND is_read = false
      `
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Failed to update notifications:', error)
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
  }
}
