import { useSyncExternalStore } from 'react'

// Tiny in-memory collection store so mockup create/add actions actually
// reflect in the lists during a session (no backend, resets on reload).
export interface Collection<T> {
  use: () => T[]
  add: (item: T) => void
  all: () => T[]
}

export function createCollection<T>(seed: T[]): Collection<T> {
  let items = seed
  const listeners = new Set<() => void>()
  const emit = () => listeners.forEach((l) => l())

  const subscribe = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  }

  return {
    use: () => useSyncExternalStore(subscribe, () => items, () => items),
    add: (item: T) => {
      items = [item, ...items]
      emit()
    },
    all: () => items,
  }
}
