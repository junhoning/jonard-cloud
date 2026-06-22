import type { AuditLog, Customer, Product, Region } from './types'

// CustomerVo: organization with region/country + manager contact (no type/status in legacy).
export const mockCustomers: Customer[] = [
  { id: 'CUS-001', name: 'ACME Corp', manager: 'Lee Park', phone: '+82-10-1234-5678', address: '12 Teheran-ro, Gangnam, Seoul', regionName: 'Asia', countryName: 'South Korea', register: 'admin@example.com', registDate: '2024-03-11' },
  { id: 'CUS-002', name: 'Partner Networks', manager: 'Yuki Tanaka', phone: '+81-90-1111-2222', address: '3-1 Marunouchi, Tokyo', regionName: 'Asia', countryName: 'Japan', register: 'admin@example.com', registDate: '2024-06-20' },
  { id: 'CUS-003', name: 'Global Fiber Inc', manager: 'Hans Müller', phone: '+49-151-333-4444', address: 'Hauptstrasse 5, Frankfurt', regionName: 'Europe', countryName: 'Germany', register: 'admin@example.com', registDate: '2023-11-02' },
  { id: 'CUS-004', name: 'Jonard Internal', manager: 'Admin Team', phone: '+82-2-555-0000', address: 'HQ, Seoul', regionName: 'Asia', countryName: 'South Korea', register: 'admin@example.com', registDate: '2023-01-01' },
  { id: 'CUS-005', name: 'NorthLine Telecom', manager: 'Emily Brown', phone: '+1-416-555-7788', address: '500 King St W, Toronto', regionName: 'Americas', countryName: 'Canada', register: 'admin@example.com', registDate: '2025-02-15' },
]

// CountryVo: countries grouped under regions.
export const mockRegions: Region[] = [
  { id: 'KR', regionName: 'Asia', countryCode: 'KR', countryName: 'South Korea', regionDescription: 'Asia-Pacific' },
  { id: 'JP', regionName: 'Asia', countryCode: 'JP', countryName: 'Japan', regionDescription: 'Asia-Pacific' },
  { id: 'DE', regionName: 'Europe', countryCode: 'DE', countryName: 'Germany', regionDescription: 'EMEA' },
  { id: 'CA', regionName: 'Americas', countryCode: 'CA', countryName: 'Canada', regionDescription: 'North America' },
  { id: 'US', regionName: 'Americas', countryCode: 'US', countryName: 'United States', regionDescription: 'North America' },
]

// DeviceProductVo: product/model definitions.
export const mockProducts: Product[] = [
  { id: 'PRD-001', code: 'x1', model: 'OTDRPro X1', modelType: 'OTDR', version: '2.4.2', createDate: '2024-01-10' },
  { id: 'PRD-002', code: 'x2', model: 'OTDRPro X2', modelType: 'OTDR', version: '2.4.2', createDate: '2024-05-02' },
  { id: 'PRD-003', code: 'fs2', model: 'FiberScout 200', modelType: 'Inspection', version: '1.8.0', createDate: '2023-09-14' },
  { id: 'PRD-004', code: 'sm7', model: 'SpliceMaster 7R', modelType: 'Splicer', version: '3.1.1', createDate: '2024-02-20' },
  { id: 'PRD-005', code: 'fs3', model: 'FiberScout 350', modelType: 'Inspection', version: '1.9.0', createDate: '2025-03-05' },
]

// HistoryVo: operation history / audit log.
export const mockAuditLogs: AuditLog[] = [
  { id: 'HIS-001', operatorId: 'admin@example.com', operatorIp: '10.0.0.12', historyName: 'User invited', param: 'mike@example.com', result: 'success', eventTime: '2026-06-22 09:40' },
  { id: 'HIS-002', operatorId: 'admin@example.com', operatorIp: '10.0.0.12', historyName: 'Device updated', param: 'dev_005', result: 'success', eventTime: '2026-06-22 09:12' },
  { id: 'HIS-003', operatorId: 'branch@example.com', operatorIp: '10.2.4.8', historyName: 'Customer updated', param: 'CUS-002', result: 'success', eventTime: '2026-06-21 17:55' },
  { id: 'HIS-004', operatorId: 'john@example.com', operatorIp: '203.0.113.7', historyName: 'Job order created', param: 'JOB-1025', result: 'success', eventTime: '2026-06-21 10:01' },
  { id: 'HIS-005', operatorId: 'admin@example.com', operatorIp: '10.0.0.12', historyName: 'Device command', param: 'dev_005 lock', result: 'fail', reason: 'Device offline', eventTime: '2026-06-20 14:22' },
  { id: 'HIS-006', operatorId: 'jane@example.com', operatorIp: '203.0.113.9', historyName: 'Job order updated', param: 'JOB-1024', result: 'success', eventTime: '2026-06-20 13:45' },
]

export function findCustomer(id: string): Customer | undefined {
  return mockCustomers.find((c) => c.id === id)
}
