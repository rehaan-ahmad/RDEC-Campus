import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const hasFirebaseClientConfig = Object.values(firebaseConfig).every(Boolean)

function assertFirebaseClientConfig() {
  if (!hasFirebaseClientConfig) {
    throw new Error('Missing Firebase client env vars in .env.local')
  }
}

export function getFirebaseApp(): FirebaseApp {
  assertFirebaseClientConfig()
  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp())
}

export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp())
}

export function getGoogleProvider() {
  return new GoogleAuthProvider()
}

export async function getStorageDownloadUrl(path: string): Promise<string> {
  return getDownloadURL(ref(getFirebaseStorage(), path))
}

export const firebaseApp = hasFirebaseClientConfig ? getFirebaseApp() : null
export const auth = firebaseApp ? getAuth(firebaseApp) : null
export const storage = firebaseApp ? getStorage(firebaseApp) : null
export const googleProvider = new GoogleAuthProvider()
