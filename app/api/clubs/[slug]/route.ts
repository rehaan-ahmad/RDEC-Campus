import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const clubs = await sql`SELECT * FROM clubs WHERE slug = ${params.slug} LIMIT 1`
    if (!clubs.length) return NextResponse.json({ error: 'Club not found' }, { status: 404 })
    return NextResponse.json(clubs[0])
  } catch (error) {
    console.error('Failed to fetch club:', error)
    return NextResponse.json({ error: 'Failed to fetch club' }, { status: 500 })
  }
}
