import type { MaybeRef } from 'vue'
import type { RouteParamValueRaw, useRoute, useRouter } from 'vue-router'

export type RouteQueryValueRaw = RouteParamValueRaw | string[]

export type RouteHashValueRaw = string | null | undefined

export interface ReactiveRouteOptions {
  /**
   * Mode to update the router query, ref is also acceptable
   *
   * @default 'replace'
   */
  mode?: MaybeRef<'replace' | 'push'>

  /**
   * Route instance, use `useRoute()` if not given
   */
  route?: ReturnType<typeof useRoute>

  /**
   * Router instance, use `useRouter()` if not given
   */
  router?: ReturnType<typeof useRouter>
}

export interface ReactiveRouteOptionsWithTransform<V, R> extends ReactiveRouteOptions {
  /**
   * Function to transform data before return, or an object with one or both functions:
   * `get` to transform data before returning, and `set` to transform data before setting
   */
  transform?:
    | ((val: V) => R)
    | ({
      get?: (value: V) => R
      set?: (value: R) => V
    })
}
