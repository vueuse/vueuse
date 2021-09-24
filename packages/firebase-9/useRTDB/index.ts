import { DatabaseReference, DataSnapshot, off, onValue } from 'firebase/database'
import { Ref, ref } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'

export interface RTDBOptions {
  autoDispose?: boolean
}

/**
 * Reactive Firebase Realtime Database binding.
 *
 * @param docRef
 * @param options
 */
export function useRTDB<T = any>(
  docRef: DatabaseReference,
  options: RTDBOptions = {},
) {
  const {
    autoDispose = true,
  } = options
  const data = ref(undefined) as Ref<T | undefined>

  function update(snapshot: DataSnapshot) {
    data.value = snapshot.val()
  }

  onValue(docRef, update)

  if (autoDispose) {
    tryOnScopeDispose(() => {
      off(docRef, 'value', update)
    })
  }
  return data
}
