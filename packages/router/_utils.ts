import type { MaybeRefOrGetter } from 'vue'
import type { ReactiveRouteOptionsWithTransform } from './_types'

export function parseArgs<T, K = T>(args: any[]) {
  const maybeName = args[0]
  let name: string | undefined
  let defaultValue: MaybeRefOrGetter<T> | undefined
  let options: ReactiveRouteOptionsWithTransform<T, K>
  if (typeof maybeName === 'string') {
    name = args[0]
    defaultValue = args[1]
    options = args[2] ?? {}
  }
  else {
    defaultValue = args[0]
    options = args[1] ?? {}
  }
  return {
    name,
    defaultValue,
    options,
  }
}
