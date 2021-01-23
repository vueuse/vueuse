---
category: '@Firebase'
---

# useFirestore

Reactive [Firestore](https://firebase.google.com/docs/firestore) binding. Making it straightforward to **always keep your local data in sync** with remotes databases.

## Usage

```js {7,9}
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useFirestore } from '@vueuse/firebase'

const db = firebase.initializeApp({ projectId: 'MY PROJECT ID' }).firestore()

const todos = useFirestore(db.collection('todos'))
// or if you'd like to reuse the reference
const todos = useFirestore(db.collection('todos'),undefined,{autoDispose:false})

// or for doc reference 
const user = useFirestore(db.collection('users').doc('my-user-id'))
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare type FirebaseDocRef<T> =
  | firebase.firestore.Query<T>
  | firebase.firestore.DocumentReference<T>
export interface FirestoreOptions {
  errorHandler?: (err: Error) => void
}
export declare function useFirestore<T extends firebase.firestore.DocumentData>(
  docRef: firebase.firestore.DocumentReference<T>,
  initialValue: T,
  options?: FirestoreOptions
): Ref<T | null>
export declare function useFirestore<T extends firebase.firestore.DocumentData>(
  docRef: firebase.firestore.Query<T>,
  initialValue: T[],
  options?: FirestoreOptions
): Ref<T[]>
export declare function useFirestore<T extends firebase.firestore.DocumentData>(
  docRef: firebase.firestore.DocumentReference<T>,
  initialValue?: T | undefined,
  options?: FirestoreOptions
): Ref<T | undefined | null>
export declare function useFirestore<T extends firebase.firestore.DocumentData>(
  docRef: firebase.firestore.Query<T>,
  initialValue?: T[],
  options?: FirestoreOptions
): Ref<T[] | undefined>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/firebase/useFirestore/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/firebase/useFirestore/index.md)


<!--FOOTER_ENDS-->
