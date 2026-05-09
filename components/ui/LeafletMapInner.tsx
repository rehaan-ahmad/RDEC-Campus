'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'

export interface LeafletMapProps {
  mode: 'view' | 'edit'
  initialGeofence?: any
  onDrawComplete?: (geofence: any) => void
}

export default function LeafletMapInner({ mode, initialGeofence, onDrawComplete }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    // Default center to RDEC Campus
    const defaultCenter: L.LatLngExpression = [28.6750, 77.4950]
    
    const map = L.map(mapRef.current).setView(defaultCenter, 16)
    mapInstance.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    const drawnItems = new L.FeatureGroup()
    map.addTo(drawnItems)

    if (initialGeofence) {
      if (initialGeofence.type === 'circle') {
        L.circle(initialGeofence.center, { radius: initialGeofence.radius_meters }).addTo(drawnItems)
        map.setView(initialGeofence.center, 16)
      } else if (initialGeofence.type === 'polygon') {
        L.polygon(initialGeofence.coordinates).addTo(drawnItems)
        map.fitBounds(L.polygon(initialGeofence.coordinates).getBounds())
      }
    }

    if (mode === 'edit') {
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems
        },
        draw: {
          marker: false,
          polyline: false,
          rectangle: false,
          circlemarker: false,
          circle: true,
          polygon: true
        }
      })
      map.addControl(drawControl)

      map.on(L.Draw.Event.CREATED, (e: any) => {
        drawnItems.clearLayers()
        const layer = e.layer
        drawnItems.addLayer(layer)

        if (onDrawComplete) {
          if (e.layerType === 'circle') {
            onDrawComplete({
              type: 'circle',
              center: [layer.getLatLng().lat, layer.getLatLng().lng],
              radius_meters: layer.getRadius()
            })
          } else if (e.layerType === 'polygon') {
            const latlngs = layer.getLatLngs()[0] as L.LatLng[]
            onDrawComplete({
              type: 'polygon',
              coordinates: latlngs.map(ll => [ll.lat, ll.lng])
            })
          }
        }
      })
    }

    // Fix missing marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [mode, initialGeofence, onDrawComplete])

  return <div ref={mapRef} className="w-full h-full rounded-md z-0" style={{ zIndex: 0 }} />
}
