import { computed, nextTick } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { toValue } from '@vueuse/shared'
import type { ReactiveRouteOptions } from '../_types'

export function useRouteHash(
  defaultValue?: string,
  {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
  }: ReactiveRouteOptions = {},
) {
  return computed<string>({
    get() {
      return route.hash ?? defaultValue
    },
    set(v) {
      nextTick(() => {
        router[toValue(mode)]({ ...route, hash: v })
      })
    },
  })
}
