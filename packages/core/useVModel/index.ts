import { isDef, isFunction } from '@vueuse/shared'
import type { UnwrapRef } from 'vue-demi'
import { computed, getCurrentInstance, isVue2, ref, watch } from 'vue-demi'

export type CloneFn<F, T = F> = (x: F) => T

export interface UseVModelOptions<T> {
  /**
   * When passive is set to `true`, it will use `watch` to sync with props and ref.
   * Instead of relying on the `v-model` or `.sync` to work.
   *
   * @default false
   */
  passive?: boolean
  /**
   * When eventName is set, it's value will be used to overwrite the emit event name.
   *
   * @default undefined
   */
  eventName?: string
  /**
   * Attempting to check for changes of properties in a deeply nested object or array.
   * Apply only when `passive` option is set to `true`
   *
   * @default false
   */
  deep?: boolean
  /**
   * Defining default value for return ref when no value is passed.
   *
   * @default undefined
   */
  defaultValue?: T
  /**
   * Clone when getting the value from props, shortcut for: JSON.parse(JSON.stringify(value)).
   * Default to false
   *
   * @default false
   */
  clone?: boolean | CloneFn<T>
}

const defaultCloneFn = <F, T = F>(v: F): T => JSON.parse(JSON.stringify(v))

/**
 * Shorthand for v-model binding, props + emit -> ref
 *
 * @see https://vueuse.org/useVModel
 * @param props
 * @param key (default 'value' in Vue 2 and 'modelValue' in Vue 3)
 * @param emit
 */
export function useVModel<P extends object, K extends keyof P, Name extends string>(
  props: P,
  key?: K,
  emit?: (name: Name, ...args: any[]) => void,
  options: UseVModelOptions<P[K]> = {},
) {
  const {
    clone = false,
    passive = false,
    eventName,
    deep = false,
    defaultValue,
  } = options

  const vm = getCurrentInstance()
  // @ts-expect-error mis-alignment with @vue/composition-api
  const _emit = emit || vm?.emit || vm?.$emit?.bind(vm) || vm?.proxy?.$emit?.bind(vm?.proxy)
  let event: string | undefined = eventName

  if (!key) {
    if (isVue2) {
      const modelOptions = vm?.proxy?.$options?.model
      key = modelOptions?.value || 'value' as K
      if (!eventName)
        event = modelOptions?.event || 'input'
    }
    else {
      key = 'modelValue' as K
    }
  }

  event = eventName || event || `update:${key!.toString()}`

  const getValue = () => isDef(props[key!]) ? props[key!] : defaultValue
  const cloneFn = (val: P[K]) => isFunction(clone) ? clone(val) : defaultCloneFn(val)

  if (passive) {
    const initialValue = getValue()
    const proxy = ref<P[K]>(clone && initialValue ? cloneFn(initialValue) : initialValue!)

    watch(() => props[key!], v => proxy.value = v as UnwrapRef<P[K]>)

    watch(proxy, (v) => {
      if (v !== props[key!] || deep)
        _emit(event, v)
    }, {
      deep,
    })

    return proxy
  }
  else {
    return computed<P[K]>({
      get() {
        return getValue()!
      },
      set(value) {
        _emit(event, value)
      },
    })
  }
}
