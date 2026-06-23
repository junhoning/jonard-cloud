import { useMemo, useState } from 'react'
import {
  PageHeader,
  PageHeaderRow,
  PageTitle,
  PageTitleBlock,
  PageSubtitle,
  Panel,
} from '@ingradient/ui/patterns'
import { EmptyState, Tabs } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { MapPin } from 'lucide-react'
import { LocationMap, type MapMarker } from '../components/LocationMap'
import { workOrdersStore, devicesStore } from '../store/stores'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'work-orders', label: 'Work orders' },
  { value: 'devices', label: 'Devices' },
]

// Read-only overview of where work orders and devices sit on a map.
// Marker editing / fiber-map drawing (the original legacy editor) is out of scope.
export function NetworkMapPage() {
  const workOrders = workOrdersStore.use()
  const devices = devicesStore.use()
  const [tab, setTab] = useState('all')

  const workOrderMarkers = useMemo<MapMarker[]>(
    () =>
      workOrders.flatMap((wo) =>
        wo.locations.map((loc, i) => ({
          id: `${wo.id}-${i}`,
          latitude: loc.latitude,
          longitude: loc.longitude,
          label: wo.name,
          description: loc.address,
          kind: 'work-order' as const,
        })),
      ),
    [workOrders],
  )

  const deviceMarkers = useMemo<MapMarker[]>(
    () =>
      devices
        .filter((d) => d.latitude != null && d.longitude != null)
        .map((d) => ({
          id: d.id,
          latitude: d.latitude as number,
          longitude: d.longitude as number,
          label: d.deviceName,
          description: d.formattedAddress,
          kind: 'device' as const,
        })),
    [devices],
  )

  const markers = useMemo<MapMarker[]>(() => {
    if (tab === 'work-orders') return workOrderMarkers
    if (tab === 'devices') return deviceMarkers
    return [...workOrderMarkers, ...deviceMarkers]
  }, [tab, workOrderMarkers, deviceMarkers])

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>Network Map</PageTitle>
            <PageSubtitle>{markers.length} mapped locations</PageSubtitle>
          </PageTitleBlock>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <Tabs items={TABS} value={tab} onChange={setTab} variant="underline" />
        <Panel>
          {markers.length ? (
            <LocationMap markers={markers} className="jc-map" />
          ) : (
            <EmptyState
              icon={<MapPin size={28} />}
              title="No mapped locations"
              description="No work orders or devices have recorded coordinates yet."
            />
          )}
        </Panel>
      </Stack>
    </>
  )
}
