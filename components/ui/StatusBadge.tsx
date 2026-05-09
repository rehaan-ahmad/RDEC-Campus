import { EventStatus } from '@/types'

const statusConfig: Record<EventStatus, { color: string; label: string }> = {
  draft: { color: 'var(--muted)', label: 'Draft' },
  upcoming: { color: 'var(--blue)', label: 'Upcoming' },
  ongoing: { color: 'var(--teal)', label: 'Ongoing' },
  completed: { color: 'var(--muted)', label: 'Completed' },
  cancelled: { color: 'var(--orange)', label: 'Cancelled' }
}

export function StatusBadge({ status }: { status: EventStatus }) {
  const config = statusConfig[status]
  return (
    <span 
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase border backdrop-blur-sm"
      style={{ 
        color: config.color, 
        borderColor: config.color, 
        backgroundColor: `color-mix(in srgb, ${config.color} 10%, transparent)` 
      }}
    >
      {config.label}
    </span>
  )
}
