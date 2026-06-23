import type { FileAsset } from './types'

// Shaped after the legacy FileVo + file grid: files are tied to a device (sn/model/name),
// with a fileType, register (uploader) and registDate (create time). No size field.
export const mockFiles: FileAsset[] = [
  {
    id: 'FL-3001',
    fileName: 'trace_001.sor',
    fileType: 'sor',
    deviceId: 'dev_001',
    deviceName: 'Field Unit #1',
    deviceModel: 'OTDRPro X1',
    serialNumber: 'SN-100037',
    register: 'john@example.com',
    registDate: '2026-06-22 13:31',
  },
  {
    id: 'FL-3002',
    fileName: 'splice_report.pdf',
    fileType: 'document',
    deviceId: 'dev_001',
    deviceName: 'Field Unit #1',
    deviceModel: 'OTDRPro X1',
    serialNumber: 'SN-100037',
    register: 'john@example.com',
    registDate: '2026-06-22 13:40',
  },
  {
    id: 'FL-3003',
    fileName: 'measurement.sola',
    fileType: 'sola',
    deviceId: 'dev_003',
    deviceName: 'Field Unit #3',
    deviceModel: 'FiberScout 200',
    serialNumber: 'SN-100111',
    register: 'mike@example.com',
    registDate: '2026-06-20 09:14',
  },
  {
    id: 'FL-3004',
    fileName: 'gdm_export.gdm',
    fileType: 'gdm',
    deviceId: 'dev_007',
    deviceName: 'Field Unit #7',
    deviceModel: 'SpliceMaster 7R',
    serialNumber: 'SN-100296',
    register: 'john@example.com',
    registDate: '2026-06-21 18:31',
  },
  {
    id: 'FL-3005',
    fileName: 'site_photo.jpg',
    fileType: 'image',
    deviceId: 'dev_010',
    deviceName: 'Field Unit #10',
    deviceModel: 'FiberScout 350',
    serialNumber: 'SN-100407',
    register: 'sara@partner.com',
    registDate: '2026-06-18 17:58',
  },
]

export function filesForDevice(deviceId: string): FileAsset[] {
  return mockFiles.filter((f) => f.deviceId === deviceId)
}

export function findFile(id: string): FileAsset | undefined {
  return mockFiles.find((f) => f.id === id)
}
