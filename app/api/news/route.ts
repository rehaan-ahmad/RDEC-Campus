import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'

export async function GET() {
  try {
    const news = await sql`SELECT * FROM news ORDER BY published_at DESC`
    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
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
    const { slug, title, content, excerpt, category, author_id, is_pinned } = body

    const result = await sql`
      INSERT INTO news (slug, title, content, excerpt, category, author_id, is_pinned, published_at)
      VALUES (${slug}, ${title}, ${content}, ${excerpt}, ${category}, ${author_id}, ${is_pinned || false}, NOW())
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 })
  }
}
