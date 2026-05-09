import { NextResponse } from 'next/server'
import { sql } from '@/lib/neon'

export async function GET() {
  try {
    const legacy = await sql`SELECT * FROM team_members WHERE is_current = false ORDER BY created_at DESC`
    return NextResponse.json(legacy)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch legacy team' }, { status: 500 })
  }
}
