import { useMemo } from 'react'
import {
  PageHeader,
  PageHeaderRow,
  PageTitle,
  PageTitleBlock,
  PageSubtitle,
  StatCard,
  BarChartCard,
  PieChartCard,
} from '@ingradient/ui/patterns'
import { Grid, Stack } from '@ingradient/ui/primitives'
import { useSession } from '../session/SessionContext'
import { devicesStore } from '../store/stores'
import { mockRecords } from '../mock/records'

function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const k = key(item)
    acc[k] = (acc[k] ?? 0) + 1
    return acc
  }, {})
}

function toPie(counts: Record<string, number>): Array<{ name: string; value: number }> {
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

// Mirrors the legacy Overview (splice statistics over time + results) and admin
// statistics (devices by country). legacy records are fiber-splice measurements,
// so analytics here is splice-centric rather than generic event counts.
export function AnalyticsPage() {
  const { role } = useSession()
  const devices = devicesStore.use()
  const scope = role === 'admin' ? 'System-wide' : 'My'

  // Overview: total splices by date (legacy total-splice chart, day granularity).
  const splicesByDate = useMemo(() => {
    const counts = countBy(mockRecords, (r) => r.date)
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))
  }, [])

  // Overview: splice pass/fail outcome.
  const resultPie = useMemo(() => toPie(countBy(mockRecords, (r) => r.result)), [])

  // Admin statistics: devices by country, devices by connection.
  const devicesByCountry = useMemo(() => {
    const counts = countBy(devices, (d) => d.countryName ?? 'Unknown')
    return Object.entries(counts).map(([country, count]) => ({ country, count }))
  }, [devices])

  const connectionPie = useMemo(
    () => toPie(countBy(devices, (d) => (d.online ? 'online' : 'offline'))),
    [devices],
  )

  const passCount = mockRecords.filter((r) => r.result === 'pass').length
  const passRate = mockRecords.length ? Math.round((passCount / mockRecords.length) * 100) : 0
  const onlineDevices = devices.filter((d) => d.online).length

  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>Analytics</PageTitle>
            <PageSubtitle>{scope} splice & device overview</PageSubtitle>
          </PageTitleBlock>
        </PageHeaderRow>
      </PageHeader>

      <Stack gap="var(--ig-space-8)">
        <Grid columns="repeat(4, minmax(0, 1fr))" gap="var(--ig-space-6)">
          <StatCard label="Total splices" value={mockRecords.length} hint="recorded" />
          <StatCard label="Pass rate" value={`${passRate}%`} hint={`${passCount} passed`} />
          <StatCard label="Devices" value={devices.length} hint={`${onlineDevices} online`} />
          <StatCard label="Countries" value={devicesByCountry.length} hint="with devices" />
        </Grid>

        <BarChartCard
          title="Total splices over time"
          description="Splice records per day"
          data={splicesByDate}
          xKey="date"
          series={[{ key: 'count', label: 'Splices' }]}
          height={280}
        />

        <Grid columns="repeat(2, minmax(0, 1fr))" gap="var(--ig-space-6)">
          <PieChartCard title="Splice results" data={resultPie} height={260} />
          <PieChartCard title="Devices by connection" data={connectionPie} height={260} />
        </Grid>

        <BarChartCard
          title="Devices by country"
          data={devicesByCountry}
          xKey="country"
          series={[{ key: 'count', label: 'Devices' }]}
          height={280}
        />
      </Stack>
    </>
  )
}
