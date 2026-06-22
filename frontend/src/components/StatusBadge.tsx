import { Badge } from '@ingradient/ui/components'

// badgeTone keys: neutral | accent | success | warning | danger
type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

const TONE_MAP: Record<string, Tone> = {
  // device connection / flags
  online: 'success',
  offline: 'neutral',
  lost: 'danger',
  blocked: 'warning',
  // generic active/inactive (customers, regions, products, users)
  active: 'success',
  inactive: 'neutral',
  disabled: 'neutral',
  // work order status (legacy: draft / ongoing / complete / delay)
  draft: 'neutral',
  ongoing: 'accent',
  complete: 'success',
  delay: 'danger',
  // splice result
  pass: 'success',
  fail: 'danger',
  // user / contact status
  invited: 'warning',
  pending: 'warning',
  accepted: 'success',
  declined: 'danger',
  // roles
  admin: 'accent',
  branch_admin: 'accent',
  user: 'neutral',
  // file types
  sor: 'accent',
  sola: 'accent',
  gdm: 'accent',
  image: 'neutral',
  document: 'neutral',
  log: 'neutral',
  other: 'neutral',
}

function labelize(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function StatusBadge({ value, tone }: { value: string; tone?: Tone | string }) {
  const resolved = (tone as Tone) ?? TONE_MAP[value] ?? 'neutral'
  return <Badge $tone={resolved}>{labelize(value)}</Badge>
}
