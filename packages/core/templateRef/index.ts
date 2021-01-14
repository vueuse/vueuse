import { getCurrentInstance, onMounted, onUpdated, Vue, customRef, ComputedRef } from 'vue-demi'

/**
 * Use template ref in Vue 2, 3
 *
 * @see   {@link https://vueuse.js.org/core/templateRef}
 * @param key
 * @param initialValue
 */
export function templateRef<T extends Element | Element[] | typeof Vue | typeof Vue[] | null>(
  key: string,
  initialValue: T | null = null,
): ComputedRef<T | null> {
  const instance = getCurrentInstance()
  let trigger = () => {}

  const element = customRef((_track, _trigger) => {
    trigger = _trigger
    return {
      get() {
        _track()
        return instance?.proxy?.$refs[key] ?? initialValue
      },
      set() {},
    }
    // mark as readonly
  }) as ComputedRef<T | null>

  onMounted(trigger)
  onUpdated(trigger)

  return element
}
