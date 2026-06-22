import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Panel } from '@ingradient/ui/patterns'
import { Button, TextField, PasswordField } from '@ingradient/ui/components'
import { Inline, Stack, Text, Heading } from '@ingradient/ui/primitives'
import type { Role } from '../../mock/types'
import { ROLE_LABELS, useSession } from '../../session/SessionContext'

// Mock login: no validation. Pick a role and enter — purely to demo the flow.
export function LoginPage() {
  const { login } = useSession()
  const navigate = useNavigate()
  const [email, setEmail] = useState('john@example.com')
  const [password, setPassword] = useState('demo')
  const [role, setRole] = useState<Role>('user')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    login(role)
    navigate('/home', { replace: true })
  }

  return (
    <div className="jc-login">
      <Panel className="jc-login-card" style={{ padding: 'var(--ig-space-9)' }}>
        <form onSubmit={submit}>
          <Stack gap="var(--ig-space-9)">
            <Stack gap="var(--ig-space-1)">
              <Heading level={2}>Jonard Cloud</Heading>
              <Text tone="muted">Operations Console — sign in</Text>
            </Stack>

            <Stack gap="var(--ig-space-4)">
              <Text size="0.82rem" tone="secondary">
                Email
              </Text>
              <TextField value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </Stack>

            <Stack gap="var(--ig-space-4)">
              <Text size="0.82rem" tone="secondary">
                Password
              </Text>
              <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
            </Stack>

            <Stack gap="var(--ig-space-4)">
              <Text size="0.82rem" tone="secondary">
                Sign in as (mock)
              </Text>
              <Inline gap="var(--ig-space-4)">
                {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant={role === r ? 'accent' : 'secondary'}
                    size="sm"
                    onClick={() => setRole(r)}
                  >
                    {ROLE_LABELS[r]}
                  </Button>
                ))}
              </Inline>
            </Stack>

            <Button type="submit" variant="solid">
              Sign in
            </Button>

            <Text tone="muted" size="0.75rem">
              Mockup only — any credentials work. CAPTCHA / 2FA come later.
            </Text>
          </Stack>
        </form>
      </Panel>
    </div>
  )
}
