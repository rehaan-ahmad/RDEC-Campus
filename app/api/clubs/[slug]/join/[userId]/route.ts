import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'
import { createNotification } from '@/lib/notifications'

export async function PUT(req: NextRequest, { params }: { params: { slug: string; userId: string } }) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    // Verify the caller is an admin or the club-head for this specific club
    const dbUser = await sql`SELECT id, role FROM users WHERE firebase_uid = ${user.uid} LIMIT 1`
    if (!dbUser.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const isAdmin = dbUser[0].role === 'admin'
    const isClubHead = dbUser[0].role === 'club-head'

    if (!isAdmin && !isClubHead) {
      return NextResponse.json({ error: 'Unauthorized: must be admin or club-head' }, { status: 403 })
    }

    // If club-head, verify they actually head THIS club
    if (isClubHead && !isAdmin) {
      const headCheck = await sql`
        SELECT * FROM team_members 
        WHERE user_id = ${dbUser[0].id} 
          AND role_slug = ${'club-head-' + params.slug} 
          AND is_current = true
      `
      if (!headCheck.length) {
        return NextResponse.json({ error: 'Unauthorized: you are not the head of this club' }, { status: 403 })
      }
    }

    const body = await req.json()
    const { status } = body // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status must be "approved" or "rejected"' }, { status: 400 })
    }

    const club = await sql`SELECT id, name FROM clubs WHERE slug = ${params.slug} LIMIT 1`
    if (!club.length) return NextResponse.json({ error: 'Club not found' }, { status: 404 })

    const result = await sql`
      UPDATE club_memberships 
      SET status = ${status}
      WHERE user_id = ${params.userId} AND club_id = ${club[0].id}
      RETURNING *
    `

    if (!result.length) {
      return NextResponse.json({ error: 'Membership request not found' }, { status: 404 })
    }

    // Notify the user of the decision
    await createNotification({
      userId: params.userId,
      type: 'club-membership',
      title: status === 'approved'
        ? `Your request to join ${club[0].name} has been approved!`
        : `Your request to join ${club[0].name} was declined.`,
      refId: club[0].id,
      refType: 'club',
    })

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Failed to update membership:', error)
    return NextResponse.json({ error: 'Failed to update membership' }, { status: 500 })
  }
}
