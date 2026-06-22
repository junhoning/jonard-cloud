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
import { NewWorkOrderDialog } from '../../components/NewWorkOrderDialog'
import { workOrdersStore } from '../../store/stores'
import type { WorkOrder } from '../../mock/types'

const PAGE_SIZE = 8
const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'complete', label: 'Complete' },
  { value: 'delay', label: 'Delay' },
]

export function WorkOrderListPage() {
  const navigate = useNavigate()
  const workOrders = workOrdersStore.use()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return workOrders.filter((w) => {
      if (status !== 'all' && w.status !== status) return false
      if (!q) return true
      return (
        w.name.toLowerCase().includes(q) ||
        (w.deviceName ?? '').toLowerCase().includes(q) ||
        w.assignedTo.toLowerCase().includes(q)
      )
    })
  }, [workOrders, search, status])

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
            <PageTitle>Work Orders</PageTitle>
            <PageSubtitle>{filtered.length} job orders</PageSubtitle>
          </PageTitleBlock>
          <Button variant="solid" leadingIcon={<Plus size={16} />} onClick={() => setCreating(true)}>
            New job order
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <ListToolbar
          search={search}
          onSearch={resetPageAnd(setSearch)}
          searchPlaceholder="Search name, device, assigned…"
          filters={[
            { key: 'status', value: status, onChange: resetPageAnd(setStatus), options: STATUS_OPTIONS },
          ]}
        />

        <Panel>
          <Table<WorkOrder>
            rows={rows}
            onRowClick={(row) => navigate(`/work-orders/${row.id}`)}
            columns={[
              { key: 'status', header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
              { key: 'name', header: 'Name', render: (r) => r.name },
              { key: 'device', header: 'Device', render: (r) => r.deviceName ?? '—' },
              { key: 'assigned', header: 'Assigned to', render: (r) => r.assignedTo },
              { key: 'locations', header: 'Locations', render: (r) => r.locations.length || '—' },
              { key: 'due', header: 'Due', render: (r) => r.dueDate ?? '—' },
              { key: 'registered', header: 'Registered', render: (r) => r.registDate },
            ]}
          />
        </Panel>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </Stack>

      {creating && <NewWorkOrderDialog onClose={() => setCreating(false)} />}
    </>
  )
}
