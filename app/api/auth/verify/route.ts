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
    const existingUsers = await sql<User[]>`
      SELECT * FROM users WHERE firebase_uid = ${decodedToken.uid} LIMIT 1
    `

    if (existingUsers.length > 0) {
      const user = existingUsers[0]
      const needsRegistration = !user.enrollment_no || !user.branch
      return NextResponse.json({ user, isNewUser: needsRegistration })
    } else {
      const name = decodedToken.name || decodedToken.email?.split('@')[0] || 'Unknown User'
      const newUser = await sql<User[]>`
        INSERT INTO users (firebase_uid, email, full_name, role)
        VALUES (${decodedToken.uid}, ${decodedToken.email}, ${name}, 'student')
        RETURNING *
      `
      return NextResponse.json({ user: newUser[0], isNewUser: true })
    }
  } catch (dbError) {
    console.error('Database error during auth verify:', dbError)
    return NextResponse.json({ error: 'Internal server error during DB sync' }, { status: 500 })
  }
}
