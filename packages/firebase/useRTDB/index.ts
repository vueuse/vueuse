import type firebase from 'firebase'
import { Ref, ref } from 'vue-demi'
import { tryOnUnmounted } from '@vueuse/shared'

/**
 * Reactive Firebase Realtime Database binding.
 *
 * @see   {@link https://vueuse.js.org/useRTDB}
 * @param docRef
 */
export function useRTDB<T = any>(
  docRef: firebase.database.Reference,
) {
  const data = ref(undefined) as Ref<T | undefined>

  function update(snapshot: firebase.database.DataSnapshot) {
    data.value = snapshot.val()
  }

  docRef.on('value', update)

  tryOnUnmounted(() => {
    docRef.off('value', update)
  })

  return data
}
