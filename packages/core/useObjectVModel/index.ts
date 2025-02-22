import type { ModelRef, WritableComputedRef } from 'vue'
import { computed } from 'vue'

export function useObjectVModel<T extends object, M extends PropertyKey = string, G = T, S = T>(
  obj: ModelRef<T, M, G, S>,
): WritableComputedRef<T> {
  function createDeepProxy(target: T, update: (newValue: any) => void): T {
    return new Proxy(target, {
      get(target: T, p, receiver) {
        const value = Reflect.get(target, p, receiver)

        if (typeof value === 'object') {
          return createDeepProxy(value as T, (newChildValue: any) => {
            const targetCopy = Array.isArray(target) ? [...target] : { ...target }

            targetCopy[p] = newChildValue
            update(targetCopy)

            return newChildValue
          })
        }

        return value
      },
      set(target, p, newValue, receiver) {
        const targetCopy = Array.isArray(target) ? [...target] : { ...target }

        targetCopy[p] = newValue
        update(targetCopy)

        return Reflect.set(target, p, newValue, receiver)
      },
    })
  }

  const o = computed({
    get: (): T => {
      return createDeepProxy(obj.value as unknown as T, (newValue: T) => {
        o.value = newValue
      })
    },
    set: (newValue: T): void => {
      obj.value = newValue as unknown as S
    },
  })

  return o
}
