import { computed, ComputedRef, unref } from 'vue-demi'
import { MaybeRef } from '../utils'

export type Reactify<T> = T extends (...args: infer A) => infer R
  ? (...args: { [K in keyof A]: MaybeRef<A[K]> }) => ComputedRef<R>
  : never

export function reactify<T extends Function>(fn: T): Reactify<T> {
  const wrapper = function(this: any, ...args: any[]) {
    return computed(() => {
      return fn.apply(this, args.map(i => unref(i)))
    })
  } as Reactify<T>

  return wrapper
}
