'use client'

import { useState, useEffect } from 'react'

export function CountdownTimer({ targetDate, size = 'md' }: { targetDate: string, size?: 'sm' | 'md' | 'lg' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const target = new Date(targetDate).getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true })
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isPast: false
      })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (!mounted) return null // Avoid hydration mismatch

  if (timeLeft.isPast) {
    return <div className="font-mono text-orange font-bold uppercase tracking-wider">Event started</div>
  }

  const format = (num: number) => num.toString().padStart(2, '0')
  
  const textClass = 
    size === 'sm' ? 'text-sm' : 
    size === 'lg' ? 'text-3xl md:text-5xl' : 
    'text-xl md:text-2xl'

  const labelClass = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <div className={`flex items-center gap-2 md:gap-4 font-mono ${textClass} text-white drop-shadow-md`}>
      <div className="flex flex-col items-center">
        <span>{format(timeLeft.days)}</span>
        <span className={`text-muted uppercase font-heading ${labelClass}`}>Days</span>
      </div>
      <span className="text-muted pb-4">:</span>
      <div className="flex flex-col items-center">
        <span>{format(timeLeft.hours)}</span>
        <span className={`text-muted uppercase font-heading ${labelClass}`}>Hrs</span>
      </div>
      <span className="text-muted pb-4">:</span>
      <div className="flex flex-col items-center">
        <span>{format(timeLeft.minutes)}</span>
        <span className={`text-muted uppercase font-heading ${labelClass}`}>Min</span>
      </div>
      <span className="text-muted pb-4">:</span>
      <div className="flex flex-col items-center">
        <span className="text-blue">{format(timeLeft.seconds)}</span>
        <span className={`text-blue/70 uppercase font-heading ${labelClass}`}>Sec</span>
      </div>
    </div>
  )
}
