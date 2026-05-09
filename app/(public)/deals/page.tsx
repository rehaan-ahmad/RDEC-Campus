import { sql } from '@/lib/neon'
import { GlassCard } from '@/components/ui/GlassCard'
import Image from 'next/image'

export const metadata = {
  title: 'Student Deals | RDEC Campus',
}

interface Deal {
  id: string
  partner_name: string
  title: string
  description: string
  promo_code: string
  url: string
  valid_until: string
}

async function getDeals() {
  try {
    const deals = await sql<Deal[]>`SELECT * FROM deals WHERE valid_until > NOW()`
    return deals
  } catch {
    return [
      { id: '1', partner_name: 'GitHub Education', title: 'GitHub Student Developer Pack', description: 'Free access to the best developer tools in one place.', promo_code: 'VERIFY EMAIL', url: 'https://education.github.com', valid_until: '2030-01-01' },
      { id: '2', partner_name: 'Spotify', title: '50% off Premium Student', description: 'Music for your study sessions at half the price.', promo_code: 'SPOTIFY-EDU', url: 'https://spotify.com/student', valid_until: '2026-12-31' },
      { id: '3', partner_name: 'Campus Cafe', title: '20% off all Beverages', description: 'Show your virtual ID to get 20% off.', promo_code: 'SHOW ID', url: '#', valid_until: '2026-06-30' }
    ]
  }
}

export default async function DealsPage() {
  const deals = await getDeals()

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Student Deals</h1>
        <p className="text-muted text-lg max-w-2xl">Exclusive discounts and perks for verified RDEC students.</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {deals.map(deal => (
          <div key={deal.id} className="break-inside-avoid">
            <GlassCard className="p-6 group relative overflow-hidden" glow="violet">
              {/* Decorative gradient blob */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet/20 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="text-[10px] text-teal font-heading uppercase tracking-widest mb-1">{deal.partner_name}</div>
              <h3 className="text-xl font-bold font-display text-white mb-3">{deal.title}</h3>
              <p className="text-sm text-muted mb-6">{deal.description}</p>
              
              <div className="flex flex-col gap-2 p-3 bg-bg-deep/50 rounded-lg border border-glass-border">
                <div className="text-[10px] text-muted uppercase">Promo Code</div>
                <div className="font-mono text-lg font-bold text-white tracking-widest">{deal.promo_code}</div>
              </div>
              
              <a href={deal.url} target="_blank" rel="noreferrer" className="mt-4 block w-full text-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium text-white transition-colors">
                Redeem Deal
              </a>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  )
}
