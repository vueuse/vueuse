import type { ModelRef, WritableComputedRef } from 'vue'
import { computed } from 'vue'

export function useObjectVModel<T extends object, M extends PropertyKey = string, G = T, S = T>(
  obj: ModelRef<T, M, G, S>,
): WritableComputedRef<T> {
  const o = computed({
    get: (): T => {
      return new Proxy(obj.value as unknown as T, {
        set(target, propertyName, newValue): boolean {
          o.value = { ...target, [propertyName]: newValue }

          return true
        },
      })
    },
    set: (newValue: T): void => {
      obj.value = newValue as unknown as S
    },
  })

  return o
}
