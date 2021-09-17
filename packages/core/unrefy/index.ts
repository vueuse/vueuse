/* this implementation is original ported from https://github.com/shorwood/pompaute by Stanley Horwood */

import { unref } from 'vue-demi'
import { MaybeRef } from '../../shared/utils'

/** Unrefied method. */
type Unrefy<T> = T extends (...args: infer A) => infer R ? (...args: {
  [K in keyof A]: MaybeRef<A[K]>
}) => R : never

/**
 * Convert a plain function into a function that unref it's aguments before every call.
 * The converted function accepts refs as its arguments and returns the same value
 * the unconverted function returns, with proper typing.
 * @param fn - Source function
 */
export const unrefy = <T extends Function>(fn: T): Unrefy<T> => {
  return function(this: any, ...args: any[]) {
    return fn.apply(this, args.map(i => unref(i)))
  } as Unrefy<T>
}
