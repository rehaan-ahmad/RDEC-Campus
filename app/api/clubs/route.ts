import { NextResponse } from 'next/server'
import { sql } from '@/lib/neon'

export async function GET() {
  try {
    const clubs = await sql`SELECT * FROM clubs WHERE is_active = true ORDER BY name ASC`
    return NextResponse.json(clubs)
  } catch (error) {
    console.error('Failed to fetch clubs:', error)
    return NextResponse.json({ error: 'Failed to fetch clubs' }, { status: 500 })
  }
}
