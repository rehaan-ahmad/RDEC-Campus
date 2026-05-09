import Link from 'next/link'
import Image from 'next/image'
import { sql } from '@/lib/neon'
import { News } from '@/types'
import { resolveNewsImage } from '@/lib/imageResolver'
import { GlassCard } from '@/components/ui/GlassCard'

export const metadata = {
  title: 'Campus News | RDEC Campus',
}

async function getNews() {
  try {
    const articles = await sql<News[]>`SELECT * FROM news ORDER BY published_at DESC`
    return articles
  } catch {
    return [
      { id: '1', slug: 'placement-drive-tcs', title: 'TCS Placement Drive 2026', category: 'placement', excerpt: 'TCS is visiting RDEC for mass recruitment...', content: '', is_pinned: true, published_at: '2026-05-01' } as News,
      { id: '2', slug: 'tech-symposium', title: 'National Tech Symposium announced', category: 'academic', excerpt: 'RDEC will host the 2026 National Tech Symposium...', content: '', is_pinned: false, published_at: '2026-04-20' } as News
    ]
  }
}

export default async function NewsPage() {
  const articles = await getNews()
  
  const pinnedArticles = articles.filter(a => a.is_pinned)
  const regularArticles = articles.filter(a => !a.is_pinned)
  
  const featured = pinnedArticles.length > 0 ? pinnedArticles[0] : articles[0]
  const sidebarItems = articles.filter(a => a.id !== featured?.id).slice(0, 3)
  const gridItems = articles.filter(a => a.id !== featured?.id && !sidebarItems.find(s => s.id === a.id))

  const featuredImage = featured ? await resolveNewsImage(featured.slug) : ''
  const sidebarData = await Promise.all(sidebarItems.map(async item => ({ ...item, imageUrl: await resolveNewsImage(item.slug) })))
  const gridData = await Promise.all(gridItems.map(async item => ({ ...item, imageUrl: await resolveNewsImage(item.slug) })))

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Campus News</h1>
        <p className="text-muted text-lg max-w-2xl">Stay updated with the latest announcements, placement drives, and campus stories.</p>
      </div>

      {featured && (
        <div className="flex flex-col lg:flex-row gap-6 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="lg:w-[60%]">
            <Link href={`/news/${featured.slug}`} className="block h-full">
              <GlassCard className="p-0 overflow-hidden h-full group flex flex-col" glow="blue">
                <div className="relative aspect-video w-full">
                  <Image src={featuredImage} alt={featured.title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-105" />
                  {featured.is_pinned && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        Pinned
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-8 flex-1 flex flex-col justify-center">
                  <div className="text-teal text-xs font-heading uppercase tracking-widest mb-3">{featured.category}</div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-blue transition-colors">{featured.title}</h2>
                  <p className="text-muted line-clamp-3">{featured.excerpt}</p>
                </div>
              </GlassCard>
            </Link>
          </div>
          
          <div className="lg:w-[40%] flex flex-col gap-6">
            <h3 className="text-xl font-heading font-bold text-white">Recent Updates</h3>
            <div className="flex flex-col gap-4">
              {sidebarData.map((item) => (
                <Link href={`/news/${item.slug}`} key={item.id}>
                  <GlassCard className="p-4 flex gap-4 group hover:-translate-y-1" accentBorder="left">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted font-mono mb-1">{new Date(item.published_at).toLocaleDateString()}</div>
                      <h4 className="text-white font-bold font-display leading-tight group-hover:text-teal transition-colors line-clamp-2">{item.title}</h4>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
           <button className="px-4 py-1.5 rounded-full bg-blue text-white text-sm font-medium whitespace-nowrap">All News</button>
           <button className="px-4 py-1.5 rounded-full bg-glass-fill text-muted hover:text-white text-sm font-medium whitespace-nowrap">Academic</button>
           <button className="px-4 py-1.5 rounded-full bg-glass-fill text-muted hover:text-white text-sm font-medium whitespace-nowrap">Placement</button>
           <button className="px-4 py-1.5 rounded-full bg-glass-fill text-muted hover:text-white text-sm font-medium whitespace-nowrap">Events</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridData.map((item) => (
            <Link href={`/news/${item.slug}`} key={item.id}>
              <GlassCard className="p-0 overflow-hidden h-full group hover:-translate-y-2">
                <div className="relative aspect-[16/9] w-full">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="text-[10px] text-teal font-heading uppercase tracking-widest mb-2">{item.category}</div>
                  <h4 className="text-lg font-bold font-display text-white leading-tight mb-2 group-hover:text-blue transition-colors line-clamp-2">{item.title}</h4>
                  <p className="text-sm text-muted line-clamp-2">{item.excerpt}</p>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
