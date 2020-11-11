import { computed } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'

export interface RouteHashOptions {
  /**
   * Mode to update the router query
   *
   * @default 'replace'
   */
  mode?: 'replace' | 'push'

  /**
   * Route instance, use `useRoute()` if not given
   */
  route?: ReturnType<typeof useRoute>

  /**
   * Router instance, use `useRouter()` if not given
   */
  router?: ReturnType<typeof useRouter>
}

export function useRouteHash(
  defaultValue?: string,
  {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
  }: RouteHashOptions = {},
) {
  return computed<string>({
    get() {
      return route.hash ?? defaultValue
    },
    set(v) {
      router[mode]({ hash: v })
    },
  })
}
