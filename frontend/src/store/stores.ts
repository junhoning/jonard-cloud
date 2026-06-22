import { createCollection } from './collection'
import { mockWorkOrders } from '../mock/workOrders'
import { mockDevices } from '../mock/devices'
import type { Device, WorkOrder } from '../mock/types'

// Session stores seeded from mock data. Newly created items appear in the
// corresponding list pages until the page is reloaded.
export const workOrdersStore = createCollection<WorkOrder>(mockWorkOrders)
export const devicesStore = createCollection<Device>(mockDevices)
