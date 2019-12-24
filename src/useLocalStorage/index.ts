import { ref, watch } from '../api'
import { useLocalStoragePlain } from '../useLocalStoragePlain'

export function useLocalStorage<T extends {}> (
  key: string,
  defaultValue?: T,
) {
  function stringify (data?: T) {
    return data ? JSON.stringify(data) : ''
  }

  function parse (str?: string) {
    return str ? JSON.parse(str) : (defaultValue || {})
  }

  const plain = useLocalStoragePlain(key, stringify(defaultValue))

  const state = ref<T>(parse(plain.value))

  function update () {
    plain.value = stringify(state.value as any as T)
  }

  watch(plain, () => state.value = parse(plain.value), { flush: 'sync', lazy: true })

  watch(state, update, { flush: 'sync', lazy: true })

  return { state, update }
}

export default useLocalStorage
