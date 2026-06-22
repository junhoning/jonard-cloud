import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Role, User } from '../mock/types'
import { mockUsers } from '../mock/users'

// Mock session. No real auth — the role drives which menus/data show.
// A "logged in" flag gates the console behind the (fake) login screen.

const USER_BY_ROLE: Record<Role, User> = {
  user: mockUsers.find((u) => u.id === 'user_001')!,
  admin: mockUsers.find((u) => u.id === 'user_admin')!,
  branch_admin: mockUsers.find((u) => u.id === 'user_branch')!,
}

interface SessionValue {
  loggedIn: boolean
  role: Role
  user: User
  login: (role?: Role) => void
  logout: () => void
  setRole: (role: Role) => void
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [role, setRole] = useState<Role>('user')

  const value = useMemo<SessionValue>(
    () => ({
      loggedIn,
      role,
      user: USER_BY_ROLE[role],
      login: (r) => {
        if (r) setRole(r)
        setLoggedIn(true)
      },
      logout: () => setLoggedIn(false),
      setRole,
    }),
    [loggedIn, role],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}

export const ROLE_LABELS: Record<Role, string> = {
  user: 'User',
  admin: 'Admin',
  branch_admin: 'Branch Admin',
}
