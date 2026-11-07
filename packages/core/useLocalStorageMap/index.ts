import type { RemovableRef } from '@vueuse/shared'
import type { UseStorageOptions } from '../useStorage'
import { useStorage } from '../useStorage'

export function useLocalStorageMap<K, V>(
  key: string,
  initialValue?: Map<K, V>,
  options?: UseStorageOptions<Map<K, V>>,
): RemovableRef<Map<K, V>> {
  const serializer = {
    read: (v: string): Map<K, V> => new Map(JSON.parse(v) as [K, V][]),
    write: (v: Map<K, V>) => JSON.stringify(Array.from(v.entries())),
  }

  return useStorage(key, new Map(initialValue), localStorage, {
    serializer,
    ...options,
  })
}
