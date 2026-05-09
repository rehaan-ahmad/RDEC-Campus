import { sql } from '@/lib/neon'
import type { NotificationType } from '@/types'

/**
 * Helper to create a notification record in the database.
 * Call this from other API routes when relevant actions occur.
 */
export async function createNotification({
  userId,
  type,
  title,
  body,
  refId,
  refType,
}: {
  userId: string
  type: NotificationType
  title: string
  body?: string
  refId?: string
  refType?: string
}) {
  try {
    await sql`
      INSERT INTO notifications (user_id, type, title, body, ref_id, ref_type, is_read)
      VALUES (${userId}, ${type}, ${title}, ${body || null}, ${refId || null}, ${refType || null}, false)
    `
  } catch (error) {
    // Log but don't throw — notifications are non-critical
    console.error('Failed to create notification:', error)
  }
}
