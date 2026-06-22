import type { ReactNode } from 'react'
import { SearchField, SelectField } from '@ingradient/ui/components'
import { Inline } from '@ingradient/ui/primitives'

export interface FilterSelect {
  key: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}

interface ListToolbarProps {
  search: string
  onSearch: (value: string) => void
  searchPlaceholder?: string
  filters?: FilterSelect[]
  actions?: ReactNode
}

// Shared list toolbar: search + dropdown filters + right-aligned actions.
export function ListToolbar({
  search,
  onSearch,
  searchPlaceholder = 'Search…',
  filters = [],
  actions,
}: ListToolbarProps) {
  return (
    <Inline gap="var(--ig-space-6)" align="center" justify="space-between" wrap="wrap">
      <Inline gap="var(--ig-space-4)" align="center" wrap="wrap">
        <SearchField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          onClear={() => onSearch('')}
          placeholder={searchPlaceholder}
        />
        {filters.map((f) => (
          <SelectField
            key={f.key}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            aria-label={f.key}
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectField>
        ))}
      </Inline>
      {actions ? <Inline gap="var(--ig-space-4)">{actions}</Inline> : null}
    </Inline>
  )
}
