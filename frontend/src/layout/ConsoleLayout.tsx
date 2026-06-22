import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppShell,
  AppSidebar,
  PageContent,
  SidebarNav,
  TopBar,
} from '@ingradient/ui/patterns'
import { Button } from '@ingradient/ui/components'
import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { LogOut } from 'lucide-react'
import { menusForRole } from '../nav/menus'
import { ROLE_LABELS, useSession } from '../session/SessionContext'
import { RoleSwitcher } from '../session/RoleSwitcher'

export function ConsoleLayout() {
  const { loggedIn, role, user, logout } = useSession()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Mock auth guard: no fake login -> bounce to /login.
  if (!loggedIn) return <Navigate to="/login" replace />

  const items = menusForRole(role)

  return (
    <div className="jc-layout">
      <AppSidebar $width={248}>
        <Stack gap="var(--ig-space-1)">
          <Text weight={700}>Jonard Cloud</Text>
          <Text tone="muted" size="var(--ig-font-size-xs)">
            Operations Console
          </Text>
        </Stack>
        <SidebarNav>
          {items.map((m) => {
            const active = pathname === m.to || pathname.startsWith(`${m.to}/`)
            return (
              <Button
                key={m.key}
                className="jc-nav-link"
                variant={active ? 'accent' : 'secondary'}
                leadingIcon={m.icon}
                onClick={() => navigate(m.to)}
              >
                {m.label}
              </Button>
            )
          })}
        </SidebarNav>
      </AppSidebar>

      <AppShell className="jc-main">
        <TopBar>
          <Text tone="muted" size="var(--ig-font-size-sm)">
            {ROLE_LABELS[role]} workspace
          </Text>
          <Inline gap="var(--ig-space-6)" align="center">
            <RoleSwitcher />
            <Inline gap="var(--ig-space-4)" align="center">
              <Text size="var(--ig-font-size-sm)">{user.name}</Text>
              <Button variant="secondary" size="sm" leadingIcon={<LogOut size={15} />} onClick={logout}>
                Logout
              </Button>
            </Inline>
          </Inline>
        </TopBar>

        <PageContent>
          <Outlet />
        </PageContent>
      </AppShell>
    </div>
  )
}
