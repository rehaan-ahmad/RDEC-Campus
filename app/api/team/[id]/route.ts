import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT role FROM users WHERE firebase_uid = ${user.uid}`
    if (!dbUser.length || dbUser[0].role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { role_slug, is_current } = body

    const result = await sql`
      UPDATE team_members SET 
        role_slug = COALESCE(${role_slug}, role_slug),
        is_current = COALESCE(${is_current}, is_current)
      WHERE id = ${params.id} RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}
