import type { ReactNode } from 'react'
import {
  Home,
  HardDrive,
  Users,
  ClipboardList,
  Activity,
  FileText,
  BarChart3,
  Map,
  Building2,
  Globe,
  Boxes,
  ScrollText,
  Settings,
} from 'lucide-react'
import type { Role } from '../mock/types'

export interface MenuItem {
  key: string
  label: string
  to: string
  icon: ReactNode
}

const ICON_SIZE = 18

// Role-based menus. Labels use the docs rename table (English).
const USER_MENU: MenuItem[] = [
  { key: 'home', label: 'Home', to: '/home', icon: <Home size={ICON_SIZE} /> },
  { key: 'devices', label: 'Devices', to: '/devices', icon: <HardDrive size={ICON_SIZE} /> },
  { key: 'people', label: 'People', to: '/people', icon: <Users size={ICON_SIZE} /> },
  { key: 'work-orders', label: 'Work Orders', to: '/work-orders', icon: <ClipboardList size={ICON_SIZE} /> },
  { key: 'records', label: 'Live Monitor', to: '/records', icon: <Activity size={ICON_SIZE} /> },
  { key: 'files', label: 'Files', to: '/files', icon: <FileText size={ICON_SIZE} /> },
  { key: 'analytics', label: 'Analytics', to: '/analytics', icon: <BarChart3 size={ICON_SIZE} /> },
  { key: 'network-map', label: 'Network Map', to: '/network-map', icon: <Map size={ICON_SIZE} /> },
]

const ADMIN_MENU: MenuItem[] = [
  { key: 'home', label: 'Home', to: '/home', icon: <Home size={ICON_SIZE} /> },
  { key: 'devices', label: 'Devices', to: '/devices', icon: <HardDrive size={ICON_SIZE} /> },
  { key: 'users', label: 'Users', to: '/admin/users', icon: <Users size={ICON_SIZE} /> },
  { key: 'customers', label: 'Customers', to: '/admin/customers', icon: <Building2 size={ICON_SIZE} /> },
  { key: 'regions', label: 'Regions', to: '/admin/regions', icon: <Globe size={ICON_SIZE} /> },
  { key: 'products', label: 'Products', to: '/admin/products', icon: <Boxes size={ICON_SIZE} /> },
  { key: 'audit', label: 'Audit Log', to: '/admin/audit-logs', icon: <ScrollText size={ICON_SIZE} /> },
  { key: 'settings', label: 'Settings', to: '/admin/settings', icon: <Settings size={ICON_SIZE} /> },
]

const BRANCH_MENU: MenuItem[] = [
  { key: 'home', label: 'Home', to: '/home', icon: <Home size={ICON_SIZE} /> },
  { key: 'devices', label: 'Devices', to: '/devices', icon: <HardDrive size={ICON_SIZE} /> },
  { key: 'customers', label: 'Customers', to: '/admin/customers', icon: <Building2 size={ICON_SIZE} /> },
  { key: 'audit', label: 'Audit Log', to: '/admin/audit-logs', icon: <ScrollText size={ICON_SIZE} /> },
]

export function menusForRole(role: Role): MenuItem[] {
  if (role === 'admin') return ADMIN_MENU
  if (role === 'branch_admin') return BRANCH_MENU
  return USER_MENU
}
