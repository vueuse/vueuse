import type { MaybeRef } from '@vueuse/shared'
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
   * Function to transform data before return
   */
  transform?: (val: V) => R
}
