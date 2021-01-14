import { getCurrentInstance, onMounted, onUpdated, Vue, customRef, Ref } from 'vue-demi'

/**
 * Shorthand for binding ref to template element.
 *
 * @see   {@link https://vueuse.js.org/templateRef}
 * @param key
 * @param initialValue
 */
export function templateRef<T extends Element | Element[] | typeof Vue | typeof Vue[] | null>(
  key: string,
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

  onMounted(_trigger)
  onUpdated(_trigger)

  return element as Readonly<Ref<T>>
}
