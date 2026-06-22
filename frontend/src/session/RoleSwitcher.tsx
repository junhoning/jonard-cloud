import { useNavigate } from 'react-router-dom'
import { SelectField } from '@ingradient/ui/components'
import { Inline, Text } from '@ingradient/ui/primitives'
import type { Role } from '../mock/types'
import { ROLE_LABELS, useSession } from './SessionContext'

// Mock-only control: instantly preview each role's menus/data without re-login.
export function RoleSwitcher() {
  const { role, setRole } = useSession()
  const navigate = useNavigate()
  return (
    <Inline gap="var(--ig-space-4)" align="center">
      <Text tone="muted" size="0.8rem">
        Role
      </Text>
      <SelectField
        value={role}
        onChange={(e) => {
          setRole(e.target.value as Role)
          // Land on Home so the view matches the new role's menus.
          navigate('/home')
        }}
        aria-label="Switch role"
      >
        {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </SelectField>
    </Inline>
  )
}
