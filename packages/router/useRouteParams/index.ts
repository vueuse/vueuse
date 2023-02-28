import type { Ref } from 'vue-demi'
import { computed, nextTick, unref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import type { ReactiveRouteOptions } from '../_types'

export function useRouteParams(name: string): Ref<null | string | string[]>
export function useRouteParams<T extends null | undefined | string | string[] = null | string | string[]>(name: string, defaultValue?: T, options?: ReactiveRouteOptions): Ref<T>
export function useRouteParams<T extends string | string[]>(
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
      const data = route.params[name]
      if (data == null)
        return defaultValue ?? null
      if (Array.isArray(data))
        return data.filter(Boolean)
      return data
    },
    set(v) {
      nextTick(() => {
        router[unref(mode)]({ ...route, params: { ...route.params, [name]: v } })
      })
    },
  })
}
