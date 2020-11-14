import { computed, getCurrentInstance, isVue3 } from 'vue-demi'

export function useVModel<P extends object>(props: P, key: keyof P, emit?: (name: string, value: any) => void) {
  // @ts-expect-error mis-alignment with @vue/composition-api
  const _emit = emit || isVue3 ? getCurrentInstance()?.emit : getCurrentInstance()?.$emit

  return computed({
    get() {
      return props[key]
    },
    set(value) {
      _emit(`update:${key}`, value)
    },
  })
}
