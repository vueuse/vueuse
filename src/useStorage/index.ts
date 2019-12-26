import { ref, watch } from '../api'
import { useStoragePlain } from '../useStoragePlain'

export function useStorage<T extends {}> (
  key: string,
  defaultValue?: T,
  storage: Storage = localStorage,
) {
  function stringify (data?: T) {
    return data ? JSON.stringify(data) : ''
  }

  function parse (str?: string) {
    return str ? JSON.parse(str) : (defaultValue || {})
  }

  const plain = useStoragePlain(key, stringify(defaultValue), storage)

  const state = ref<T>(parse(plain.value))

  function update () {
    plain.value = stringify(state.value as any as T)
  }

  watch(plain, () => state.value = parse(plain.value), { flush: 'sync', lazy: true })

  watch(state, update, { flush: 'sync', lazy: true })

  return { state, update }
}
