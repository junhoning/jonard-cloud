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
import { mockUsers } from '../../mock/users'
import type { User } from '../../mock/types'

const PAGE_SIZE = 8
const ROLE_OPTIONS = [
  { value: 'all', label: 'All roles' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'branch_admin', label: 'Branch Admin' },
]

export function AdminUsersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return mockUsers.filter((u) => {
      if (role !== 'all' && u.role !== role) return false
      if (!q) return true
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    })
  }, [search, role])

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
            <PageTitle>Users</PageTitle>
            <PageSubtitle>{filtered.length} users</PageSubtitle>
          </PageTitleBlock>
          <Button variant="solid" leadingIcon={<Plus size={16} />}>
            Invite user
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <ListToolbar
          search={search}
          onSearch={resetPageAnd(setSearch)}
          searchPlaceholder="Search name, email…"
          filters={[{ key: 'role', value: role, onChange: resetPageAnd(setRole), options: ROLE_OPTIONS }]}
        />

        <Panel>
          <Table<User>
            rows={rows}
            onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
            columns={[
              { key: 'account', header: 'Account', render: (r) => r.email },
              { key: 'name', header: 'Name', render: (r) => r.name },
              { key: 'role', header: 'Role', render: (r) => <StatusBadge value={r.role} /> },
              { key: 'region', header: 'Region', render: (r) => r.region ?? '—' },
              { key: 'regType', header: 'Register type', render: (r) => r.registerType ?? '—' },
              { key: 'last', header: 'Last login', render: (r) => r.lastLoginAt ?? '—' },
            ]}
          />
        </Panel>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </Stack>
    </>
  )
}
