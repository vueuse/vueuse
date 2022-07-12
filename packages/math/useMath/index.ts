import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'
type Prepend<Tuple extends any[], E> = [E, ...Tuple]

// 判断类型是否为函数
type isMethod<M> = M extends (...args: any[]) => any | Function ? true : false

/**
 * 对象类型
 */
interface ObjectType { [key: string]: any }
/**
 * 获取类型的键的联合类型
 */
type KeyOf<Obj> = keyof Obj

/**
 * 将联合类型转为对应的交叉函数类型
 * @template U 联合类型
 */
type UnionToInterFunction<U> =
(U extends any ? (k: () => U) => void : never) extends
((k: infer I) => void) ? I : never

/**
 * 获取联合类型中的最后一个类型
 * @template U 联合类型
 */
type GetUnionLast<U> = UnionToInterFunction<U> extends { (): infer A } ? A : never

/**
 * 将联合类型转化为元组
 * @template Union 联合类型
 * @template T 元组类型
 */
export type UnionToTuple<Union, T extends any[] = [], Last = GetUnionLast<Union>> = {
  0: T
  1: UnionToTuple<Exclude<Union, Last>, Prepend<T, Last>>
}[[Union] extends [never] ? 0 : 1]

/**
 * 去除属性
 * @template Obj 对象类型
 * @template Union 对象的属性和函数键联合类型
 */
type ExcludeProperty<Obj extends ObjectType, Union = KeyOf<Obj>, T extends any[] = [], Last = GetUnionLast<Union>> = {
  0: T
  1: Last extends KeyOf<Obj> ? (isMethod<Obj[Last]> extends true ? ExcludeProperty<Obj, Exclude<Union, Last>, Prepend<T, Last>> : ExcludeProperty<Obj, Exclude<Union, Last>, T>): never
}[[Union] extends [never] ? 0 : 1]

/**
 * 获取函数的返回值类型
 */
type GetMethodReturn<Func> = Func extends (...args: any[]) => any ? ReturnType<Func>: never
/**
 * 获取函数的参数类型
 */
type GetMethodArgs<Func> = Func extends (...args: infer Args) => any ? Args : never

/**
 * 封装参数计算属性等
 */
type WrapperMaybeComputedRef<Args> = WrapperBasicMaybeComputedRef<Args> extends [] ? MaybeComputedRef<Args extends any[] ? Args[number]: never>[] : WrapperBasicMaybeComputedRef<Args>

type WrapperArrayMaybeComputedRef<Args> = Args extends [ infer Arg, ...infer ArgSubs] ?[MaybeComputedRef<Arg>, ...WrapperArrayMaybeComputedRef<ArgSubs> ]:
    (Args extends 'number' | 'string' | 'boolean' ? [MaybeComputedRef<Args>] : [])

type WrapperBasicMaybeComputedRef<Args> = Args extends Array<any> ? WrapperArrayMaybeComputedRef<Args> : [MaybeComputedRef<Args>]

/**
 * 封装useMath调用的返回值
 */
type MathMethods<MethodKeys extends keyof Math = ExcludeProperty<Math>[number]> = {
  [Key in MethodKeys]: (...args: WrapperMaybeComputedRef<GetMethodArgs<Math[Key]>>) => ComputedRef<GetMethodReturn<Math[Key]>>
}

type UseMath = () => MathMethods

// 没有想到较好的办法去获取Math的属性名，Object.keys(Math) => [] 获取到的是一个空数组
const MathMethodNames = ['abs',
  'acos',
  'acosh',
  'asin',
  'asinh',
  'atan',
  'atan2',
  'atanh',
  'cbrt',
  'ceil',
  'clz32',
  'cos',
  'cosh',
  'exp',
  'expm1',
  'floor',
  'fround',
  'hypot',
  'imul',
  'log',
  'log1p',
  'log2',
  'log10',
  'max',
  'min',
  'pow',
  'random',
  'round',
  'sign',
  'sin',
  'sinh',
  'sqrt',
  'tan',
  'tanh',
  'trunc']

export const useMath: UseMath = () => {
  const mathMethods: MathMethods = {} as MathMethods
  MathMethodNames.forEach((prop) => {
    const value = Math[prop as keyof Math]
    if (typeof value === 'function') {
      mathMethods[prop as ExcludeProperty<Math>[number]] = (...args: any[]) => computed<any>(() => {
        return (value as any)(...args.map(value => resolveUnref(value)))
      })
    }
  })
  return mathMethods
}
