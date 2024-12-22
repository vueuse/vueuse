import type { DatabaseReference, DataSnapshot } from 'firebase/database'
import type { Ref } from 'vue'
import { tryOnScopeDispose } from '@vueuse/shared'
import { onValue } from 'firebase/database'
import { ref } from 'vue'

export interface UseRTDBOptions {
  errorHandler?: (err: Error) => void
  autoDispose?: boolean
}

/**
 * Reactive Firebase Realtime Database binding.
 *
 * @see https://vueuse.org/useRTDB
 */
export function useRTDB<T = any>(
  docRef: DatabaseReference,
  options: UseRTDBOptions = {},
) {
  const {
    errorHandler = (err: Error) => console.error(err),
    autoDispose = true,
  } = options
  const data = ref(undefined) as Ref<T | undefined>

  function update(snapshot: DataSnapshot) {
    data.value = snapshot.val()
  }

  const off = onValue(docRef, update, errorHandler)

  if (autoDispose)
    tryOnScopeDispose(() => off())

  return data
}
