import type { Ref } from 'vue-demi'
import { set as _set, isVue2 } from 'vue-demi'

export function set<T>(ref: Ref<T>, value: T): void
export function set<O extends object, K extends keyof O>(target: O, key: K, value: O[K]): void

/**
 *  Shorthand for `ref.value = x`
 */
export function set(...args: any[]) {
  if (args.length === 2) {
    const [ref, value] = args
    ref.value = value
  }
  if (args.length === 3) {
    if (isVue2) {
      // @ts-expect-error case
      _set(...args)
    }
    else {
      const [target, key, value] = args
      target[key] = value
    }
  }
}
