import firebase from 'firebase/app'
import { ref, onUnmounted } from 'vue-demi'

export function useRTDB(
  docRef: firebase.database.Reference,
) {
  const data = ref<any>(null)

  function update(snapshot: firebase.database.DataSnapshot) {
    data.value = snapshot.val()
  }

  docRef.on('value', update)

  onUnmounted(() => {
    docRef.off('value', update)
  })

  return data
}
