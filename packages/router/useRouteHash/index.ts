import { computed, unref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { ReactiveRouteOptions } from '../_types'

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
      router[unref(mode)]({ hash: v })
    },
  })
}
