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
import { mockCustomers } from '../../mock/admin'
import type { Customer } from '../../mock/types'

const PAGE_SIZE = 8
const REGION_OPTIONS = [
  { value: 'all', label: 'All regions' },
  ...Array.from(new Set(mockCustomers.map((c) => c.regionName))).map((r) => ({ value: r, label: r })),
]

export function CustomersListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return mockCustomers.filter((c) => {
      if (region !== 'all' && c.regionName !== region) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.countryName.toLowerCase().includes(q) ||
        c.manager.toLowerCase().includes(q)
      )
    })
  }, [search, region])

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
            <PageTitle>Customers</PageTitle>
            <PageSubtitle>{filtered.length} organizations</PageSubtitle>
          </PageTitleBlock>
          <Button variant="solid" leadingIcon={<Plus size={16} />}>
            New customer
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <ListToolbar
          search={search}
          onSearch={resetPageAnd(setSearch)}
          searchPlaceholder="Search name, country, manager…"
          filters={[{ key: 'region', value: region, onChange: resetPageAnd(setRegion), options: REGION_OPTIONS }]}
        />

        <Panel>
          <Table<Customer>
            rows={rows}
            onRowClick={(row) => navigate(`/admin/customers/${row.id}`)}
            columns={[
              { key: 'name', header: 'Name', render: (r) => r.name },
              { key: 'region', header: 'Region', render: (r) => r.regionName },
              { key: 'country', header: 'Country', render: (r) => r.countryName },
              { key: 'manager', header: 'Manager', render: (r) => r.manager },
              { key: 'phone', header: 'Phone', render: (r) => r.phone },
            ]}
          />
        </Panel>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </Stack>
    </>
  )
}
