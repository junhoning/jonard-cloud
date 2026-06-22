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
import { DeviceState } from '../../components/DeviceState'
import { AddDeviceDialog } from '../../components/AddDeviceDialog'
import { devicesStore } from '../../store/stores'
import { mockDevices } from '../../mock/devices'
import type { Device } from '../../mock/types'

const PAGE_SIZE = 8
const MODEL_OPTIONS = [
  { value: 'all', label: 'All models' },
  ...Array.from(new Set(mockDevices.map((d) => d.model))).map((m) => ({ value: m, label: m })),
]
const CONN_OPTIONS = [
  { value: 'all', label: 'All connections' },
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
]

export function DeviceListPage() {
  const navigate = useNavigate()
  const devices = devicesStore.use()
  const [search, setSearch] = useState('')
  const [model, setModel] = useState('all')
  const [conn, setConn] = useState('all')
  const [page, setPage] = useState(1)
  const [adding, setAdding] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return devices.filter((d) => {
      if (model !== 'all' && d.model !== model) return false
      if (conn === 'online' && !d.online) return false
      if (conn === 'offline' && d.online) return false
      if (!q) return true
      return (
        d.deviceName.toLowerCase().includes(q) ||
        d.serialNumber.toLowerCase().includes(q) ||
        d.imei.toLowerCase().includes(q) ||
        d.user.toLowerCase().includes(q)
      )
    })
  }, [devices, search, model, conn])

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
            <PageTitle>Devices</PageTitle>
            <PageSubtitle>{filtered.length} devices</PageSubtitle>
          </PageTitleBlock>
          <Button variant="solid" leadingIcon={<Plus size={16} />} onClick={() => setAdding(true)}>
            Add device
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <ListToolbar
          search={search}
          onSearch={resetPageAnd(setSearch)}
          searchPlaceholder="Search name, serial, IMEI, owner…"
          filters={[
            { key: 'model', value: model, onChange: resetPageAnd(setModel), options: MODEL_OPTIONS },
            { key: 'connection', value: conn, onChange: resetPageAnd(setConn), options: CONN_OPTIONS },
          ]}
        />

        <Panel>
          <Table<Device>
            rows={rows}
            onRowClick={(row) => navigate(`/devices/${row.id}`)}
            columns={[
              { key: 'state', header: 'State', render: (r) => <DeviceState device={r} /> },
              { key: 'name', header: 'Name', render: (r) => r.deviceName },
              { key: 'serial', header: 'Serial', render: (r) => r.serialNumber },
              { key: 'model', header: 'Model', render: (r) => r.model },
              { key: 'owner', header: 'Owner', render: (r) => r.user },
              { key: 'group', header: 'Group', render: (r) => r.groupName ?? '—' },
              { key: 'fw', header: 'Firmware', render: (r) => r.firmwareVersion },
              { key: 'arc', header: 'Arc count', render: (r) => r.currentArc.toLocaleString() },
            ]}
          />
        </Panel>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </Stack>

      {adding && <AddDeviceDialog onClose={() => setAdding(false)} />}
    </>
  )
}
