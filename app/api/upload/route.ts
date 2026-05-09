import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/authMiddleware'
import { getFirebaseAdminStorage } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  const { user, error } = await verifyAuth(req)
  if (error || !user) return NextResponse.json({ error }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Enforce a max file size of 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop() || 'bin'
    const timestamp = Date.now()
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, '')       // remove extension
      .replace(/[^a-zA-Z0-9_-]/g, '_') // sanitize
      .toLowerCase()

    const storagePath = `${folder}/${sanitizedName}_${timestamp}.${ext}`

    const storage = getFirebaseAdminStorage()
    const bucket = storage.bucket()
    const fileRef = bucket.file(storagePath)

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          uploadedBy: user.uid,
        },
      },
    })

    // Make the file publicly accessible
    await fileRef.makePublic()

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`

    return NextResponse.json({ url: publicUrl, path: storagePath })
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
