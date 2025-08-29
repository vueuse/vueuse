import type { MaybeRefOrGetter } from 'vue'
import type { ReactiveRouteOptionsWithName } from './_types'

export function parseArgs<T, K = T>(args: any[]) {
  const maybeName = args[0]
  let name: string | undefined
  let defaultValue: MaybeRefOrGetter<T> | undefined
  let options: ReactiveRouteOptionsWithName<T, K>
  if (typeof maybeName === 'string') {
    name = args[0]
    defaultValue = args[1]
    options = args[2] || {}
  }
  else {
    defaultValue = args[0] || {}
    options = args[1] || {}
  }
  return {
    name,
    defaultValue,
    options,
  }
}

export function isEmpty(value: any, options?: {
  defaultValue?: unknown
  exclude?: unknown[]
}) {
  const { defaultValue, exclude = [] } = options ?? {}
  if (exclude.includes(value)) {
    return false
  }
  if (
    [null, undefined, ''].includes(value)
    || (
      typeof value === 'object'
      && Object.keys(value).length === 0
    )
    || value === defaultValue
    || (
      value
      && defaultValue
      && typeof value === 'object'
      && typeof defaultValue === 'object'
      && JSON.stringify(value) === JSON.stringify(defaultValue)
    )
  ) {
    return true
  }
  return false
}
