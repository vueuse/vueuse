import { DocumentData, DocumentReference, DocumentSnapshot, onSnapshot, Query, QueryDocumentSnapshot } from 'firebase/firestore'
import { ref, Ref } from 'vue-demi'
import { isDef, tryOnScopeDispose } from '@vueuse/shared'

export interface FirestoreOptions {
  errorHandler?: (err: Error) => void
  autoDispose?: boolean
}

export type FirebaseDocRef<T> =
  Query<T> |
  DocumentReference<T>

function getData<T>(
  docRef: DocumentSnapshot<T> | QueryDocumentSnapshot<T>,
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

function isDocumentReference<T>(docRef: any): docRef is DocumentReference<T> {
  return (docRef.path?.match(/\//g) || []).length % 2 !== 0
}

export function useFirestore<T extends DocumentData> (
  docRef: DocumentReference<T>,
  initialValue: T,
  options?: FirestoreOptions
): Ref<T | null>
export function useFirestore<T extends DocumentData> (
  docRef: Query<T>,
  initialValue: T[],
  options?: FirestoreOptions
): Ref<T[]>

// nullable initial values
export function useFirestore<T extends DocumentData> (
  docRef: DocumentReference<T>,
  initialValue?: T | undefined,
  options?: FirestoreOptions,
): Ref<T | undefined | null>
export function useFirestore<T extends DocumentData> (
  docRef: Query<T>,
  initialValue?: T[],
  options?: FirestoreOptions
): Ref<T[] | undefined>

/**
 * Reactive Firestore binding. Making it straightforward to always keep your
 * local data in sync with remotes databases.
 *
 * @see https://vueuse.org/useFirestore
 * @param docRef
 * @param initialValue
 * @param options
 */
export function useFirestore<T extends DocumentData>(
  docRef: FirebaseDocRef<T>,
  initialValue: any = undefined,
  options: FirestoreOptions = {},
) {
  const {
    // eslint-disable-next-line no-console
    errorHandler = (err: Error) => console.error(err),
    autoDispose = true,
  } = options

  if (isDocumentReference<T>(docRef)) {
    const data = ref(initialValue) as Ref<T|null|undefined>

    const close = onSnapshot(docRef, (snapshot) => {
      data.value = getData(snapshot) || null
    }, errorHandler)

    tryOnScopeDispose(() => {
      close()
    })

    return data
  }
  else {
    const data = ref(initialValue) as Ref<T[] | undefined>

    const close = onSnapshot(docRef, (snapshot) => {
      data.value = snapshot.docs.map(getData).filter(isDef)
    }, errorHandler)

    if (autoDispose) {
      tryOnScopeDispose(() => {
        close()
      })
    }
    return data
  }
}
