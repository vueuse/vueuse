import { useStorage } from '../useStorage'

export function useLocalStorage<T> (
  key: string,
  defaultValue?: T,
) {
  return useStorage(key, defaultValue, localStorage)
}
