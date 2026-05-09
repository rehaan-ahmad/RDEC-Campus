import Image from 'next/image'
import Link from 'next/link'
import { sql } from '@/lib/neon'
import { News } from '@/types'
import { resolveNewsImage } from '@/lib/imageResolver'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `${params.slug.replace(/-/g, ' ')} | News | RDEC Campus`,
  }
}

async function getArticle(slug: string) {
  try {
    const res = await sql<News[]>`SELECT * FROM news WHERE slug = ${slug} LIMIT 1`
    return res[0]
  } catch {
    return {
      id: '1', slug, title: 'Sample Article', category: 'general', content: 'This is the full content of the article rendered here.', excerpt: 'Sample excerpt.', published_at: new Date().toISOString()
    } as News
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)
  const imageUrl = await resolveNewsImage(article.slug)

  if (!article) return <div className="pt-32 text-center text-white">Article not found</div>

  return (
    <div className="pt-16 pb-20">
      <div className="relative w-full h-[40vh] md:h-[60vh]">
        <Image src={imageUrl} alt={article.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-4xl mx-auto">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm text-blue hover:text-white transition-colors mb-6 font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Back to News
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-glass-fill border border-glass-border rounded-full text-xs font-heading uppercase tracking-widest text-teal">
              {article.category}
            </span>
            <span className="text-muted font-mono text-sm">{new Date(article.published_at).toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">{article.title}</h1>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-invert prose-blue lg:prose-lg max-w-none font-body text-white/80 leading-relaxed">
          <p className="text-xl text-white font-medium mb-8">{article.excerpt}</p>
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
        </div>
      </div>
    </div>
  )
}
