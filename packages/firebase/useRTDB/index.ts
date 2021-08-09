import type firebase from 'firebase'
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
  docRef: firebase.database.Reference,
  options: RTDBOptions = {},
) {
  const {
    autoDispose = true,
  } = options
  const data = ref(undefined) as Ref<T | undefined>

  function update(snapshot: firebase.database.DataSnapshot) {
    data.value = snapshot.val()
  }

  docRef.on('value', update)

  if (autoDispose) {
    tryOnScopeDispose(() => {
      docRef.off('value', update)
    })
  }
  return data
}
