import type { DeviceRecord, FiberMeasurement, SpliceResult } from './types'

// Build a small fiber list deterministically (no Math.random).
function fibers(count: number, baseLoss: number): FiberMeasurement[] {
  return Array.from({ length: count }, (_, i) => {
    const loss = +(baseLoss + i * 0.01).toFixed(2)
    const result: SpliceResult = loss <= 0.1 ? 'pass' : 'fail'
    return {
      fiberId: `F${String(i + 1).padStart(2, '0')}`,
      loss,
      leftAngle: +(0.2 + i * 0.03).toFixed(2),
      rightAngle: +(0.3 + i * 0.02).toFixed(2),
      result,
    }
  })
}

// Shaped after the legacy DeviceRecordVo: fiber-splice measurements.
export const mockRecords: DeviceRecord[] = [
  {
    id: 'SPL-5001',
    deviceId: 'dev_001',
    deviceName: 'Field Unit #1',
    serialNumber: 'SN-100037',
    model: 'OTDRPro X1',
    user: 'john@example.com',
    workOrderId: 'JOB-1024',
    spliceMode: 'SM AUTO',
    fiberType: 'SMF (G.652)',
    loss: 0.03,
    leftAngle: 0.21,
    rightAngle: 0.34,
    result: 'pass',
    date: '2026-06-22',
    time: '13:30:11',
    location: 'Floor 2, North Wing, Seoul',
    fibers: fibers(4, 0.03),
  },
  {
    id: 'SPL-5002',
    deviceId: 'dev_001',
    deviceName: 'Field Unit #1',
    serialNumber: 'SN-100037',
    model: 'OTDRPro X1',
    user: 'john@example.com',
    spliceMode: 'SM AUTO',
    fiberType: 'SMF (G.652)',
    loss: 0.14,
    leftAngle: 0.55,
    rightAngle: 0.41,
    result: 'fail',
    date: '2026-06-22',
    time: '12:10:02',
    location: 'Floor 2, North Wing, Seoul',
    fibers: fibers(2, 0.12),
  },
  {
    id: 'SPL-5003',
    deviceId: 'dev_003',
    deviceName: 'Field Unit #3',
    serialNumber: 'SN-100111',
    model: 'FiberScout 200',
    user: 'mike@example.com',
    spliceMode: 'MM AUTO',
    fiberType: 'MMF (OM3)',
    loss: 0.05,
    leftAngle: 0.18,
    rightAngle: 0.22,
    result: 'pass',
    date: '2026-06-22',
    time: '11:02:47',
    location: 'Riser B, Gangnam, Seoul',
    fibers: fibers(6, 0.04),
  },
  {
    id: 'SPL-5004',
    deviceId: 'dev_007',
    deviceName: 'Field Unit #7',
    serialNumber: 'SN-100296',
    model: 'SpliceMaster 7R',
    user: 'john@example.com',
    spliceMode: 'SM QUICK',
    fiberType: 'SMF (G.657)',
    loss: 0.02,
    leftAngle: 0.12,
    rightAngle: 0.15,
    result: 'pass',
    date: '2026-06-21',
    time: '18:30:55',
    location: 'Depot, Incheon',
    fibers: fibers(3, 0.02),
  },
  {
    id: 'SPL-5005',
    deviceId: 'dev_010',
    deviceName: 'Field Unit #10',
    serialNumber: 'SN-100407',
    model: 'FiberScout 350',
    user: 'sara@partner.com',
    workOrderId: 'JOB-1027',
    spliceMode: 'SM AUTO',
    fiberType: 'SMF (G.652)',
    loss: 0.07,
    leftAngle: 0.25,
    rightAngle: 0.28,
    result: 'pass',
    date: '2026-06-18',
    time: '17:55:09',
    location: 'Site A, Busan',
    fibers: fibers(4, 0.06),
  },
]

export function recordsForDevice(deviceId: string): DeviceRecord[] {
  return mockRecords.filter((r) => r.deviceId === deviceId)
}

export function findRecord(id: string): DeviceRecord | undefined {
  return mockRecords.find((r) => r.id === id)
}

export function recordsForWorkOrder(workOrderId: string): DeviceRecord[] {
  return mockRecords.filter((r) => r.workOrderId === workOrderId)
}
