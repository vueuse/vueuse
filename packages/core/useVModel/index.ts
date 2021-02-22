import { computed, getCurrentInstance, isVue2 } from 'vue-demi'

/**
 * Shorthand for v-model binding, props + emit -> ref
 *
 * @see   {@link https://vueuse.org/useVModel}
 * @param props
 * @param key (default 'value' in Vue 2 and 'modelValue' in Vue 3)
 * @param emit
 */
export function useVModel<P extends object, K extends keyof P, Name extends string>(
  props: P,
  key?: K,
  emit?: (name: Name, ...args: any[]) => void,
) {
  const vm = getCurrentInstance()
  // @ts-expect-error mis-alignment with @vue/composition-api
  const _emit = emit || vm?.emit || vm?.$emit?.bind(vm)
  let event: string | undefined

  if (!key) {
    if (isVue2) {
      const modelOptions = vm?.proxy?.$options?.model
      key = modelOptions?.value || 'value' as K
      event = modelOptions?.event || 'input'
    }
    else {
      key = 'modelValue' as K
    }
  }

  event = event || `update:${key}`

  return computed<P[K]>({
    get() {
      return props[key!]
    },
    set(value) {
      _emit(event, value)
    },
  })
}
