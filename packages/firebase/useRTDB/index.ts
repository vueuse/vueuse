import type firebase from 'firebase'
import { ref } from 'vue-demi'
import { tryOnUnmounted } from '../../core'

export function useRTDB(
  docRef: firebase.database.Reference,
) {
  const data = ref<any>(null)

  function update(snapshot: firebase.database.DataSnapshot) {
    data.value = snapshot.val()
  }

  docRef.on('value', update)

  tryOnUnmounted(() => {
    docRef.off('value', update)
  })

  return data
}
