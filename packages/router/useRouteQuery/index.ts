import type { Ref } from 'vue-demi'
import { computed, nextTick, unref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import type { MaybeRef } from '@vueuse/shared'
import type { ReactiveRouteOptions } from '../_types'

export type UseRouteQueryOptions = ReactiveRouteOptions & {
  /**
   * Whether the hash is preserved when the router query is updated, ref is also acceptable
   *
   * @default false
   */
  preserveHash?: MaybeRef<boolean>
}

export function useRouteQuery(name: string): Ref<null | string | string[]>
export function useRouteQuery<T extends null | undefined | string | string[] = null | string | string[]>(name: string, defaultValue?: T, options?: UseRouteQueryOptions): Ref<T>
export function useRouteQuery<T extends string | string[]>(
  name: string,
  defaultValue?: T,
  {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
    preserveHash = false,
  }: UseRouteQueryOptions = {},
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
      nextTick(() => {
        router[unref(mode)]({
          query: { ...route.query, [name]: v === defaultValue || v === null ? undefined : v },
          ...(unref(preserveHash) && { hash: route.hash }),
        })
      })
    },
  })
}
