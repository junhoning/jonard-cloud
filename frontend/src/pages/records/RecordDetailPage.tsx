import { useNavigate, useParams } from 'react-router-dom'
import {
  PageHeader,
  PageHeaderRow,
  PageTitle,
  PageTitleBlock,
  PageSubtitle,
  Panel,
  PanelHeader,
  PanelTitle,
} from '@ingradient/ui/patterns'
import { Button, EmptyState, Table } from '@ingradient/ui/components'
import { Grid, Inline, Stack } from '@ingradient/ui/primitives'
import { ArrowLeft } from 'lucide-react'
import { Field } from '../../components/Field'
import { StatusBadge } from '../../components/StatusBadge'
import { findRecord } from '../../mock/records'
import { findWorkOrder } from '../../mock/workOrders'

export function RecordDetailPage() {
  const { recordId = '' } = useParams()
  const navigate = useNavigate()
  const record = findRecord(recordId)

  if (!record) {
    return (
      <Panel>
        <EmptyState title="Record not found" description={`No record with id ${recordId}.`} />
      </Panel>
    )
  }

  const workOrder = record.workOrderId ? findWorkOrder(record.workOrderId) : undefined

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <Inline gap="var(--ig-space-4)" align="center">
              <PageTitle>Splice record</PageTitle>
              <StatusBadge value={record.result} />
            </Inline>
            <PageSubtitle>
              {record.id} · {record.date} {record.time}
            </PageSubtitle>
          </PageTitleBlock>
          <Button variant="secondary" leadingIcon={<ArrowLeft size={16} />} onClick={() => navigate('/records')}>
            Back
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <Panel style={{ padding: 'var(--ig-space-8)' }}>
          <Grid columns="repeat(2, minmax(0, 1fr))" gap="var(--ig-space-6)">
            <Field label="Result">
              <StatusBadge value={record.result} />
            </Field>
            <Field label="Device">
              <Button variant="secondary" size="sm" onClick={() => navigate(`/devices/${record.deviceId}`)}>
                {record.deviceName}
              </Button>
            </Field>
            <Field label="Serial number" value={record.serialNumber} />
            <Field label="Model" value={record.model} />
            <Field label="Splice mode" value={record.spliceMode} />
            <Field label="Fiber type" value={record.fiberType} />
            <Field label="Loss (dB)" value={record.loss.toFixed(2)} />
            <Field label="Left / right angle" value={`${record.leftAngle.toFixed(2)}° / ${record.rightAngle.toFixed(2)}°`} />
            <Field label="Operator" value={record.user} />
            <Field label="Location" value={record.location} />
            <Field label="Related work order">
              {workOrder ? (
                <Button variant="secondary" size="sm" onClick={() => navigate(`/work-orders/${workOrder.id}`)}>
                  {workOrder.name}
                </Button>
              ) : (
                '—'
              )}
            </Field>
          </Grid>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Fibers ({record.fibers.length})</PanelTitle>
          </PanelHeader>
          {record.fibers.length ? (
            <Table
              rows={record.fibers.map((f) => ({ ...f, id: f.fiberId }))}
              columns={[
                { key: 'fiberId', header: 'Fiber', render: (f) => f.fiberId },
                { key: 'loss', header: 'Loss (dB)', render: (f) => f.loss.toFixed(2) },
                { key: 'left', header: 'Left angle', render: (f) => `${f.leftAngle.toFixed(2)}°` },
                { key: 'right', header: 'Right angle', render: (f) => `${f.rightAngle.toFixed(2)}°` },
                { key: 'result', header: 'Result', render: (f) => <StatusBadge value={f.result} /> },
              ]}
            />
          ) : (
            <EmptyState title="No fiber data" description="This record has no per-fiber measurements." />
          )}
        </Panel>
      </Stack>
    </>
  )
}
