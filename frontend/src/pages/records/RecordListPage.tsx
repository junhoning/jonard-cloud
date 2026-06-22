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
import { Pagination, Table } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { ListToolbar } from '../../components/ListToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { mockRecords } from '../../mock/records'
import type { DeviceRecord } from '../../mock/types'

const PAGE_SIZE = 10
const RESULT_OPTIONS = [
  { value: 'all', label: 'All results' },
  { value: 'pass', label: 'Pass' },
  { value: 'fail', label: 'Fail' },
]
const MODE_OPTIONS = [
  { value: 'all', label: 'All splice modes' },
  ...Array.from(new Set(mockRecords.map((r) => r.spliceMode))).map((m) => ({ value: m, label: m })),
]

export function RecordListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [result, setResult] = useState('all')
  const [mode, setMode] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return mockRecords.filter((r) => {
      if (result !== 'all' && r.result !== result) return false
      if (mode !== 'all' && r.spliceMode !== mode) return false
      if (!q) return true
      return (
        r.deviceName.toLowerCase().includes(q) ||
        r.serialNumber.toLowerCase().includes(q) ||
        (r.location ?? '').toLowerCase().includes(q)
      )
    })
  }, [search, result, mode])

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
            <PageTitle>Live Monitor</PageTitle>
            <PageSubtitle>{filtered.length} splice records</PageSubtitle>
          </PageTitleBlock>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <ListToolbar
          search={search}
          onSearch={resetPageAnd(setSearch)}
          searchPlaceholder="Search device, serial, location…"
          filters={[
            { key: 'result', value: result, onChange: resetPageAnd(setResult), options: RESULT_OPTIONS },
            { key: 'spliceMode', value: mode, onChange: resetPageAnd(setMode), options: MODE_OPTIONS },
          ]}
        />

        <Panel>
          <Table<DeviceRecord>
            rows={rows}
            onRowClick={(row) => navigate(`/records/${row.id}`)}
            columns={[
              { key: 'result', header: 'Result', render: (r) => <StatusBadge value={r.result} /> },
              { key: 'date', header: 'Date', render: (r) => `${r.date} ${r.time}` },
              { key: 'device', header: 'Device', render: (r) => r.deviceName },
              { key: 'serial', header: 'Serial', render: (r) => r.serialNumber },
              { key: 'mode', header: 'Splice mode', render: (r) => r.spliceMode },
              { key: 'loss', header: 'Loss (dB)', render: (r) => r.loss.toFixed(2) },
              { key: 'location', header: 'Location', render: (r) => r.location ?? '—' },
            ]}
          />
        </Panel>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </Stack>
    </>
  )
}
