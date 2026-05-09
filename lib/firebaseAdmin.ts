import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

export const hasFirebaseAdminConfig = Boolean(projectId && clientEmail && privateKey)

function assertFirebaseAdminConfig() {
  if (!hasFirebaseAdminConfig) {
    throw new Error('Missing Firebase Admin env vars in .env.local')
  }
}

export function getFirebaseAdminApp(): App {
  assertFirebaseAdminConfig()

  if (getApps().length) {
    return getApps()[0]
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    storageBucket,
  })
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp())
}

export function getFirebaseAdminStorage() {
  return getStorage(getFirebaseAdminApp())
}

export async function verifyFirebaseToken(idToken: string): Promise<DecodedIdToken> {
  return getFirebaseAdminAuth().verifyIdToken(idToken)
}
