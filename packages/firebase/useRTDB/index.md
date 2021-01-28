---
category: '@Firebase'
---

# useRTDB

Reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding. Making it straightforward to **always keep your local data in sync** with remotes databases.

## Usage

```js
import firebase from 'firebase/app'
import 'firebase/database'
import { useRTDB } from '@vueuse/firebase'

const db = firebase
  .initializeApp({ databaseURL: 'https://MY-DATABASE.firebaseio.com' })
  .database()

// in setup()
const todos = useRTDB(db.ref('todos'))
```

You can reuse the db reference by passing `autoDispose: false`

```ts
const todos = useRTDB(db.collection('todos'), { autoDispose: false })
```

or use `createGlobalState` from the core package

```js
// store.js
import { createGlobalState } from '@vueuse/core'
import { useRTDB } from '@vueuse/firebase'

export const useTodos = createGlobalState(
  () => useRTDB(db.ref('todos')),
)
```

```js
// app.js
import { useTodos } from './store'

new Vue({
  setup() {
    const todos = useTodos()
    return { todos }
  },
})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface RTDBOptions {
  autoDispose?: boolean
}
/**
 * Reactive Firebase Realtime Database binding.
 *
 * @param docRef
 * @param options
 */
export declare function useRTDB<T = any>(
  docRef: firebase.database.Reference,
  options?: RTDBOptions
): Ref<T | undefined>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/firebase/useRTDB/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/firebase/useRTDB/index.md)


<!--FOOTER_ENDS-->
