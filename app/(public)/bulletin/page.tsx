import { sql } from '@/lib/neon'
import { BulletinPost } from '@/types'
import { BulletinCard } from '@/components/ui/BulletinCard'
import Link from 'next/link'

export const metadata = {
  title: 'Bulletin Board | RDEC Campus',
}

async function getBulletins() {
  try {
    const posts = await sql<BulletinPost[]>`SELECT * FROM bulletin_posts WHERE is_active = true ORDER BY created_at DESC`
    return posts
  } catch {
    return [
      { id: '1', title: 'Lost: Black Wallet near Lab 3', description: 'Contains ID card and some cash. Please return if found.', category: 'lost-found', created_at: new Date().toISOString() } as BulletinPost,
      { id: '2', title: 'Looking for roommate in Raj Nagar', description: '2BHK flat, rent 5k per head.', category: 'roommate', contact_value: '9876543210', created_at: new Date().toISOString() } as BulletinPost
    ]
  }
}

export default async function BulletinPage() {
  const posts = await getBulletins()

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Bulletin Board</h1>
          <p className="text-muted text-lg max-w-xl">Student notices, lost & found, book exchanges, and roommate requests.</p>
        </div>
        <Link href="/login" className="px-6 py-3 rounded-full bg-blue text-white font-medium hover:bg-blue/90 transition-colors shadow-[0_0_15px_var(--glow-blue)] flex-shrink-0 text-center">
          Post a Notice
        </Link>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {posts.map(post => (
          <div key={post.id} className="break-inside-avoid">
            <BulletinCard post={post} />
          </div>
        ))}
      </div>
    </div>
  )
}
