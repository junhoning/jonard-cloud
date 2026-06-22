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
import { mockProducts } from '../../mock/admin'
import type { Product } from '../../mock/types'

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const q = search.trim().toLowerCase()
  const rows = mockProducts.filter(
    (p) =>
      !q ||
      p.model.toLowerCase().includes(q) ||
      p.modelType.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q),
  )

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>Products</PageTitle>
            <PageSubtitle>{rows.length} models</PageSubtitle>
          </PageTitleBlock>
          <Button variant="solid" leadingIcon={<Plus size={16} />}>
            New product
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <ListToolbar search={search} onSearch={setSearch} searchPlaceholder="Search model, type, code…" />
        <Panel>
          <Table<Product>
            rows={rows}
            columns={[
              { key: 'code', header: 'Code', render: (r) => r.code },
              { key: 'model', header: 'Model', render: (r) => r.model },
              { key: 'type', header: 'Model type', render: (r) => r.modelType },
              { key: 'version', header: 'Version', render: (r) => r.version },
              { key: 'created', header: 'Created', render: (r) => r.createDate },
            ]}
          />
        </Panel>
      </Stack>
    </>
  )
}
