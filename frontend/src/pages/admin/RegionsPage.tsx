import { useState } from 'react'
import {
  PageHeader,
  PageHeaderRow,
  PageTitle,
  PageTitleBlock,
  PageSubtitle,
  Panel,
} from '@ingradient/ui/patterns'
import { Button, Table } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { Plus } from 'lucide-react'
import { ListToolbar } from '../../components/ListToolbar'
import { mockRegions } from '../../mock/admin'
import type { Region } from '../../mock/types'

export function RegionsPage() {
  const [search, setSearch] = useState('')
  const q = search.trim().toLowerCase()
  const rows = mockRegions.filter(
    (r) =>
      !q ||
      r.regionName.toLowerCase().includes(q) ||
      r.countryName.toLowerCase().includes(q) ||
      r.countryCode.toLowerCase().includes(q),
  )

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>Regions</PageTitle>
            <PageSubtitle>{rows.length} countries</PageSubtitle>
          </PageTitleBlock>
          <Button variant="solid" leadingIcon={<Plus size={16} />}>
            New country
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <ListToolbar search={search} onSearch={setSearch} searchPlaceholder="Search region, country…" />
        <Panel>
          <Table<Region>
            rows={rows}
            columns={[
              { key: 'region', header: 'Region', render: (r) => r.regionName },
              { key: 'country', header: 'Country', render: (r) => r.countryName },
              { key: 'code', header: 'Code', render: (r) => r.countryCode },
              { key: 'desc', header: 'Description', render: (r) => r.regionDescription ?? '—' },
            ]}
          />
        </Panel>
      </Stack>
    </>
  )
}
