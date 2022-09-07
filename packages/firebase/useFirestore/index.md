---
category: '@Firebase'
---

# useFirestore

Reactive [Firestore](https://firebase.google.com/docs/firestore) binding. Making it straightforward to **always keep your local data in sync** with remotes databases.

## Usage

```js {9,12,17}
import { computed, ref } from 'vue'
import { initializeApp } from 'firebase/app'
import { collection, doc, getFirestore, limit, orderBy, query } from 'firebase/firestore'
import { useFirestore } from '@vueuse/firebase/useFirestore'

const app = initializeApp({ projectId: 'MY PROJECT ID' })
const db = getFirestore(app)

const todos = useFirestore(collection(db, 'todos'))

// or for doc reference
const user = useFirestore(doc(db, 'users', 'my-user-id'))

// you can also use ref value for reactive query
const postLimit = ref(10)
const postsQuery = computed(() => query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(postLimit.value)))
const posts = useFirestore(postsQuery)
```

## Share across instances

You can reuse the db reference by passing `autoDispose: false`

```ts
const todos = useFirestore(collection(db, 'todos'), undefined, { autoDispose: false })
```

or use `createGlobalState` from the core package

```js
// store.js
import { createGlobalState } from '@vueuse/core'
import { useFirestore } from '@vueuse/firebase/useFirestore'

export const useTodos = createGlobalState(
  () => useFirestore(collection(db, 'todos')),
)
```

```js
// app.js
import { useTodos } from './store'

export default {
  setup() {
    const todos = useTodos()
    return { todos }
  },
}
```
