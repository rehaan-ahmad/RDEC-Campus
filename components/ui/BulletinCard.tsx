import { BulletinPost } from '@/types'
import { GlassCard } from './GlassCard'

export function BulletinCard({ post }: { post: BulletinPost }) {
  const categoryColors: Record<string, string> = {
    'lost-found': 'border-l-orange',
    'roommate': 'border-l-violet',
    'book-exchange': 'border-l-teal',
    'internship': 'border-l-blue',
    'general': 'border-l-muted'
  }
  
  const borderClass = categoryColors[post.category] || 'border-l-muted'

  const dateStr = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <GlassCard className={`border-l-4 ${borderClass} hover:-translate-y-1 transition-transform p-5`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase font-heading tracking-widest text-muted">{post.category.replace('-', ' ')}</span>
        <span className="text-xs text-muted/70">{dateStr}</span>
      </div>
      <h4 className="text-lg font-bold text-white mb-2 leading-tight">{post.title}</h4>
      <p className="text-sm text-muted line-clamp-3 mb-4">{post.description}</p>
      
      {(post.contact_label || post.contact_value) && (
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-glass-border">
          <span className="text-xs text-muted">{post.contact_label || 'Contact'}</span>
          <span className="text-sm font-medium text-blue">{post.contact_value}</span>
        </div>
      )}
    </GlassCard>
  )
}
