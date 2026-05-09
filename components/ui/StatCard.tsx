'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { GlassCard } from './GlassCard'

interface StatCardProps {
  icon: ReactNode
  value: string
  label: string
  sublabel?: string
}

export function StatCard({ icon, value, label, sublabel }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState("0")

  // Parse numeric part and suffix
  const numMatch = value.match(/[\d,]+/)
  const suffixMatch = value.match(/[^\d,]+$/)
  const numericValue = numMatch ? parseInt(numMatch[0].replace(/,/g, ''), 10) : 0
  const suffix = suffixMatch ? suffixMatch[0] : ''

  useEffect(() => {
    if (isInView && numericValue > 0) {
      let start = 0
      const duration = 2000 // 2 seconds
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4)
        const currentVal = Math.floor(easeProgress * numericValue)
        
        setDisplayValue(currentVal.toLocaleString() + suffix)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setDisplayValue(value) // Ensure final string is exactly what was passed
        }
      }

      requestAnimationFrame(animate)
    } else if (isInView) {
      setDisplayValue(value)
    }
  }, [isInView, numericValue, suffix, value])

  return (
    <GlassCard ref={ref} className="flex items-center gap-4 p-6" glow="blue">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue/10 text-blue">
        {icon}
      </div>
      <div>
        <div className="text-3xl font-mono font-bold text-white tracking-tight">
          {displayValue}
        </div>
        <div className="text-sm font-heading font-medium text-muted uppercase tracking-wider mt-1">
          {label}
        </div>
        {sublabel && (
          <div className="text-xs text-muted mt-0.5">
            {sublabel}
          </div>
        )}
      </div>
    </GlassCard>
  )
}
