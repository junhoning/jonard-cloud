import { PageHeader, PageHeaderRow, PageTitle, PageTitleBlock, PageSubtitle, Panel } from '@ingradient/ui/patterns'
import { EmptyState } from '@ingradient/ui/components'
import { Construction } from 'lucide-react'

// Generic "coming soon" screen so every sidebar menu is clickable in the mockup.
export function Placeholder({ title }: { title: string }) {
  return (
    <>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>{title}</PageTitle>
            <PageSubtitle>Planned screen — not built yet in this mockup</PageSubtitle>
          </PageTitleBlock>
        </PageHeaderRow>
      </PageHeader>
      <Panel>
        <EmptyState
          icon={<Construction size={28} />}
          title={`${title} is coming soon`}
          description="This page is part of the MVP plan and will be filled in once the core screens are confirmed."
        />
      </Panel>
    </>
  )
}
