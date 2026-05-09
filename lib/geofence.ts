import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import distance from '@turf/distance'
import { point, polygon } from '@turf/helpers'

import type { CircleGeofence, PolygonGeofence } from '@/types'

export function isWithinGeofence(
  studentLat: number,
  studentLng: number,
  geofence: CircleGeofence | PolygonGeofence
): boolean {
  if (!Number.isFinite(studentLat) || !Number.isFinite(studentLng)) {
    return false
  }

  if (geofence.type === 'circle') {
    const distanceMeters = distance(
      point([studentLng, studentLat]),
      point([geofence.center[1], geofence.center[0]]),
      { units: 'meters' }
    )

    return distanceMeters <= geofence.radius_meters
  }

  if (geofence.type === 'polygon') {
    if (geofence.coordinates.length < 3) {
      return false
    }

    const ring = geofence.coordinates.map(([lat, lng]) => [lng, lat])
    const first = ring[0]
    const last = ring[ring.length - 1]
    const closedRing = first[0] === last[0] && first[1] === last[1] ? ring : [...ring, first]

    return booleanPointInPolygon(point([studentLng, studentLat]), polygon([closedRing]))
  }

  return false
}
