---
category: '@Firebase 9'
---

# useRTDB

Reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding. Making it straightforward to **always keep your local data in sync** with remotes databases.

## Usage

```ts
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const app = initializeApp({ databaseURL: 'https://MY-DATABASE.firebaseio.com' })
const db = getDatabase(app)
```

```ts
// in setup()
import { useRTDB } from '@vueuse/firebase/useRTDB'
import { ref } from 'firebase/database'

const todos = useRTDB(ref(db, 'todos'))
```

You can reuse the db reference by passing `autoDispose: false`

```ts
const todos = useRTDB(ref(db, 'todos'), { autoDispose: false })
```

or use `createGlobalState` from the core package

```js
// store.js
import { createGlobalState } from '@vueuse/core'
import { useRTDB } from '@vueuse/firebase/useRTDB'
import { ref } from 'firebase/database'

export const useTodos = createGlobalState(
  () => useRTDB(ref(db, 'todos')),
)
```

```js
// app.js
import { useTodos } from './store'

const todos = useTodos()
```
