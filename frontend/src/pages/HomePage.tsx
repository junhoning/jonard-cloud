import { useNavigate } from 'react-router-dom'
import {
  PageHeader,
  PageHeaderRow,
  PageTitle,
  PageTitleBlock,
  PageSubtitle,
  Panel,
  PanelHeader,
  PanelTitle,
  StatCard,
} from '@ingradient/ui/patterns'
import { Table } from '@ingradient/ui/components'
import { Grid, Stack } from '@ingradient/ui/primitives'
import { StatusBadge } from '../components/StatusBadge'
import { useSession } from '../session/SessionContext'
import { mockDevices } from '../mock/devices'
import { mockWorkOrders } from '../mock/workOrders'
import { mockRecords } from '../mock/records'
import { mockUsers } from '../mock/users'

export function HomePage() {
  const { role, user } = useSession()
  const navigate = useNavigate()

  const onlineCount = mockDevices.filter((d) => d.online).length
  const openWorkOrders = mockWorkOrders.filter((w) => w.status !== 'complete').length

  const isAdmin = role === 'admin'
  const isBranch = role === 'branch_admin'

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>Home</PageTitle>
            <PageSubtitle>
              Welcome back, {user.name} · {user.organizationName}
            </PageSubtitle>
          </PageTitleBlock>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-9)">
        <Grid columns="repeat(4, minmax(0, 1fr))" gap="var(--ig-space-6)">
          <StatCard label={isAdmin ? 'Total devices' : 'My devices'} value={mockDevices.length} hint={`${onlineCount} online`} />
          <StatCard label="Open work orders" value={openWorkOrders} hint="assigned / in progress" />
          <StatCard label="Recent records" value={mockRecords.length} hint="last 24h" />
          {isAdmin || isBranch ? (
            <StatCard label="Users" value={mockUsers.length} hint="in scope" />
          ) : (
            <StatCard label="Files" value={5} hint="recent uploads" />
          )}
        </Grid>

        <Grid columns="repeat(2, minmax(0, 1fr))" gap="var(--ig-space-6)">
          <Panel>
            <PanelHeader>
              <PanelTitle>Recent work orders</PanelTitle>
            </PanelHeader>
            <Table

              rows={mockWorkOrders.slice(0, 5).map((w) => ({ ...w }))}
              onRowClick={(row) => navigate(`/work-orders/${row.id}`)}
              columns={[
                { key: 'name', header: 'Name', render: (r) => r.name },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
                { key: 'assigned', header: 'Assigned to', render: (r) => r.assignedTo },
              ]}
            />
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitle>Recent records</PanelTitle>
            </PanelHeader>
            <Table

              rows={mockRecords.slice(0, 5).map((r) => ({ ...r }))}
              onRowClick={(row) => navigate(`/records/${row.id}`)}
              columns={[
                { key: 'result', header: 'Result', render: (r) => <StatusBadge value={r.result} /> },
                { key: 'device', header: 'Device', render: (r) => r.deviceName },
                { key: 'mode', header: 'Splice mode', render: (r) => r.spliceMode },
                { key: 'loss', header: 'Loss', render: (r) => r.loss.toFixed(2) },
              ]}
            />
          </Panel>
        </Grid>
      </Stack>
    </>
  )
}
