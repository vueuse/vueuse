import type { Ref } from 'vue-demi'
import { computed, nextTick, unref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import type { ReactiveRouteOptions } from '../_types'

let queue: Record<string, any> = {}

export function useRouteQuery(name: string): Ref<null | string | string[]>
export function useRouteQuery<T extends null | undefined | string | string[] = null | string | string[]>(name: string, defaultValue?: T, options?: ReactiveRouteOptions): Ref<T>
export function useRouteQuery<T extends string | string[]>(
  name: string,
  defaultValue?: T,
  {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
  }: ReactiveRouteOptions = {},
) {
  return computed<any>({
    get() {
      const data = route.query[name]
      if (data == null)
        return defaultValue ?? null
      if (Array.isArray(data))
        return data.filter(Boolean)
      return data
    },
    set(v) {
      queue[name] = (v === defaultValue || v === null) ? undefined : v

      nextTick(() => {
        router[unref(mode)]({ ...route, query: { ...route.query, ...queue } })
        nextTick(() => queue = {})
      })
    },
  })
}
