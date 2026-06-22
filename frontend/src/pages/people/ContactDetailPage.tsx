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
import { findContact } from '../../mock/contacts'
import { devicesStore } from '../../store/stores'

export function ContactDetailPage() {
  const { personId = '' } = useParams()
  const navigate = useNavigate()
  const contact = findContact(personId)
  const devices = devicesStore.use()

  if (!contact) {
    return (
      <Panel>
        <EmptyState title="Contact not found" description={`No contact with id ${personId}.`} />
      </Panel>
    )
  }

  // Devices this contact owns (shared visibility in legacy is via device-user maps).
  const sharedDevices = devices.filter((d) => d.user === contact.inviteeId)

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <Inline gap="var(--ig-space-4)" align="center">
              <PageTitle>{contact.inviteeName}</PageTitle>
              <StatusBadge value={contact.status} />
            </Inline>
            <PageSubtitle>{contact.inviteeId}</PageSubtitle>
          </PageTitleBlock>
          <Button variant="secondary" leadingIcon={<ArrowLeft size={16} />} onClick={() => navigate('/people')}>
            Back
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-6)">
        <Panel style={{ padding: 'var(--ig-space-8)' }}>
          <Grid columns="repeat(2, minmax(0, 1fr))" gap="var(--ig-space-6)">
            <Field label="Name" value={contact.inviteeName} />
            <Field label="Account" value={contact.inviteeId} />
            <Field label="Group" value={contact.groupName} />
            <Field label="Company" value={contact.company} />
            <Field label="Country" value={contact.countryName} />
            <Field label="Status">
              <StatusBadge value={contact.status} />
            </Field>
            <Field label="Invited by" value={contact.inviterId} />
            <Field label="Invited" value={contact.inviteDate} />
            <Field label="Accepted" value={contact.acceptDate} />
          </Grid>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Shared devices</PanelTitle>
          </PanelHeader>
          {sharedDevices.length ? (
            <Table
              rows={sharedDevices.map((d) => ({ ...d }))}
              onRowClick={(row) => navigate(`/devices/${row.id}`)}
              columns={[
                { key: 'state', header: 'State', render: (r) => <DeviceState device={r} /> },
                { key: 'name', header: 'Name', render: (r) => r.deviceName },
                { key: 'serial', header: 'Serial', render: (r) => r.serialNumber },
                { key: 'model', header: 'Model', render: (r) => r.model },
              ]}
            />
          ) : (
            <EmptyState title="No shared devices" description="No devices shared with this contact." />
          )}
        </Panel>
      </Stack>
    </>
  )
}
