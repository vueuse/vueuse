import type firebase from 'firebase'
import { ref, Ref } from 'vue-demi'
import { isDef, tryOnUnmounted } from '@vueuse/shared'

export interface FirestoreOptions {
  errorHandler?: (err: Error) => void
  autoDispose? : boolean
}

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
  return (docRef.path?.match(/\//g) || []).length % 2 !== 0
}

export function useFirestore<T extends firebase.firestore.DocumentData> (
  docRef: firebase.firestore.DocumentReference<T>,
  initialValue: T,
  options?: FirestoreOptions
): Ref<T | null>
export function useFirestore<T extends firebase.firestore.DocumentData> (
  docRef: firebase.firestore.Query<T>,
  initialValue: T[],
  options?: FirestoreOptions
): Ref<T[]>

// nullable initial values
export function useFirestore<T extends firebase.firestore.DocumentData> (
  docRef: firebase.firestore.DocumentReference<T>,
  initialValue?: T | undefined,
  options?: FirestoreOptions,
): Ref<T | undefined | null>
export function useFirestore<T extends firebase.firestore.DocumentData> (
  docRef: firebase.firestore.Query<T>,
  initialValue?: T[],
  options?: FirestoreOptions
): Ref<T[] | undefined>

/**
 * Reactive Firestore binding. Making it straightforward to always keep your
 * local data in sync with remotes databases.
 *
 * @link https://vueuse.org/useFirestore
 * @param docRef
 * @param initialValue
 * @param options
 */
export function useFirestore<T extends firebase.firestore.DocumentData>(
  docRef: FirebaseDocRef<T>,
  initialValue: any = undefined,
  options: FirestoreOptions = {},
) {
  const {
    errorHandler = (err: Error) => console.error(err),
    autoDispose = true,
  } = options

  if (isDocumentReference<T>(docRef)) {
    const data = ref(initialValue) as Ref<T|null|undefined>

    const close = docRef.onSnapshot((snapshot) => {
      data.value = getData(snapshot) || null
    }, errorHandler)

    tryOnUnmounted(() => {
      close()
    })

    return data
  }
  else {
    const data = ref(initialValue) as Ref<T[] | undefined>

    const close = docRef.onSnapshot((snapshot) => {
      data.value = snapshot.docs.map(getData).filter(isDef)
    }, errorHandler)

    if (autoDispose) {
      tryOnUnmounted(() => {
        close()
      })
    }
    return data
  }
}
