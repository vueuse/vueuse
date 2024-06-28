import type { VueUseFunction } from './types'

export function getCategories(functions: VueUseFunction[]): string[] {
  return uniq(
    functions
      .filter(i => !i.internal)
      .map(i => i.category)
      .filter(Boolean),
  ).sort(
    (a, b) => (a[0] === '@' && b[0] !== '@')
      ? 1
      : (b[0] === '@' && a[0] !== '@')
          ? -1
          : a.localeCompare(b),
  )
}

export function uniq<T extends any[]>(a: T) {
  return Array.from(new Set(a))
}
