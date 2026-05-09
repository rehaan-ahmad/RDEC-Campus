import Image from 'next/image'

interface ProfileRingProps {
  avatarUrl: string
  completionPercent: number
  size?: number
}

export function ProfileRing({ avatarUrl, completionPercent, size = 64 }: ProfileRingProps) {
  const strokeWidth = 3
  const radius = (size / 2) - strokeWidth
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (completionPercent / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90 transform" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--glass-border)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--blue)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: 'stroke-dashoffset 1s ease-in-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-1.5">
        <div className="relative w-full h-full rounded-full overflow-hidden bg-bg-mid">
          <Image 
            src={avatarUrl} 
            alt="Profile Avatar" 
            fill 
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}
