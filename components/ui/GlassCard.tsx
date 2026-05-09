import { ReactNode, HTMLAttributes } from 'react'

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  glow?: 'blue' | 'teal' | 'violet' | 'none'
  accentBorder?: 'top' | 'left' | 'none'
}

export function GlassCard({
  children,
  glow = 'none',
  accentBorder = 'none',
  className = '',
  ...props
}: GlassCardProps) {
  let accentStyles = {}
  if (accentBorder === 'top') accentStyles = { borderTopColor: 'var(--blue)' }
  if (accentBorder === 'left') accentStyles = { borderLeftColor: 'var(--teal)' }

  return (
    <div className="relative w-full h-full">
      {glow !== 'none' && (
        <div 
          className="absolute inset-0 -z-10 rounded-[var(--r-card)] blur-[40px] pointer-events-none" 
          style={{ background: `var(--glow-${glow})` }}
        />
      )}
      <div 
        className={`glass-card h-full ${className}`}
        style={accentStyles}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
