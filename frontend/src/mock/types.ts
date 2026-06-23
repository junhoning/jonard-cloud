// Domain types for Jonard Cloud mockup. Shapes follow docs/domain-model.md.
// These describe FAKE data only — no backend, no real persistence yet.

export type Role = 'user' | 'admin' | 'branch_admin'

// legacy Job Order statuses (common-code driven): draft / ongoing / complete / delay.
export type WorkOrderStatus = 'draft' | 'ongoing' | 'complete' | 'delay'
// Splice outcome (DeviceRecordVo.result / FiberVo.result).
export type SpliceResult = 'pass' | 'fail'
export type FileType = 'image' | 'document' | 'sor' | 'sola' | 'gdm' | 'log' | 'other'
export type UserStatus = 'active' | 'invited' | 'disabled' | 'pending'
// Contact invitation status (ContactVo.statusCode/statusName).
export type ContactStatus = 'invited' | 'accepted' | 'declined'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: Role
  organizationId: string
  organizationName: string
  branchId?: string
  status: UserStatus
  region?: string
  registerType?: string
  lastLoginAt?: string
  createdAt: string
}

// Mirrors legacy DeviceVo. State is modelled as legacy flags (online/lost/blocked),
// not a single status enum. `user` is the owner account.
export interface Device {
  id: string
  deviceName: string
  serialNumber: string
  imei: string
  model: string
  modelCode: string
  user: string
  groupName?: string
  customerName?: string
  countryName?: string
  firmwareVersion: string
  latestVersion: string
  online: boolean
  lost: boolean
  blocked: boolean
  battery?: number
  totalArc: number
  currentArc: number
  formattedAddress?: string
  latitude?: number
  longitude?: number
  productionDate: string
  registDate: string
  lastMaintenance?: string
}

// A contact assigned to a job order (JobOrderContactMapVo).
export interface JobContact {
  userId: string
  userName: string
  registDate: string
}

// A job order work location (JobOrderLocationVo).
export interface JobLocation {
  latitude: number
  longitude: number
  address: string
}

// Mirrors legacy JobOrderVo. `id` stands in for seqNum. No priority field in legacy.
export interface WorkOrder {
  id: string
  name: string
  status: WorkOrderStatus
  deviceId?: string
  deviceName?: string
  assignedTo: string
  registerName: string
  registDate: string
  dueDate?: string
  startDate?: string
  completedDate?: string
  description?: string
  contacts: JobContact[]
  locations: JobLocation[]
}

// A single fiber's splice measurement (FiberVo).
export interface FiberMeasurement {
  fiberId: string
  loss: number
  leftAngle: number
  rightAngle: number
  result: SpliceResult
}

// A splice record / monitor entry (DeviceRecordVo). legacy records are fiber-splice
// measurements, not generic events — hence loss/angles/spliceMode/result.
export interface DeviceRecord {
  id: string
  deviceId: string
  deviceName: string
  serialNumber: string
  model: string
  user: string
  workOrderId?: string
  spliceMode: string
  fiberType: string
  loss: number
  leftAngle: number
  rightAngle: number
  result: SpliceResult
  date: string
  time: string
  location?: string
  fibers: FiberMeasurement[]
}

// Mirrors legacy FileVo + file grid: device-centric file management.
export interface FileAsset {
  id: string
  fileName: string
  fileType: FileType
  deviceId?: string
  deviceName?: string
  deviceModel?: string
  serialNumber?: string
  register: string
  registDate: string
}

// Mirrors legacy ContactVo: an invitation-based contact relationship.
export interface Contact {
  id: string
  inviteeId: string
  inviteeName: string
  groupName?: string
  company?: string
  countryName?: string
  inviterId: string
  inviteDate: string
  acceptDate?: string
  status: ContactStatus
}

// Mirrors legacy CustomerVo: an organization with region/country + a manager contact.
export interface Customer {
  id: string
  name: string
  manager: string
  phone: string
  address: string
  regionName: string
  countryName: string
  register: string
  registDate: string
}

// Mirrors legacy CountryVo: a country grouped under a region.
export interface Region {
  id: string
  regionName: string
  countryCode: string
  countryName: string
  regionDescription?: string
}

// Mirrors legacy DeviceProductVo: a device product/model definition.
export interface Product {
  id: string
  code: string
  model: string
  modelType: string
  version: string
  createDate: string
}

// Mirrors legacy HistoryVo: an operation history / audit entry.
export interface AuditLog {
  id: string
  operatorId: string
  operatorIp: string
  historyName: string
  param?: string
  result: 'success' | 'fail'
  reason?: string
  eventTime: string
}
