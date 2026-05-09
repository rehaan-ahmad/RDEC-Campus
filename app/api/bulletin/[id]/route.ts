import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { verifyAuth } from '@/lib/authMiddleware'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const dbUser = await sql`SELECT id, role FROM users WHERE firebase_uid = ${user.uid} LIMIT 1`
    if (!dbUser.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const post = await sql`SELECT * FROM bulletin_posts WHERE id = ${params.id} LIMIT 1`
    if (!post.length) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    // Only the author or an admin can delete
    if (post[0].author_id !== dbUser[0].id && dbUser[0].role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await sql`DELETE FROM bulletin_posts WHERE id = ${params.id}`
    return NextResponse.json({ status: 'deleted' })
  } catch (error) {
    console.error('Failed to delete bulletin post:', error)
    return NextResponse.json({ error: 'Failed to delete bulletin post' }, { status: 500 })
  }
}
