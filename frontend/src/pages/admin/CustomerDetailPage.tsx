import { useNavigate, useParams } from 'react-router-dom'
import {
  PageHeader,
  PageHeaderRow,
  PageTitle,
  PageTitleBlock,
  PageSubtitle,
  Panel,
} from '@ingradient/ui/patterns'
import { Button, EmptyState } from '@ingradient/ui/components'
import { Grid } from '@ingradient/ui/primitives'
import { ArrowLeft } from 'lucide-react'
import { Field } from '../../components/Field'
import { findCustomer } from '../../mock/admin'

export function CustomerDetailPage() {
  const { customerId = '' } = useParams()
  const navigate = useNavigate()
  const customer = findCustomer(customerId)

  if (!customer) {
    return (
      <Panel>
        <EmptyState title="Customer not found" description={`No customer with id ${customerId}.`} />
      </Panel>
    )
  }

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>{customer.name}</PageTitle>
            <PageSubtitle>
              {customer.regionName} · {customer.countryName}
            </PageSubtitle>
          </PageTitleBlock>
          <Button variant="secondary" leadingIcon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/customers')}>
            Back
          </Button>
        </PageHeaderRow>
      </PageHeader>

      <Panel style={{ padding: 'var(--ig-space-8)' }}>
        <Grid columns="repeat(2, minmax(0, 1fr))" gap="var(--ig-space-6)">
          <Field label="Name" value={customer.name} />
          <Field label="Manager" value={customer.manager} />
          <Field label="Phone" value={customer.phone} />
          <Field label="Address" value={customer.address} />
          <Field label="Region" value={customer.regionName} />
          <Field label="Country" value={customer.countryName} />
          <Field label="Registered by" value={customer.register} />
          <Field label="Registered" value={customer.registDate} />
        </Grid>
      </Panel>
    </>
  )
}
