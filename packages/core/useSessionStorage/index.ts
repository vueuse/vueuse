import { useStorage } from '../useStorage'

export function useSessionStorage<T> (
  key: string,
  defaultValue?: T,
) {
  return useStorage(key, defaultValue, sessionStorage)
}
