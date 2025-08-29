import type { MaybeRef } from 'vue'
import type {
  RouteParamValueRaw as _RouteParamValueRaw,
  RouteLocationNormalizedLoadedGeneric,
  RouteMap,
  RouteParams,
  useRoute,
  useRouter,
} from 'vue-router'

export type RouteParamValueRaw = _RouteParamValueRaw
export type RouteQueryValueRaw = RouteParamValueRaw | string[]
export type RouteHashValueRaw = string | null | undefined
export type RouteParamValue = string | undefined
export type RouteQueryValue = string | null | undefined | string[]
export type RouteType = ReturnType<typeof useRoute>
export type RouterType = ReturnType<typeof useRouter>
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
  route?: RouteType | RouteLocationNormalizedLoadedGeneric

  /**
   * Router instance, use `useRouter()` if not given
   */
  router?: RouterType
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
export interface ReactiveRouteOptionsWithName<V, R, N extends string | symbol = keyof RouteMap> extends ReactiveRouteOptionsWithTransform<V, R> {
  /**
   * Route instance, use `useRoute('foo')` if not given
   */
  name?: N
}

export type GetRouteParams<R extends keyof RouteMap, N = unknown>
  = N extends string
    ? N extends keyof RouteParams<R>
      ? RouteParams<R>[N]
      : RouteParamValue
    : RouteParams<R>

export type WithDefault<T, D = T> = NonNullable<T> | D

export type ToPrimitive<T>
    = T extends string ? string
      : T extends number ? number
        : T extends boolean ? boolean
          : T extends bigint ? bigint
            : T extends symbol ? symbol
              : T extends null ? null
                : T extends undefined ? undefined
                  : T extends Array<infer U> ? Array<ToPrimitive<U>>
                    : T extends object ? { [K in keyof T]: ToPrimitive<T[K]> }
                      : T
