import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively Math
 *
 * @see https://vueuse.org/useMath
 * @param methodName
 * @param {...any[]} args
 */

type MathMethod = keyof Math

type MathMethodReturn<M extends MathMethod> = Math[M] extends (...args: any) => any ? ReturnType<Math[M]> : Math[M]

type MathMethodArgs<M extends MathMethod> = Math[M] extends (...args: infer Args) => any ? Args : unknown

type WrapperArrayMaybeComputedRef<Args> = Args extends [ infer Arg, ...infer ArgSubs] ?[MaybeComputedRef<Arg>, ...WrapperArrayMaybeComputedRef<ArgSubs> ]:
    (Args extends 'number' | 'string' | 'boolean' ? [MaybeComputedRef<Args>] : [])

type WrapperBasicMaybeComputedRef<Args> = Args extends Array<any> ? WrapperArrayMaybeComputedRef<Args> : [MaybeComputedRef<Args>]

type WrapperMaybeComputedRef<Args> = WrapperBasicMaybeComputedRef<Args> extends [] ? MaybeComputedRef<Args extends any[] ? Args[number]: never>[] : WrapperBasicMaybeComputedRef<Args>

export const useMath = <Method extends MathMethod> (methodName: Method, ...args: WrapperMaybeComputedRef<MathMethodArgs<Method>>) => {
  if (Math[methodName] === undefined)
    throw new Error(`Math.${methodName.toString()} does not exist`)
  return computed<MathMethodReturn<Method>>(() => {
    const value = Math[methodName]
    if (typeof value === 'function')
      return (value as Function)(...(args as any[]).map(value => resolveUnref(value)))
    else
      return value
  })
}

