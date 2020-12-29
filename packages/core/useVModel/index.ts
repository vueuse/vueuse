import { computed, getCurrentInstance } from 'vue-demi'

/**
 * Shorthand for v-model binding, props + emit -> ref
 *
 * @see   {@link https://vueuse.js.org/useVModel}
 * @param props
 * @param key
 * @param emit
 */
export function useVModel<P extends object, K extends keyof P>(
  props: P,
  key: K,
  emit?: (name: string, value: any) => void,
) {
  const vm = getCurrentInstance()
  // @ts-expect-error mis-alignment with @vue/composition-api
  const _emit = emit || vm?.emit || vm?.$emit?.bind(vm)

  return computed<P[K]>({
    get() {
      return props[key]
    },
    set(value) {
      _emit(`update:${key}`, value)
    },
  })
}
