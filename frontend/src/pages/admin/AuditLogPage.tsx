import { useMemo, useState } from 'react'
import {
  PageHeader,
  PageHeaderRow,
  PageTitle,
  PageTitleBlock,
  PageSubtitle,
  Panel,
} from '@ingradient/ui/patterns'
import { Table } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { ListToolbar } from '../../components/ListToolbar'
import { StatusBadge } from '../../components/StatusBadge'
import { mockAuditLogs } from '../../mock/admin'
import type { AuditLog } from '../../mock/types'

const RESULT_OPTIONS = [
  { value: 'all', label: 'All results' },
  { value: 'success', label: 'Success' },
  { value: 'fail', label: 'Fail' },
]

export function AuditLogPage() {
  const [search, setSearch] = useState('')
  const [result, setResult] = useState('all')

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return mockAuditLogs.filter((l) => {
      if (result !== 'all' && l.result !== result) return false
      if (!q) return true
      return (
        l.operatorId.toLowerCase().includes(q) ||
        l.historyName.toLowerCase().includes(q) ||
        (l.param ?? '').toLowerCase().includes(q)
      )
    })
  }, [search, result])

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>Audit Log</PageTitle>
            <PageSubtitle>{rows.length} entries</PageSubtitle>
          </PageTitleBlock>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <ListToolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search operator, event, param…"
          filters={[{ key: 'result', value: result, onChange: setResult, options: RESULT_OPTIONS }]}
        />
        <Panel>
          <Table<AuditLog>
            rows={rows}
            columns={[
              { key: 'at', header: 'Time', render: (r) => r.eventTime },
              { key: 'operator', header: 'Operator', render: (r) => r.operatorId },
              { key: 'event', header: 'Event', render: (r) => r.historyName },
              { key: 'param', header: 'Target', render: (r) => r.param ?? '—' },
              { key: 'result', header: 'Result', render: (r) => <StatusBadge value={r.result} /> },
              { key: 'ip', header: 'IP', render: (r) => r.operatorIp },
            ]}
          />
        </Panel>
      </Stack>
    </>
  )
}
