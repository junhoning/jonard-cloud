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
import { mockFiles } from '../../mock/files'
import type { FileAsset } from '../../mock/types'

const PAGE_SIZE = 10
const TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  { value: 'sor', label: 'SOR' },
  { value: 'sola', label: 'SOLA' },
  { value: 'gdm', label: 'GDM' },
  { value: 'document', label: 'Document' },
  { value: 'image', label: 'Image' },
  { value: 'log', label: 'Log' },
  { value: 'other', label: 'Other' },
]

export function FileListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return mockFiles.filter((f) => {
      if (type !== 'all' && f.fileType !== type) return false
      if (!q) return true
      return (
        f.fileName.toLowerCase().includes(q) ||
        (f.deviceName ?? '').toLowerCase().includes(q) ||
        (f.serialNumber ?? '').toLowerCase().includes(q)
      )
    })
  }, [search, type])

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
            <PageTitle>Files</PageTitle>
            <PageSubtitle>{filtered.length} files</PageSubtitle>
          </PageTitleBlock>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <ListToolbar
          search={search}
          onSearch={resetPageAnd(setSearch)}
          searchPlaceholder="Search file name, device…"
          filters={[{ key: 'type', value: type, onChange: resetPageAnd(setType), options: TYPE_OPTIONS }]}
        />

        <Panel>
          <Table<FileAsset>
            rows={rows}
            onRowClick={(row) => navigate(`/files/${row.id}`)}
            columns={[
              { key: 'name', header: 'File name', render: (r) => r.fileName },
              { key: 'type', header: 'Type', render: (r) => <StatusBadge value={r.fileType} /> },
              { key: 'device', header: 'Device', render: (r) => r.deviceName ?? '—' },
              { key: 'serial', header: 'Serial', render: (r) => r.serialNumber ?? '—' },
              { key: 'by', header: 'Uploaded by', render: (r) => r.register },
              { key: 'at', header: 'Created', render: (r) => r.registDate },
            ]}
          />
        </Panel>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </Stack>
    </>
  )
}
