import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  PageHeader,
  PageHeaderRow,
  PageTitle,
  PageTitleBlock,
  PageSubtitle,
  Panel,
} from '@ingradient/ui/patterns'
import { Button, EmptyState, Table, Tabs } from '@ingradient/ui/components'
import { Grid, Inline, Stack } from '@ingradient/ui/primitives'
import { ArrowLeft } from 'lucide-react'
import { Field } from '../../components/Field'
import { StatusBadge } from '../../components/StatusBadge'
import { findWorkOrder } from '../../mock/workOrders'
import { recordsForWorkOrder } from '../../mock/records'

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'contacts', label: 'Contacts' },
  { value: 'locations', label: 'Locations' },
  { value: 'records', label: 'Records' },
]

export function WorkOrderDetailPage() {
  const { workOrderId = '' } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const wo = findWorkOrder(workOrderId)

  if (!wo) {
    return (
      <Panel>
        <EmptyState title="Job order not found" description={`No job order with id ${workOrderId}.`} />
      </Panel>
    )
  }

  const records = recordsForWorkOrder(wo.id)

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <Inline gap="var(--ig-space-4)" align="center">
              <PageTitle>{wo.name}</PageTitle>
              <StatusBadge value={wo.status} />
            </Inline>
            <PageSubtitle>Job order {wo.id}</PageSubtitle>
          </PageTitleBlock>
          <Inline gap="var(--ig-space-4)">
            <Button variant="secondary" leadingIcon={<ArrowLeft size={16} />} onClick={() => navigate('/work-orders')}>
              Back
            </Button>
            <Button variant="secondary" disabled>
              Edit
            </Button>
          </Inline>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <Tabs items={TABS} value={tab} onChange={setTab} variant="underline" />

        {tab === 'overview' && (
          <Panel style={{ padding: 'var(--ig-space-8)' }}>
            <Stack gap="var(--ig-space-8)">
              <Field label="Description" value={wo.description ?? 'No description provided.'} />
              <Grid columns="repeat(2, minmax(0, 1fr))" gap="var(--ig-space-6)">
                <Field label="Status">
                  <StatusBadge value={wo.status} />
                </Field>
                <Field label="Device">
                  {wo.deviceId ? (
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/devices/${wo.deviceId}`)}>
                      {wo.deviceName}
                    </Button>
                  ) : (
                    '—'
                  )}
                </Field>
                <Field label="Assigned to" value={wo.assignedTo} />
                <Field label="Registered by" value={wo.registerName} />
                <Field label="Registered" value={wo.registDate} />
                <Field label="Due date" value={wo.dueDate} />
                <Field label="Started" value={wo.startDate} />
                <Field label="Completed" value={wo.completedDate} />
              </Grid>
            </Stack>
          </Panel>
        )}

        {tab === 'contacts' && (
          <Panel>
            {wo.contacts.length ? (
              <Table
                rows={wo.contacts.map((c) => ({ ...c, id: c.userId }))}
                columns={[
                  { key: 'userId', header: 'Account', render: (c) => c.userId },
                  { key: 'userName', header: 'Name', render: (c) => c.userName },
                  { key: 'registDate', header: 'Added', render: (c) => c.registDate },
                ]}
              />
            ) : (
              <EmptyState title="No contacts" description="No contacts assigned to this job order." />
            )}
          </Panel>
        )}

        {tab === 'locations' && (
          <Panel>
            {wo.locations.length ? (
              <Table
                rows={wo.locations.map((l, i) => ({ ...l, id: i }))}
                columns={[
                  { key: 'address', header: 'Address', render: (l) => l.address },
                  { key: 'lat', header: 'Latitude', render: (l) => l.latitude.toFixed(4) },
                  { key: 'lng', header: 'Longitude', render: (l) => l.longitude.toFixed(4) },
                ]}
              />
            ) : (
              <EmptyState title="No locations" description="No work locations recorded for this job order." />
            )}
          </Panel>
        )}

        {tab === 'records' && (
          <Panel>
            {records.length ? (
              <Table
                rows={records.map((r) => ({ ...r }))}
                onRowClick={(row) => navigate(`/records/${row.id}`)}
                columns={[
                  { key: 'result', header: 'Result', render: (r) => <StatusBadge value={r.result} /> },
                  { key: 'mode', header: 'Splice mode', render: (r) => r.spliceMode },
                  { key: 'loss', header: 'Loss (dB)', render: (r) => r.loss.toFixed(2) },
                  { key: 'time', header: 'Date', render: (r) => `${r.date} ${r.time}` },
                ]}
              />
            ) : (
              <EmptyState title="No records" description="No records linked to this job order." />
            )}
          </Panel>
        )}
      </Stack>
    </>
  )
}
