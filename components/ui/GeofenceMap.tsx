'use client'

import dynamic from 'next/dynamic'
import { LeafletMapProps } from './LeafletMapInner'

const LeafletMap = dynamic(() => import('./LeafletMapInner'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-glass-fill animate-pulse rounded-md flex items-center justify-center text-muted">Loading map...</div>
})

export function GeofenceMap(props: LeafletMapProps) {
  return <LeafletMap {...props} />
}
