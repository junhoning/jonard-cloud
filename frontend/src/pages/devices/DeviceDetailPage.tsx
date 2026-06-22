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
import { DeviceState } from '../../components/DeviceState'
import { findDevice } from '../../mock/devices'
import { workOrdersForDevice } from '../../mock/workOrders'
import { recordsForDevice } from '../../mock/records'
import { filesForDevice } from '../../mock/files'

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'records', label: 'Records' },
  { value: 'work-orders', label: 'Work Orders' },
  { value: 'files', label: 'Files' },
  { value: 'access', label: 'Access' },
]

export function DeviceDetailPage() {
  const { deviceId = '' } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const device = findDevice(deviceId)

  if (!device) {
    return (
      <Panel>
        <EmptyState title="Device not found" description={`No device with id ${deviceId}.`} />
      </Panel>
    )
  }

  const records = recordsForDevice(device.id)
  const workOrders = workOrdersForDevice(device.id)
  const files = filesForDevice(device.id)

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <Inline gap="var(--ig-space-4)" align="center">
              <PageTitle>{device.deviceName}</PageTitle>
              <DeviceState device={device} />
            </Inline>
            <PageSubtitle>
              {device.model} · {device.serialNumber}
            </PageSubtitle>
          </PageTitleBlock>
          <Inline gap="var(--ig-space-4)">
            <Button variant="secondary" leadingIcon={<ArrowLeft size={16} />} onClick={() => navigate('/devices')}>
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
            <Grid columns="repeat(2, minmax(0, 1fr))" gap="var(--ig-space-6)">
              <Field label="Serial number" value={device.serialNumber} />
              <Field label="IMEI" value={device.imei} />
              <Field label="Model" value={`${device.model} (${device.modelCode})`} />
              <Field label="Firmware" value={`${device.firmwareVersion} (latest ${device.latestVersion})`} />
              <Field label="Owner" value={device.user} />
              <Field label="Group" value={device.groupName} />
              <Field label="Customer" value={device.customerName} />
              <Field label="Country" value={device.countryName} />
              <Field label="State">
                <DeviceState device={device} />
              </Field>
              <Field label="Battery" value={device.battery != null ? `${device.battery}%` : undefined} />
              <Field label="Arc count" value={`${device.currentArc.toLocaleString()} / ${device.totalArc.toLocaleString()}`} />
              <Field label="Location" value={device.formattedAddress} />
              <Field label="Last maintenance" value={device.lastMaintenance} />
              <Field label="Registered" value={device.registDate} />
            </Grid>
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
              <EmptyState title="No records" description="This device has no records yet." />
            )}
          </Panel>
        )}

        {tab === 'work-orders' && (
          <Panel>
            {workOrders.length ? (
              <Table

                rows={workOrders.map((w) => ({ ...w }))}
                onRowClick={(row) => navigate(`/work-orders/${row.id}`)}
                columns={[
                  { key: 'name', header: 'Name', render: (r) => r.name },
                  { key: 'status', header: 'Status', render: (r) => <StatusBadge value={r.status} /> },
                  { key: 'assigned', header: 'Assigned to', render: (r) => r.assignedTo },
                  { key: 'due', header: 'Due', render: (r) => r.dueDate ?? '—' },
                ]}
              />
            ) : (
              <EmptyState title="No work orders" description="This device has no work orders yet." />
            )}
          </Panel>
        )}

        {tab === 'files' && (
          <Panel>
            {files.length ? (
              <Table

                rows={files.map((f) => ({ ...f }))}
                columns={[
                  { key: 'name', header: 'File name', render: (r) => r.fileName },
                  { key: 'type', header: 'Type', render: (r) => <StatusBadge value={r.fileType} /> },
                  { key: 'by', header: 'Uploaded by', render: (r) => r.register },
                  { key: 'at', header: 'Created', render: (r) => r.registDate },
                ]}
              />
            ) : (
              <EmptyState title="No files" description="This device has no files yet." />
            )}
          </Panel>
        )}

        {tab === 'access' && (
          <Panel>
            <EmptyState
              title="Sharing & permissions"
              description="Device sharing (view / operate / manage) will be configured here. Read-only in this mockup."
            />
          </Panel>
        )}
      </Stack>
    </>
  )
}
