'use client'

import { useState } from 'react'

export function NotificationBadge({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount)

  return (
    <button 
      onClick={() => setCount(0)}
      className="relative p-2 rounded-full hover:bg-glass-fill-hover transition-colors"
      aria-label="Notifications"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      {count > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-bg-deep">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}
