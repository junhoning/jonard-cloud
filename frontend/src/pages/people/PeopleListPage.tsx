import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageHeader,
  PageHeaderRow,
  PageTitle,
  PageTitleBlock,
  PageSubtitle,
  Panel,
} from '@ingradient/ui/patterns'
import { Button, Pagination, Table } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { Plus } from 'lucide-react'
import { ListToolbar } from '../../components/ListToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { mockContacts } from '../../mock/contacts'
import type { Contact } from '../../mock/types'

const PAGE_SIZE = 8
const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'invited', label: 'Invited' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
]
const GROUP_OPTIONS = [
  { value: 'all', label: 'All groups' },
  ...Array.from(new Set(mockContacts.map((c) => c.groupName).filter(Boolean))).map((g) => ({
    value: g as string,
    label: g as string,
  })),
]

export function PeopleListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [group, setGroup] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return mockContacts.filter((c) => {
      if (status !== 'all' && c.status !== status) return false
      if (group !== 'all' && c.groupName !== group) return false
      if (!q) return true
      return (
        c.inviteeName.toLowerCase().includes(q) ||
        c.inviteeId.toLowerCase().includes(q) ||
        (c.company ?? '').toLowerCase().includes(q)
      )
    })
  }, [search, status, group])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function resetPageAnd<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setPage(1)
    }
  }

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>People</PageTitle>
            <PageSubtitle>{filtered.length} contacts</PageSubtitle>
          </PageTitleBlock>
          <Button variant="solid" leadingIcon={<Plus size={16} />}>
            Invite contact
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <ListToolbar
          search={search}
          onSearch={resetPageAnd(setSearch)}
          searchPlaceholder="Search name, account, company…"
          filters={[
            { key: 'group', value: group, onChange: resetPageAnd(setGroup), options: GROUP_OPTIONS },
            { key: 'status', value: status, onChange: resetPageAnd(setStatus), options: STATUS_OPTIONS },
          ]}
        />

        <Panel>
          <Table<Contact>
            rows={rows}
            onRowClick={(row) => navigate(`/people/${row.id}`)}
            columns={[
              { key: 'group', header: 'Group', render: (r) => r.groupName ?? '—' },
              { key: 'account', header: 'Account', render: (r) => r.inviteeId },
              { key: 'name', header: 'Name', render: (r) => r.inviteeName },
              { key: 'country', header: 'Country', render: (r) => r.countryName ?? '—' },
              { key: 'company', header: 'Company', render: (r) => r.company ?? '—' },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
            ]}
          />
        </Panel>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </Stack>
    </>
  )
}
