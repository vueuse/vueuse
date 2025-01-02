import type { Component, Ref } from 'vue'
import { tryOnMounted } from '@vueuse/shared'
import { customRef, getCurrentInstance, onUpdated } from 'vue'

/**
 * Shorthand for binding ref to template element.
 *
 * @see https://vueuse.org/templateRef
 * @param key
 * @param initialValue
 */
export function templateRef<T extends HTMLElement | SVGElement | Component | null, Keys extends string = string>(
  key: Keys,
  initialValue: T | null = null,
): Readonly<Ref<T>> {
  const instance = getCurrentInstance()
  let _trigger = () => {}

  const element = customRef((track, trigger) => {
    _trigger = trigger
    return {
      get() {
        track()
        return instance?.proxy?.$refs[key] ?? initialValue
      },
      set() {},
    }
  })

  tryOnMounted(_trigger)
  onUpdated(_trigger)

  return element as Readonly<Ref<T>>
}
