# useFirestore

> Reactive [Firestore](https://firebase.google.com/docs/firestore) binding. Making it straightforward to **always keep your local data in sync** with remotes databases.

## Usage

```js {7,9}
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useFirestore } from '@vueuse/firebase'

const db = firebase.initializeApp({ projectId: 'MY PROJECT ID' }).firestore()

const todos = useFirestore(db.collection('todos'))
// or
const user = useFirestore(db.collection('users').doc('my-user-id'))
```

## Share across instances

You can reuse the firebase reference by using [`createGlobalState`](https://vueuse.js.org/?path=/story/state--createglobalstate) from the core package

```js
// store.js
import { createGlobalState } from '@vueuse/core'
import { useFirestore } from '@vueuse/firebase'

export const useTodos = createGlobalState(
  () => useFirestore(db.collection('todos')),
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
