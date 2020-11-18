import type firebase from 'firebase'
import { ref, Ref } from 'vue-demi'
import { isDef, tryOnUnmounted } from '@vueuse/shared'

export type FirebaseDocRef<T> =
  firebase.firestore.Query<T> |
  firebase.firestore.DocumentReference<T>

function getData<T>(
  docRef: firebase.firestore.DocumentSnapshot<T> | firebase.firestore.QueryDocumentSnapshot<T>,
) {
  const data = docRef.data()

  if (data) {
    Object.defineProperty(data, 'id', {
      value: docRef.id.toString(),
      writable: false,
    })
  }

  return data
}

function isDocumentReference<T>(docRef: any): docRef is firebase.firestore.DocumentReference<T> {
  return Boolean(docRef.parent)
}

export function useFirestore<T extends firebase.firestore.DocumentData> (
  docRef: firebase.firestore.DocumentReference<T>,
  errorHandler?: (err: Error) => void,
): Ref<T|null>
export function useFirestore<T extends firebase.firestore.DocumentData> (
  docRef: firebase.firestore.Query<T>,
  errorHandler?: (err: Error) => void,
): Ref<T[]>

/**
 * Reactive Firestore binding. Making it straightforward to always keep your
 * local data in sync with remotes databases.
 *
 * @see   {@link https://vueuse.js.org/useFirestore}
 * @param docRef
 * @param errorHandler
 */
export function useFirestore<T extends firebase.firestore.DocumentData>(
  docRef: FirebaseDocRef<T>,
  errorHandler = (err: Error) => console.error(err),
) {
  if (isDocumentReference<T>(docRef)) {
    const data = ref<T|null>(null)

    const close = docRef.onSnapshot((snapshot) => {
      // @ts-ignore
      data.value = getData(snapshot) || null
    }, errorHandler)

    tryOnUnmounted(() => {
      close()
    })

    return data
  }
  else {
    const data = ref([]) as Ref<T[]>

    const close = docRef.onSnapshot((snapshot) => {
      data.value = snapshot.docs.map(getData).filter(isDef)
    }, errorHandler)

    tryOnUnmounted(() => {
      close()
    })

    return data
  }
}
