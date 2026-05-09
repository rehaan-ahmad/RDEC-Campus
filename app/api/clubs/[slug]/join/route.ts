import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT id FROM users WHERE firebase_uid = ${user.uid} LIMIT 1`
    if (!dbUser.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const userId = dbUser[0].id

    const club = await sql`SELECT id FROM clubs WHERE slug = ${params.slug} LIMIT 1`
    if (!club.length) return NextResponse.json({ error: 'Club not found' }, { status: 404 })
    const clubId = club[0].id

    // Check if already a member or has a pending request
    const existing = await sql`
      SELECT * FROM club_memberships 
      WHERE user_id = ${userId} AND club_id = ${clubId}
    `
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Already a member or request pending', membership: existing[0] }, { status: 409 })
    }

    const result = await sql`
      INSERT INTO club_memberships (user_id, club_id, status)
      VALUES (${userId}, ${clubId}, 'pending')
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Failed to request club membership:', error)
    return NextResponse.json({ error: 'Failed to request membership' }, { status: 500 })
  }
}
