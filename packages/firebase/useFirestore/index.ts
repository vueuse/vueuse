import type { Ref } from 'vue-demi'
import { computed, isRef, ref, watch } from 'vue-demi'
import type { DocumentData, DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot } from 'firebase/firestore'
import type { MaybeRef } from '@vueuse/shared'
import { isDef, tryOnScopeDispose } from '@vueuse/shared'
import { onSnapshot } from 'firebase/firestore'

export interface UseFirestoreOptions {
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

type Falsy = false | 0 | '' | null | undefined

export function useFirestore<T extends DocumentData>(
  maybeDocRef: MaybeRef<DocumentReference<T> | Falsy>,
  initialValue: T,
  options?: UseFirestoreOptions
): Ref<T | null>
export function useFirestore<T extends DocumentData>(
  maybeDocRef: MaybeRef<Query<T> | Falsy>,
  initialValue: T[],
  options?: UseFirestoreOptions
): Ref<T[]>

// nullable initial values
export function useFirestore<T extends DocumentData>(
  maybeDocRef: MaybeRef<DocumentReference<T> | Falsy>,
  initialValue?: T | undefined | null,
  options?: UseFirestoreOptions,
): Ref<T | undefined | null>
export function useFirestore<T extends DocumentData>(
  maybeDocRef: MaybeRef<Query<T> | Falsy>,
  initialValue?: T[],
  options?: UseFirestoreOptions
): Ref<T[] | undefined>

/**
 * Reactive Firestore binding. Making it straightforward to always keep your
 * local data in sync with remotes databases.
 *
 * @see https://vueuse.org/useFirestore
 */
export function useFirestore<T extends DocumentData>(
  maybeDocRef: MaybeRef<FirebaseDocRef<T> | Falsy>,
  initialValue: any = undefined,
  options: UseFirestoreOptions = {},
) {
  const {
    errorHandler = (err: Error) => console.error(err),
    autoDispose = true,
  } = options

  const refOfDocRef = isRef(maybeDocRef)
    ? maybeDocRef
    : computed(() => maybeDocRef)

  let close = () => { }
  const data = ref(initialValue) as Ref<T | T[] | null | undefined>

  watch(refOfDocRef, (docRef) => {
    close()
    if (!refOfDocRef.value) {
      data.value = initialValue
    }
    else if (isDocumentReference<T>(refOfDocRef.value)) {
      close = onSnapshot(docRef as DocumentReference<T>, (snapshot) => {
        data.value = getData(snapshot) || null
      }, errorHandler)
    }
    else {
      close = onSnapshot(docRef as Query<T>, (snapshot) => {
        data.value = snapshot.docs.map(getData).filter(isDef)
      }, errorHandler)
    }
  }, { immediate: true })

  if (autoDispose) {
    tryOnScopeDispose(() => {
      close()
    })
  }

  return data
}
