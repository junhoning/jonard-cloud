import { useState } from 'react'
import { DialogShell, Button, TextField, TextareaField, SelectField, useToast } from '@ingradient/ui/components'
import { Stack, Text } from '@ingradient/ui/primitives'
import { workOrdersStore, devicesStore } from '../store/stores'
import { useSession } from '../session/SessionContext'
import type { WorkOrder } from '../mock/types'

export function NewWorkOrderDialog({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  const { user } = useSession()
  const devices = devicesStore.use()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [assignedTo, setAssignedTo] = useState(user.email)

  function submit() {
    if (!name.trim()) {
      toast('Name is required.', { tone: 'warning' })
      return
    }
    const device = devices.find((d) => d.id === deviceId)
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    const wo: WorkOrder = {
      id: `JOB-${Date.now()}`,
      name: name.trim(),
      status: 'draft',
      deviceId: device?.id,
      deviceName: device?.deviceName,
      assignedTo: assignedTo.trim() || user.email,
      registerName: user.name,
      registDate: now,
      description: description.trim() || undefined,
      contacts: [],
      locations: [],
    }
    workOrdersStore.add(wo)
    toast('Job order created.', { tone: 'success' })
    onClose()
  }

  return (
    <DialogShell
      title="New work order"
      description="Create a work order (mock — kept until you reload)."
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="solid" onClick={submit}>
            Create
          </Button>
        </>
      }
    >
      <Stack gap="var(--ig-space-6)">
        <Field label="Name">
          <TextField value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Replace connector" />
        </Field>
        <Field label="Description">
          <TextareaField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Optional details"
          />
        </Field>
        <Field label="Device">
          <SelectField value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
            <option value="">No device</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.deviceName} · {d.serialNumber}
              </option>
            ))}
          </SelectField>
        </Field>
        <Field label="Assigned to">
          <TextField value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
        </Field>
      </Stack>
    </DialogShell>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack gap="var(--ig-space-2)">
      <Text size="var(--ig-font-size-sm)" tone="secondary">
        {label}
      </Text>
      {children}
    </Stack>
  )
}
