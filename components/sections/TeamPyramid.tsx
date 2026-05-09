'use client'

import { useState, useRef, MouseEvent } from 'react'
import { TeamCard } from '@/components/ui/TeamCard'
import { TeamMember } from '@/types'

export function TeamPyramid({ members }: { members: TeamMember[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const newScale = scale - e.deltaY * 0.001
    setScale(Math.min(Math.max(0.5, newScale), 2))
  }

  const topTier = members.filter(m => m.role_slug === 'campus-mantri')
  const midTier = members.filter(m => m.role_slug === 'secretary' || m.role_slug === 'asst-secretary')
  const bottomTier = members.filter(m => m.role_slug.startsWith('club-head'))

  return (
    <div 
      className="relative w-full h-[600px] md:h-[800px] overflow-hidden bg-bg-mid/30 rounded-2xl border border-glass-border cursor-grab active:cursor-grabbing hidden md:block"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-glass-fill p-2 rounded-lg border border-glass-border">
        <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-1 hover:bg-white/10 rounded text-white">+</button>
        <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-1 hover:bg-white/10 rounded text-white">-</button>
      </div>

      <div 
        ref={containerRef}
        className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-75 origin-center"
        style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-16">
          <div className="flex justify-center">
            {topTier.map(m => <TeamCard key={m.id} member={m} size="lg" showFlip />)}
          </div>
          
          <div className="flex justify-center gap-12">
            {midTier.map(m => <TeamCard key={m.id} member={m} size="md" showFlip />)}
          </div>
          
          <div className="flex justify-center gap-8 flex-wrap max-w-6xl">
            {bottomTier.map(m => <TeamCard key={m.id} member={m} size="sm" showFlip />)}
          </div>
        </div>
      </div>
    </div>
  )
}
