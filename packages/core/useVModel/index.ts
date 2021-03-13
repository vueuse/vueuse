import { computed, getCurrentInstance, isVue2, ref, watch } from 'vue-demi'

export interface VModelOptions {
  /**
   * When passive is set to `true`, it will use `watch` to sync with props and ref.
   * Instead of relying on the `v-model` or `.sync` to work.
   *
   * @default false
   */
  passive?: boolean
}

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
  options: VModelOptions = {},
) {
  const {
    passive = false,
  } = options

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

  if (passive) {
    const proxy = ref<P[K]>(props[key!])

    watch(() => props[key!], v => proxy.value = v as any)
    watch(proxy, (v) => {
      if (v !== props[key!])
        _emit(event, v)
    })

    return proxy
  }
  else {
    return computed<P[K]>({
      get() {
        return props[key!]
      },
      set(value) {
        _emit(event, value)
      },
    })
  }
}
