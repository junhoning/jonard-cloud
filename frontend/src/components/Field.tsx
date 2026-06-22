import type { ReactNode } from 'react'
import { Stack, Text } from '@ingradient/ui/primitives'

// Label + value pair for detail "overview" sections.
export function Field({
  label,
  value,
  children,
}: {
  label: string
  value?: ReactNode
  children?: ReactNode
}) {
  return (
    <Stack gap="var(--ig-space-1)">
      <Text tone="muted" size="var(--ig-font-size-xs)">
        {label}
      </Text>
      <div>{children ?? value ?? '—'}</div>
    </Stack>
  )
}
