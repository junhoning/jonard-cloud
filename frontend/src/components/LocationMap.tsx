import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Stack, Text } from '@ingradient/ui/primitives'
import 'leaflet/dist/leaflet.css'
// Import the marker assets so Vite emits hashed URLs — leaflet's default
// relative paths break under the bundler and render as broken images.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

export type MapMarkerKind = 'work-order' | 'device'

export interface MapMarker {
  id: string
  latitude: number
  longitude: number
  label: string
  description?: string
  kind: MapMarkerKind
}

interface LocationMapProps {
  markers: MapMarker[]
  className?: string
}

const ICON_BASE = {
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
}
const workOrderIcon = new L.Icon(ICON_BASE)
const deviceIcon = new L.Icon({ ...ICON_BASE, className: 'jc-marker-device' })

// Korea-centred default; FitBounds overrides it once markers are known.
const DEFAULT_CENTER: [number, number] = [36.5, 127.8]
const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

// Keeps the viewport framed to the current markers (view-only — no editing).
function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap()
  useEffect(() => {
    if (markers.length === 1) {
      map.setView([markers[0].latitude, markers[0].longitude], 13)
    } else if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map((m) => [m.latitude, m.longitude] as [number, number]))
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [markers, map])
  return null
}

export function LocationMap({ markers, className }: LocationMapProps) {
  return (
    <MapContainer center={DEFAULT_CENTER} zoom={6} scrollWheelZoom className={className}>
      <TileLayer url={OSM_URL} attribution={OSM_ATTRIBUTION} />
      <FitBounds markers={markers} />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.latitude, m.longitude]} icon={m.kind === 'device' ? deviceIcon : workOrderIcon}>
          <Popup>
            <Stack gap="var(--ig-space-1)">
              <Text weight="semibold">{m.label}</Text>
              {m.description ? (
                <Text tone="muted" size="var(--ig-font-size-sm)">
                  {m.description}
                </Text>
              ) : null}
            </Stack>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
