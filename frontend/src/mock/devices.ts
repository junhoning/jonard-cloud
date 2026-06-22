import type { Device } from './types'

const MODELS: Array<[string, string]> = [
  ['OTDRPro X1', 'x1'],
  ['OTDRPro X2', 'x2'],
  ['FiberScout 200', 'fs2'],
  ['SpliceMaster 7R', 'sm7'],
  ['FiberScout 350', 'fs3'],
]
const OWNERS = ['john@example.com', 'jane@example.com', 'sara@partner.com', 'tom@partner.com']
const GROUPS = ['Floor-2-North', 'Field Team A', 'Warehouse', 'Seoul Site', undefined]
const CUSTOMERS = ['ACME Corp', 'Partner Networks', 'Global Fiber Inc', 'NorthLine Telecom']
const COUNTRIES = ['South Korea', 'Japan', 'Germany', 'Canada']
const ADDRESSES = ['Seoul, KR', 'Busan, KR', 'Incheon, KR', 'Tokyo, JP', 'Frankfurt, DE']

// 18 fake devices generated deterministically (no Math.random — stable across reloads).
export const mockDevices: Device[] = Array.from({ length: 18 }, (_, i) => {
  const n = i + 1
  const [model, modelCode] = MODELS[i % MODELS.length]
  const online = i % 3 !== 0
  return {
    id: `dev_${String(n).padStart(3, '0')}`,
    deviceName: `Field Unit #${n}`,
    serialNumber: `SN-${100000 + n * 37}`,
    imei: `IMEI-${900000000 + n * 1234}`,
    model,
    modelCode,
    user: OWNERS[i % OWNERS.length],
    groupName: GROUPS[i % GROUPS.length],
    customerName: CUSTOMERS[i % CUSTOMERS.length],
    countryName: COUNTRIES[i % COUNTRIES.length],
    firmwareVersion: `2.${i % 5}.${i % 3}`,
    latestVersion: '2.4.2',
    online,
    lost: i % 7 === 4,
    blocked: i % 11 === 5,
    battery: online ? 60 + ((i * 7) % 40) : 10 + ((i * 5) % 30),
    totalArc: 20000 + n * 137,
    currentArc: (n * 137) % 5000,
    formattedAddress: ADDRESSES[i % ADDRESSES.length],
    productionDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-05`,
    registDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-15`,
    lastMaintenance: i % 2 === 0 ? '2026-05-10' : undefined,
  }
})

export function findDevice(id: string): Device | undefined {
  return mockDevices.find((d) => d.id === id)
}
