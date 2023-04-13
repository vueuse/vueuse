import type { MaybeRef } from '@vueuse/shared'
import type { useRoute, useRouter } from 'vue-router'

type QueryValue = null | undefined | string | string[]

export type DefaultTransformFn<T = Required<QueryValue>> = (val: Required<QueryValue>) => T

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

export interface ReactiveRouteOptionsWithTransform<T extends DefaultTransformFn = DefaultTransformFn> extends ReactiveRouteOptions {
  /**
   * Function to transform data before return
   */
  transform?: T
}
