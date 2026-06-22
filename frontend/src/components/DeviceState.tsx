import { Inline } from '@ingradient/ui/primitives'
import { StatusBadge } from './StatusBadge'
import type { Device } from '../mock/types'

// legacy device state = online flag + lost/blocked flags (not a single status enum).
export function DeviceState({ device }: { device: Device }) {
  return (
    <Inline gap="var(--ig-space-2)" align="center">
      <StatusBadge value={device.online ? 'online' : 'offline'} />
      {device.lost && <StatusBadge value="lost" />}
      {device.blocked && <StatusBadge value="blocked" />}
    </Inline>
  )
}
