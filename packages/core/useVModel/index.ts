import { computed, getCurrentInstance } from 'vue-demi'

/**
 * Shorthand for v-model binding, props + emit -> ref
 *
 * @see   {@link https://vueuse.js.org/useVModel}
 * @param props
 * @param key
 * @param emit
 */
export function useVModel<P extends object>(props: P, key: keyof P, emit?: (name: string, value: any) => void) {
  const vm = getCurrentInstance()
  // @ts-expect-error mis-alignment with @vue/composition-api
  const _emit = emit || vm?.emit || vm?.$emit?.bind(vm)

  return computed({
    get() {
      return props[key]
    },
    set(value) {
      _emit(`update:${key}`, value)
    },
  })
}
