/* eslint-disable handle-callback-err */
import firebase from 'firebase/app'
import { ref, onUnmounted, Ref } from '../../api'
import { isDef } from '../../utils'

export type FirebaseDocRef<T> =
  firebase.firestore.Query<T> |
  firebase.firestore.DocumentReference<T>

function getData<T> (
  doc: firebase.firestore.DocumentSnapshot<T> | firebase.firestore.QueryDocumentSnapshot<T>,
) {
  const data = doc.data()

  if (data) {
    Object.defineProperty(data, 'id', {
      value: doc.id.toString(),
      writable: false,
    })
  }

  return data
}

export function useFirestore<T extends firebase.firestore.DocumentData> (
  doc: firebase.firestore.DocumentReference<T>,
  errorHandler?: (err: Error) => void,
): Ref<T|null>
export function useFirestore<T extends firebase.firestore.DocumentData> (
  doc: firebase.firestore.Query<T>,
  errorHandler?: (err: Error) => void,
): Ref<T[]>
export function useFirestore<T extends firebase.firestore.DocumentData> (
  doc: FirebaseDocRef<T>,
  errorHandler = (err: Error) => {},
) {
  if (doc instanceof firebase.firestore.DocumentReference) {
    const data = ref<T|null>(null)

    const close = doc.onSnapshot((snapshot) => {
      data.value = getData(snapshot) || null
    }, errorHandler)

    onUnmounted(() => {
      close()
    })

    return data
  }
  else {
    const data = ref<T[]>([])

    const close = doc.onSnapshot((snapshot) => {
      data.value = snapshot.docs.map(getData).filter(isDef)
    }, errorHandler)

    onUnmounted(() => {
      close()
    })

    return data
  }
}
