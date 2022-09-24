import type { ComputedRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import { resolveUnref } from '../resolveUnref'
import type { MaybeComputedRef, MaybeRef } from '../utils'

export type Reactified<T, Computed extends boolean> = T extends (...args: infer A) => infer R
  ? (...args: { [K in keyof A]: Computed extends true ? MaybeComputedRef<A[K]> : MaybeRef<A[K]> }) => ComputedRef<R>
  : never

export interface ReactifyOptions<T extends boolean> {
  /**
   * Accept passing a function as a reactive getter
   *
   * @default true
   */
  computedGetter?: T
}

/**
 * Converts plain function into a reactive function.
 * The converted function accepts refs as it's arguments
 * and returns a ComputedRef, with proper typing.
 *
 * @param fn - Source function
 */
export function reactify<T extends Function, K extends boolean = true>(fn: T, options?: ReactifyOptions<K>): Reactified<T, K> {
  const unrefFn = options?.computedGetter === false ? unref : resolveUnref
  return function (this: any, ...args: any[]) {
    return computed(() => fn.apply(this, args.map(i => unrefFn(i))))
  } as any
}

// alias
export {
  reactify as createReactiveFn,
}
