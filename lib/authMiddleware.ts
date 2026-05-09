import { NextRequest } from 'next/server'
import { verifyFirebaseToken, hasFirebaseAdminConfig } from './firebaseAdmin'
import { DecodedIdToken } from 'firebase-admin/auth'

export async function verifyAuth(req: NextRequest): Promise<{ user: DecodedIdToken | null, error: string | null }> {
  const authHeader = req.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Missing or invalid authorization header' }
  }

  const token = authHeader.split('Bearer ')[1]
  
  if (!hasFirebaseAdminConfig) {
    return { user: null, error: 'Server misconfigured: missing Firebase Admin credentials' }
  }

  try {
    const decodedToken = await verifyFirebaseToken(token)
    return { user: decodedToken, error: null }
  } catch (error) {
    console.error('Error verifying token:', error)
    return { user: null, error: 'Invalid or expired token' }
  }
}
