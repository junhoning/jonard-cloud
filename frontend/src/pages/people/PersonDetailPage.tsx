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
import { DeviceState } from '../../components/DeviceState'
import { findUser } from '../../mock/users'
import { devicesStore } from '../../store/stores'

export function PersonDetailPage({ backTo = '/people' }: { backTo?: string } = {}) {
  const { personId = '', userId = '' } = useParams()
  const navigate = useNavigate()
  const person = findUser(personId || userId)
  const devices = devicesStore.use()

  if (!person) {
    return (
      <Panel>
        <EmptyState title="Person not found" description={`No person with id ${personId}.`} />
      </Panel>
    )
  }

  const ownedDevices = devices.filter((d) => d.user === person.email)

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <Inline gap="var(--ig-space-4)" align="center">
              <PageTitle>{person.name}</PageTitle>
              <StatusBadge value={person.role} />
              <StatusBadge value={person.status} />
            </Inline>
            <PageSubtitle>{person.email}</PageSubtitle>
          </PageTitleBlock>
          <Button variant="secondary" leadingIcon={<ArrowLeft size={16} />} onClick={() => navigate(backTo)}>
            Back
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <Panel style={{ padding: 'var(--ig-space-8)' }}>
          <Grid columns="repeat(2, minmax(0, 1fr))" gap="var(--ig-space-6)">
            <Field label="Name" value={person.name} />
            <Field label="Email" value={person.email} />
            <Field label="Phone" value={person.phone} />
            <Field label="Organization" value={person.organizationName} />
            <Field label="Role">
              <StatusBadge value={person.role} />
            </Field>
            <Field label="Status">
              <StatusBadge value={person.status} />
            </Field>
            <Field label="Last active" value={person.lastLoginAt} />
            <Field label="Member since" value={person.createdAt} />
          </Grid>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Owned / shared devices</PanelTitle>
          </PanelHeader>
          {ownedDevices.length ? (
            <Table
              rows={ownedDevices.map((d) => ({ ...d }))}
              onRowClick={(row) => navigate(`/devices/${row.id}`)}
              columns={[
                { key: 'state', header: 'State', render: (r) => <DeviceState device={r} /> },
                { key: 'name', header: 'Name', render: (r) => r.deviceName },
                { key: 'serial', header: 'Serial', render: (r) => r.serialNumber },
                { key: 'model', header: 'Model', render: (r) => r.model },
              ]}
            />
          ) : (
            <EmptyState title="No devices" description="This person owns no devices." />
          )}
        </Panel>
      </Stack>
    </>
  )
}
