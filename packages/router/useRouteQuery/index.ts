import { computed, Ref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'

export interface RouteQueryOptions {
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

export function useRouteQuery(name: string): Ref<null | string | string[]>
export function useRouteQuery<T extends null | string | string[] = null | string | string[]>(name: string, defaultValue?: T, options?: RouteQueryOptions): Ref<T>
export function useRouteQuery<T extends string | string[]>(
  name: string,
  defaultValue?: T,
  {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
  }: RouteQueryOptions = {},
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
      router[mode]({ query: { [name]: v } })
    },
  })
}
