import type { WritableComputedRef } from 'vue-demi'
import { computed, ref } from 'vue-demi'

type ExpiringRef<T> = WritableComputedRef<T | undefined>

export function useExpiringRef<T>(initialMs?: number): [ExpiringRef<T>, (ms?: number) => void] {
  const valueRef = ref<T>()
  let ms = initialMs
  let timeout: ReturnType<typeof setTimeout> | undefined

  const setValTimeout = (newMs?: number) => {
    if (newMs !== undefined)
      ms = newMs
    if (timeout)
      clearTimeout(timeout)
    if (ms) {
      timeout = setTimeout(() => {
        valueRef.value = undefined
        timeout = undefined
      }, ms)
    }
  }

  const compValue = computed({
    get() {
      return valueRef.value
    },
    set(newVal: T | undefined) {
      valueRef.value = newVal
      setValTimeout()
    },
  })

  return [compValue, setValTimeout]
}

export function useAsyncExpiringRef<T>(fn: () => [T, number] | Promise<[T, number]>) {
  const [value, setMs] = useExpiringRef<T | Promise<T>>()

  const generateValue = async () => {
    const [val, ms] = await fn()
    setMs(ms)
    return val
  }

  return computed(() => {
    if (!value.value)
      value.value = generateValue()

    return value.value
  })
}
