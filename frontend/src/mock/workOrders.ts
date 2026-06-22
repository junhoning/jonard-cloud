import type { WorkOrder } from './types'

// Shaped after legacy JobOrderVo: seqNum-style id, status (draft/ongoing/complete/delay),
// assigned contacts, and work locations. No priority field in legacy.
export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'JOB-1024',
    name: 'Quarterly maintenance',
    status: 'ongoing',
    deviceId: 'dev_001',
    deviceName: 'Field Unit #1',
    assignedTo: 'jane@example.com',
    registerName: 'John Doe',
    registDate: '2026-06-20 10:00',
    dueDate: '2026-06-25',
    startDate: '2026-06-22 08:00',
    description: 'Scheduled maintenance for Field Unit #1.',
    contacts: [
      { userId: 'jane@example.com', userName: 'Jane Smith', registDate: '2026-06-20 10:01' },
      { userId: 'mike@example.com', userName: 'Mike Lee', registDate: '2026-06-20 10:02' },
    ],
    locations: [
      { latitude: 37.5665, longitude: 126.978, address: 'Floor 2, North Wing, Seoul' },
    ],
  },
  {
    id: 'JOB-1025',
    name: 'Replace damaged connector',
    status: 'draft',
    deviceId: 'dev_003',
    deviceName: 'Field Unit #3',
    assignedTo: 'mike@example.com',
    registerName: 'John Doe',
    registDate: '2026-06-21 09:30',
    dueDate: '2026-06-23',
    description: 'Connector replacement at riser B.',
    contacts: [{ userId: 'mike@example.com', userName: 'Mike Lee', registDate: '2026-06-21 09:31' }],
    locations: [{ latitude: 37.4979, longitude: 127.0276, address: 'Riser B, Gangnam, Seoul' }],
  },
  {
    id: 'JOB-1026',
    name: 'Firmware upgrade survey',
    status: 'delay',
    deviceId: 'dev_007',
    deviceName: 'Field Unit #7',
    assignedTo: 'john@example.com',
    registerName: 'Alice Admin',
    registDate: '2026-06-18 16:20',
    dueDate: '2026-06-20',
    description: 'Survey units due for firmware upgrade.',
    contacts: [{ userId: 'john@example.com', userName: 'John Doe', registDate: '2026-06-18 16:21' }],
    locations: [],
  },
  {
    id: 'JOB-1027',
    name: 'On-site splice inspection',
    status: 'complete',
    deviceId: 'dev_010',
    deviceName: 'Field Unit #10',
    assignedTo: 'sara@partner.com',
    registerName: 'Ben Branch',
    registDate: '2026-06-16 11:00',
    dueDate: '2026-06-18',
    startDate: '2026-06-18 09:00',
    completedDate: '2026-06-18 19:05',
    description: 'Inspect splice quality on-site.',
    contacts: [{ userId: 'sara@partner.com', userName: 'Sara Kim', registDate: '2026-06-16 11:01' }],
    locations: [
      { latitude: 35.1796, longitude: 129.0756, address: 'Site A, Busan' },
      { latitude: 35.1587, longitude: 129.16, address: 'Site B, Busan' },
    ],
  },
  {
    id: 'JOB-1028',
    name: 'Lost device follow-up',
    status: 'ongoing',
    deviceId: 'dev_005',
    deviceName: 'Field Unit #5',
    assignedTo: 'jane@example.com',
    registerName: 'Alice Admin',
    registDate: '2026-06-15 08:30',
    dueDate: '2026-06-24',
    description: 'Follow up on geofence breach report.',
    contacts: [{ userId: 'jane@example.com', userName: 'Jane Smith', registDate: '2026-06-15 08:31' }],
    locations: [],
  },
]

export function workOrdersForDevice(deviceId: string): WorkOrder[] {
  return mockWorkOrders.filter((w) => w.deviceId === deviceId)
}

export function findWorkOrder(id: string): WorkOrder | undefined {
  return mockWorkOrders.find((w) => w.id === id)
}

export interface TimelineEntry {
  at: string
  actor: string
  text: string
}

// Synthesized activity timeline for a work order (mock).
export function timelineFor(wo: WorkOrder): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    { at: wo.registDate, actor: wo.registerName, text: `Created job order "${wo.name}".` },
    { at: wo.registDate, actor: wo.registerName, text: `Assigned to ${wo.assignedTo}.` },
  ]
  if (wo.startDate) entries.push({ at: wo.startDate, actor: wo.assignedTo, text: 'Work started.' })
  if (wo.status === 'complete' && wo.completedDate) {
    entries.push({ at: wo.completedDate, actor: wo.assignedTo, text: 'Marked as complete.' })
  }
  if (wo.status === 'delay') {
    entries.push({ at: wo.dueDate ?? wo.registDate, actor: 'system', text: 'Past due — marked as delayed.' })
  }
  return entries
}
