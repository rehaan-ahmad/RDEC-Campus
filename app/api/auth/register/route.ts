import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/authMiddleware'
import { sql } from '@/lib/neon'
import { User } from '@/types'

export async function POST(req: NextRequest) {
  const { user: decodedToken, error } = await verifyAuth(req)
  
  if (error || !decodedToken) {
    return NextResponse.json({ error }, { status: 401 })
  }

  try {
    const { enrollment_no, branch, batch_year } = await req.json()

    if (!enrollment_no || !branch || !batch_year) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const updatedUsers = await sql<User[]>`
      UPDATE users 
      SET enrollment_no = ${enrollment_no}, branch = ${branch}, batch_year = ${batch_year}
      WHERE firebase_uid = ${decodedToken.uid}
      RETURNING *
    `

    if (updatedUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUsers[0] })
  } catch (dbError) {
    console.error('Database error during auth register:', dbError)
    return NextResponse.json({ error: 'Internal server error during DB update' }, { status: 500 })
  }
}
