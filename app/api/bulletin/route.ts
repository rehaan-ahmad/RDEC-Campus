import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'

export async function GET() {
  try {
    const posts = await sql`
      SELECT * FROM bulletin_posts 
      WHERE is_active = true 
      ORDER BY created_at DESC
    `
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to fetch bulletin posts:', error)
    return NextResponse.json({ error: 'Failed to fetch bulletin posts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT id FROM users WHERE firebase_uid = ${user.uid} LIMIT 1`
    if (!dbUser.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const userId = dbUser[0].id

    const body = await req.json()
    const { title, description, category, contact_type, contact_value } = body

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'title, description, and category are required' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO bulletin_posts (title, description, category, contact_type, contact_value, author_id, is_active)
      VALUES (${title}, ${description}, ${category}, ${contact_type || null}, ${contact_value || null}, ${userId}, true)
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Failed to create bulletin post:', error)
    return NextResponse.json({ error: 'Failed to create bulletin post' }, { status: 500 })
  }
}
