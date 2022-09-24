/* This implementation is original ported from https://github.com/shorwood/pompaute by Stanley Horwood */

import { unref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'

export type UnrefFn<T> = T extends (...args: infer A) => infer R
  ? (...args: { [K in keyof A]: MaybeRef<A[K]> }) => R
  : never

/**
 * Make a plain function accepting ref and raw values as arguments.
 * Returns the same value the unconverted function returns, with proper typing.
 */
export const createUnrefFn = <T extends Function>(fn: T): UnrefFn<T> => {
  return function (this: any, ...args: any[]) {
    return fn.apply(this, args.map(i => unref(i)))
  } as UnrefFn<T>
}
