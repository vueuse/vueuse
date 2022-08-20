import { computed, nextTick, unref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import type { MaybeRef } from '@vueuse/shared'
import type { ReactiveRouteOptions } from '../_types'

export type UseRouteHashOptions = ReactiveRouteOptions & {
  /**
   * Whether the query is preserved when the router hash is updated, ref is also acceptable
   *
   * @default false
   */
  preserveQuery?: MaybeRef<boolean>
}

export function useRouteHash(
  defaultValue?: string,
  {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
    preserveQuery = false,
  }: UseRouteHashOptions = {},
) {
  return computed<string>({
    get() {
      return route.hash ?? defaultValue
    },
    set(v) {
      nextTick(() => {
        router[unref(mode)]({
          hash: v,
          ...(unref(preserveQuery) && { query: route.query }),
        })
      })
    },
  })
}
