import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastProvider } from '@ingradient/ui/components'
import { SessionProvider } from './session/SessionContext'
import { ConsoleLayout } from './layout/ConsoleLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { HomePage } from './pages/HomePage'
import { DeviceListPage } from './pages/devices/DeviceListPage'
import { DeviceDetailPage } from './pages/devices/DeviceDetailPage'
import { WorkOrderListPage } from './pages/work-orders/WorkOrderListPage'
import { WorkOrderDetailPage } from './pages/work-orders/WorkOrderDetailPage'
import { RecordListPage } from './pages/records/RecordListPage'
import { RecordDetailPage } from './pages/records/RecordDetailPage'
import { PeopleListPage } from './pages/people/PeopleListPage'
import { ContactDetailPage } from './pages/people/ContactDetailPage'
import { FileListPage } from './pages/files/FileListPage'
import { FileDetailPage } from './pages/files/FileDetailPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { CustomersListPage } from './pages/admin/CustomersListPage'
import { CustomerDetailPage } from './pages/admin/CustomerDetailPage'
import { RegionsPage } from './pages/admin/RegionsPage'
import { ProductsPage } from './pages/admin/ProductsPage'
import { AuditLogPage } from './pages/admin/AuditLogPage'
import { PersonDetailPage as AdminUserDetailPage } from './pages/people/PersonDetailPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { Placeholder } from './pages/Placeholder'

export function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated console (mock guard inside ConsoleLayout) */}
          <Route element={<ConsoleLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/devices" element={<DeviceListPage />} />
            <Route path="/devices/:deviceId" element={<DeviceDetailPage />} />

            {/* Not built yet — placeholders so every sidebar menu is clickable */}
            <Route path="/people" element={<PeopleListPage />} />
            <Route path="/people/:personId" element={<ContactDetailPage />} />
            <Route path="/work-orders" element={<WorkOrderListPage />} />
            <Route path="/work-orders/:workOrderId" element={<WorkOrderDetailPage />} />
            <Route path="/records" element={<RecordListPage />} />
            <Route path="/records/:recordId" element={<RecordDetailPage />} />
            <Route path="/files" element={<FileListPage />} />
            <Route path="/files/:fileId" element={<FileDetailPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/network-map" element={<Placeholder title="Network Map" />} />

            {/* Admin / branch */}
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:userId" element={<AdminUserDetailPage backTo="/admin/users" />} />
            <Route path="/admin/customers" element={<CustomersListPage />} />
            <Route path="/admin/customers/:customerId" element={<CustomerDetailPage />} />
            <Route path="/admin/regions" element={<RegionsPage />} />
            <Route path="/admin/products" element={<ProductsPage />} />
            <Route path="/admin/audit-logs" element={<AuditLogPage />} />
            <Route path="/admin/settings" element={<Placeholder title="Settings" />} />
            <Route path="/account" element={<Placeholder title="Account" />} />
          </Route>

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        </BrowserRouter>
      </ToastProvider>
    </SessionProvider>
  )
}
