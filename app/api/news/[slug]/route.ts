import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const news = await sql`SELECT * FROM news WHERE slug = ${params.slug} LIMIT 1`
    if (!news.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(news[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news article' }, { status: 500 })
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
    const { title, content, excerpt, category, is_pinned } = body

    const result = await sql`
      UPDATE news SET 
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        excerpt = COALESCE(${excerpt}, excerpt),
        category = COALESCE(${category}, category),
        is_pinned = COALESCE(${is_pinned}, is_pinned),
        updated_at = NOW()
      WHERE slug = ${params.slug} RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 })
  }
}
