import { UserRole } from '@/types'

const roleConfig: Record<UserRole | 'public', { color: string; label: string }> = {
  admin: { color: 'var(--gold)', label: 'Admin' },
  organizer: { color: 'var(--orange)', label: 'Organizer' },
  'club-head': { color: 'var(--teal)', label: 'Club Head' },
  student: { color: 'var(--blue)', label: 'Student' },
  public: { color: 'var(--muted)', label: 'Public' },
}

export function RoleBadge({ role }: { role: UserRole | 'public' }) {
  const config = roleConfig[role]
  return (
    <span 
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
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
