import { useState } from 'react'
import { DialogShell, Button, TextField, SelectField, useToast } from '@ingradient/ui/components'
import { Stack, Text } from '@ingradient/ui/primitives'
import { devicesStore } from '../store/stores'
import { useSession } from '../session/SessionContext'
import type { Device } from '../mock/types'

const MODELS: Array<[string, string]> = [
  ['OTDRPro X1', 'x1'],
  ['OTDRPro X2', 'x2'],
  ['FiberScout 200', 'fs2'],
  ['SpliceMaster 7R', 'sm7'],
  ['FiberScout 350', 'fs3'],
]

export function AddDeviceDialog({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  const { user } = useSession()

  const [name, setName] = useState('')
  const [serialNumber, setSerial] = useState('')
  const [imei, setImei] = useState('')
  const [model, setModel] = useState(MODELS[0][0])

  function submit() {
    if (!name.trim() || !serialNumber.trim()) {
      toast('Name and serial number are required.', { tone: 'warning' })
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    const modelCode = MODELS.find(([m]) => m === model)?.[1] ?? ''
    const device: Device = {
      id: `dev_${Date.now()}`,
      deviceName: name.trim(),
      serialNumber: serialNumber.trim(),
      imei: imei.trim() || '—',
      model,
      modelCode,
      user: user.email,
      groupName: undefined,
      customerName: user.organizationName,
      countryName: undefined,
      firmwareVersion: '0.0.0',
      latestVersion: '2.4.2',
      online: false,
      lost: false,
      blocked: false,
      battery: undefined,
      totalArc: 0,
      currentArc: 0,
      formattedAddress: undefined,
      productionDate: today,
      registDate: today,
      lastMaintenance: undefined,
    }
    devicesStore.add(device)
    toast('Device added.', { tone: 'success' })
    onClose()
  }

  return (
    <DialogShell
      title="Add device"
      description="Register a device (mock — kept until you reload)."
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="solid" onClick={submit}>
            Add
          </Button>
        </>
      }
    >
      <Stack gap="var(--ig-space-6)">
        <Field label="Name">
          <TextField value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Field Unit #19" />
        </Field>
        <Field label="Serial number">
          <TextField value={serialNumber} onChange={(e) => setSerial(e.target.value)} placeholder="SN-..." />
        </Field>
        <Field label="IMEI">
          <TextField value={imei} onChange={(e) => setImei(e.target.value)} placeholder="IMEI-..." />
        </Field>
        <Field label="Model">
          <SelectField value={model} onChange={(e) => setModel(e.target.value)}>
            {MODELS.map(([m]) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </SelectField>
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
