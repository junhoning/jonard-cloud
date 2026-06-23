import type { Contact } from './types'

// Shaped after the legacy ContactVo: invitation-based contacts grouped into contact groups.
export const mockContacts: Contact[] = [
  {
    id: 'CT-2001',
    inviteeId: 'jane@example.com',
    inviteeName: 'Jane Smith',
    groupName: 'Field Team A',
    company: 'ACME Corp',
    countryName: 'South Korea',
    inviterId: 'john@example.com',
    inviteDate: '2025-02-14',
    acceptDate: '2025-02-15',
    status: 'accepted',
  },
  {
    id: 'CT-2002',
    inviteeId: 'mike@example.com',
    inviteeName: 'Mike Lee',
    groupName: 'Field Team A',
    company: 'ACME Corp',
    countryName: 'South Korea',
    inviterId: 'john@example.com',
    inviteDate: '2026-05-30',
    status: 'invited',
  },
  {
    id: 'CT-2003',
    inviteeId: 'sara@partner.com',
    inviteeName: 'Sara Kim',
    groupName: 'Partners',
    company: 'Partner Networks',
    countryName: 'Japan',
    inviterId: 'john@example.com',
    inviteDate: '2025-09-01',
    acceptDate: '2025-09-02',
    status: 'accepted',
  },
  {
    id: 'CT-2004',
    inviteeId: 'tom@partner.com',
    inviteeName: 'Tom Park',
    groupName: 'Partners',
    company: 'Partner Networks',
    countryName: 'Japan',
    inviterId: 'john@example.com',
    inviteDate: '2025-06-11',
    status: 'declined',
  },
  {
    id: 'CT-2005',
    inviteeId: 'emily@northline.ca',
    inviteeName: 'Emily Brown',
    groupName: 'Warehouse',
    company: 'NorthLine Telecom',
    countryName: 'Canada',
    inviterId: 'john@example.com',
    inviteDate: '2026-06-10',
    status: 'invited',
  },
]

export function findContact(id: string): Contact | undefined {
  return mockContacts.find((c) => c.id === id)
}
